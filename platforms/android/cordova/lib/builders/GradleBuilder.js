/*
       Licensed to the Apache Software Foundation (ASF) under one
       or more contributor license agreements.  See the NOTICE file
       distributed with this work for additional information
       regarding copyright ownership.  The ASF licenses this file
       to you under the Apache License, Version 2.0 (the
       "License"); you may not use this file except in compliance
       with the License.  You may obtain a copy of the License at

         http://www.apache.org/licenses/LICENSE-2.0

       Unless required by applicable law or agreed to in writing,
       software distributed under the License is distributed on an
       "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
       KIND, either express or implied.  See the License for the
       specific language governing permissions and limitations
       under the License.
*/

var Q = require('q');
var fs = require('fs');
var util = require('util');
var path = require('path');
var shell = require('shelljs');
var child_process = require('child_process');
var spawn = require('cordova-common').superspawn.spawn;
var CordovaError = require('cordova-common').CordovaError;
var check_reqs = require('../check_reqs');

var GenericBuilder = require('./GenericBuilder');

var MARKER = 'YOUR CHANGES WILL BE ERASED!';
var SIGNING_PROPERTIES = '-signing.properties';
var TEMPLATE =
    '# This file is automatically generated.\n' +
    '# Do not modify this file -- ' + MARKER + '\n';

function GradleBuilder (projectRoot) {
    GenericBuilder.call(this, projectRoot);

    this.binDirs = {gradle: this.binDirs.gradle};
}

util.inherits(GradleBuilder, GenericBuilder);

GradleBuilder.prototype.getArgs = function(cmd, opts) {
    if (cmd == 'release') {
        cmd = 'cdvBuildRelease';
    } else if (cmd == 'debug') {
        cmd = 'cdvBuildDebug';
    }
    var args = [cmd, '-b', path.join(this.root, 'build.gradle')];
    if (opts.arch) {
        args.push('-PcdvBuildArch=' + opts.arch);
    }

    // 10 seconds -> 6 seconds
    args.push('-Dorg.gradle.daemon=true');
    // allow NDK to be used - required by Gradle 1.5 plugin
    args.push('-Pandroid.useDeprecatedNdk=true');
    args.push.apply(args, opts.extraArgs);
    // Shaves another 100ms, but produces a "try at own risk" warning. Not worth it (yet):
    // args.push('-Dorg.gradle.parallel=true');
    return args;
};

// Makes the project buildable, minus the gradle wrapper.
GradleBuilder.prototype.prepBuildFiles = function() {
    // Update the version of build.gradle in each dependent library.
    var pluginBuildGradle = path.join(this.root, 'cordova', 'lib', 'plugin-build.gradle');
    var propertiesObj = this.readProjectProperties();
    var subProjects = propertiesObj.libs;
    for (var i = 0; i < subProjects.length; ++i) {
        if (subProjects[i] !== 'CordovaLib') {
            shell.cp('-f', pluginBuildGradle, path.join(this.root, subProjects[i], 'build.gradle'));
        }
    }

    var name = this.extractRealProjectNameFromManifest();
    //Remove the proj.id/name- prefix from projects: https://issues.apache.org/jira/browse/CB-9149
    var settingsGradlePaths =  subProjects.map(function(p){
        var realDir=p.replace(/[/\\]/g, ':');
        var libName=realDir.replace(name+'-','');
        var str='include ":'+libName+'"\n';
        if(realDir.indexOf(name+'-')!==-1)
            str+='project(":'+libName+'").projectDir = new File("'+p+'")\n';
        return str;
    });

    // Write the settings.gradle file.
    fs.writeFileSync(path.join(this.root, 'settings.gradle'),
        '// GENERATED FILE - DO NOT EDIT\n' +
        'include ":"\n' + settingsGradlePaths.join(''));
    // Update dependencies within build.gradle.
    var buildGradle = fs.readFileSync(path.join(this.root, 'build.gradle'), 'utf8');
    var depsList = '';
    subProjects.forEach(function(p) {
        var libName=p.replace(/[/\\]/g, ':').replace(name+'-','');
        depsList += '    debugCompile project(path: "' + libName + '", configuration: "debug")\n';
        depsList += '    releaseCompile project(path: "' + libName + '", configuration: "release")\n';
    });
    // For why we do this mapping: https://issues.apache.org/jira/browse/CB-8390
    var SYSTEM_LIBRARY_MAPPINGS = [
        [/^\/?extras\/android\/support\/(.*)$/, 'com.android.support:support-$1:+'],
        [/^\/?google\/google_play_services\/libproject\/google-play-services_lib\/?$/, 'com.google.android.gms:play-services:+']
    ];
    propertiesObj.systemLibs.forEach(function(p) {
        var mavenRef;
        // It's already in gradle form if it has two ':'s
        if (/:.*:/.exec(p)) {
            mavenRef = p;
        } else {
            for (var i = 0; i < SYSTEM_LIBRARY_MAPPINGS.length; ++i) {
                var pair = SYSTEM_LIBRARY_MAPPINGS[i];
                if (pair[0].exec(p)) {
                    mavenRef = p.replace(pair[0], pair[1]);
                    break;
                }
            }
            if (!mavenRef) {
                throw new CordovaError('Unsupported system library (does not work with gradle): ' + p);
            }
        }
        depsList += '    compile "' + mavenRef + '"\n';
    });
    buildGradle = buildGradle.replace(/(SUB-PROJECT DEPENDENCIES START)[\s\S]*(\/\/ SUB-PROJECT DEPENDENCIES END)/, '$1\n' + depsList + '    $2');
    var includeList = '';
    propertiesObj.gradleIncludes.forEach(function(includePath) {
        includeList += 'apply from: "' + includePath + '"\n';
    });
    buildGradle = buildGradle.replace(/(PLUGIN GRADLE EXTENSIONS START)[\s\S]*(\/\/ PLUGIN GRADLE EXTENSIONS END)/, '$1\n' + includeList + '$2');
    fs.writeFileSync(path.join(this.root, 'build.gradle'), buildGradle);
};

GradleBuilder.prototype.prepEnv = function(opts) {
    var self = this;
    return check_reqs.check_gradle()
    .then(function() {
        return self.prepBuildFiles();
    }).then(function() {
        // Copy the gradle wrapper on each build so that:
        // A) we don't require the Android SDK at project creation time, and
        // B) we always use the SDK's latest version of it.
        // check_reqs ensures that this is set.
        /*jshint -W069 */
        var sdkDir = process.env['ANDROID_HOME'];
        /*jshint +W069 */
        var wrapperDir = path.join(sdkDir, 'tools', 'templates', 'gradle', 'wrapper');
        if (process.platform == 'win32') {
            shell.rm('-f', path.join(self.root, 'gradlew.bat'));
            shell.cp(path.join(wrapperDir, 'gradlew.bat'), self.root);
        } else {
            shell.rm('-f', path.join(self.root, 'gradlew'));
            shell.cp(path.join(wrapperDir, 'gradlew'), self.root);
        }
        shell.rm('-rf', path.join(self.root, 'gradle', 'wrapper'));
        shell.mkdir('-p', path.join(self.root, 'gradle'));
        shell.cp('-r', path.join(wrapperDir, 'gradle', 'wrapper'), path.join(self.root, 'gradle'));

        // If the gradle distribution URL is set, make sure it points to version we want.
        // If it's not set, do nothing, assuming that we're using a future version of gradle that we don't want to mess with.
        // For some reason, using ^ and $ don't work.  This does the job, though.
        var distributionUrlRegex = /distributionUrl.*zip/;
        /*jshint -W069 */
        var distributionUrl = process.env['CORDOVA_ANDROID_GRADLE_DISTRIBUTION_URL'] || 'http\\://services.gradle.org/distributions/gradle-2.10-all.zip';
        /*jshint +W069 */
        var gradleWrapperPropertiesPath = path.join(self.root, 'gradle', 'wrapper', 'gradle-wrapper.properties');
        shell.chmod('u+w', gradleWrapperPropertiesPath);
        shell.sed('-i', distributionUrlRegex, 'distributionUrl='+distributionUrl, gradleWrapperPropertiesPath);

        var propertiesFile = opts.buildType + SIGNING_PROPERTIES;
        var propertiesFilePath = path.join(self.root, propertiesFile);
        if (opts.packageInfo) {
            fs.writeFileSync(propertiesFilePath, TEMPLATE + opts.packageInfo.toProperties());
        } else if (isAutoGenerated(propertiesFilePath)) {
            shell.rm('-f', propertiesFilePath);
        }
    });
};

/*
 * Builds the project with gradle.
 * Returns a promise.
 */
GradleBuilder.prototype.build = function(opts) {
    var wrapper = path.join(this.root, 'gradlew');
    var args = this.getArgs(opts.buildType == 'debug' ? 'debug' : 'release', opts);
    return spawnAndSuppressJavaOptions(wrapper, args);
};

GradleBuilder.prototype.clean = function(opts) {
    var builder = this;
    var wrapper = path.join(this.root, 'gradlew');
    var args = builder.getArgs('clean', opts);
    return Q().then(function() {
        return spawn(wrapper, args, {stdio: 'inherit'});
    })
    .then(function () {
        shell.rm('-rf', path.join(builder.root, 'out'));

        ['debug', 'release'].forEach(function(config) {
            var propertiesFilePath = path.join(builder.root, config + SIGNING_PROPERTIES);
            if(isAutoGenerated(propertiesFilePath)){
                shell.rm('-f', propertiesFilePath);
            }
        });
    });
};

module.exports = GradleBuilder;

function isAutoGenerated(file) {
    return fs.existsSync(file) && fs.readFileSync(file, 'utf8').indexOf(MARKER) > 0;
}

/**
 * A special superspawn-like implementation, required to workaround the issue
 *   with Java printing some unwanted information to stderr instead of stdout.
 *   This function suppresses 'Picked up _JAVA_OPTIONS' message from being
 *   printed to stderr. See https://issues.apache.org/jira/browse/CB-9971 for
 *   explanation.
 *
 * This function needed because superspawn does not provide a way to get and
 *   manage spawned process output streams. There is a CB-10052 which describes
 *   an improvements for superspawn, needed to get rid of this.
 * TODO: Once this improvement added to cordova-common, we could remove this functionality.
 *
 * @param   {String}    cmd   A command to spawn
 * @param   {String[]}  args  Command arguments. Note that on Windows arguments
 *   will be concatenated into string and passed to 'cmd.exe' along with '/s'
 *   and '/c' switches for proper space-in-path handling
 *
 * @return  {Promise}        A promise, rejected with error message if
 *   underlying command exits with nonzero exit code, fulfilled otherwise
 */
function spawnAndSuppressJavaOptions(cmd, args) {
    var opts = { stdio: 'pipe' };

    if (process.platform === 'win32') {
        // Work around spawn not being able to find .bat files.
        var joinedArgs = [cmd]
            .concat(args)
            .map(function(a){
                // Add quotes to arguments which contains whitespaces
                if (/^[^"].* .*[^"]/.test(a)) return '"' + a + '"';
                return a;
            }).join(' ');

        args = ['/s', '/c'].concat('"' + joinedArgs + '"');
        cmd = 'cmd';
        opts.windowsVerbatimArguments = true;
    }

    return Q.Promise(function (resolve, reject) {
        var proc = child_process.spawn(cmd, args, opts);

        proc.stdout.on('data', process.stdout.write.bind(process.stdout));
        proc.stderr.on('data', function (data) {
            var suppressThisLine = /^Picked up _JAVA_OPTIONS: /i.test(data.toString());
            if (suppressThisLine) {
                return;
            }

            process.stderr.write(data);
        });

        proc.on('exit', function(code) {
            if (code) {
                reject('Error code ' + code + ' for command: ' + cmd + ' with args: ' + args);
            } else {
                resolve();
            }
        });
    });
}
