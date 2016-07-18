/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
        var text = "&lt;h1&gt;Quo modo autem optimum, si bonum praeterea nullum est?&lt;/h1&gt;&lt;p&gt;Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quem enim ardorem studii censet s fuisse in Archimede, qui dum in pulvere quaedam describit attentius, ne patriam quidem captam esse senserit? Duo Reges: constructio interrete. Mihi autem nihil tam perspicuum videtur, quam has sententias eorum philosophorum re inter se magis quam verbis dissidere; Se dicere inter honestum et turpe nimium quantum, nescio quid inmensum, inter ceteras res nihil omnino interesse. Modo etiam paulum ad dexteram de via declinavi, ut ad Pericli sepulcrum accederem. Cupiditates non Epicuri divisione finiebat, sed sua satietate. Est tamen ea secundum naturam multoque nos ad se expetendam magis hortatur quam superiora omnia. &lt;/p&gt;&lt;pre&gt;" +
"Quid enim dicis omne animal, simul atque sit ortum, applicatum esse ad se diligendum esseque in se conservando occupatum? Nec tamen ille erat sapiens quis enim hoc aut quando aut ubi aut unde? &lt;/pre&gt;&lt;p&gt;Et quae per vim oblatum stuprum volontaria morte lueret inventa est et qui interficeret filiam, ne stupraretur. Ab his oratores, ab his imperatores ac rerum publicarum principes extiterunt. &lt;b&gt;Non igitur bene.&lt;/b&gt; Nihil ad rem! Ne sit sane; Sed et illum, quem nominavi, et ceteros sophistas, ut e Platone intellegi potest, lusos videmus a Socrate. &lt;a href='http://loripsum.net/' target='_blank'&gt;Nos paucis ad haec additis finem faciamus aliquando;&lt;/a&gt; Sed erat aequius Triarium aliquid de dissensione nostra iudicare. Bonum appello quicquid secundurn naturam est, quod contra malum, nec ego solus, sed tu etiam, Chrysippe, in foro, domi; &lt;/p&gt;&lt;ol&gt;&lt;li&gt;Sin dicit obscurari quaedam nec apparere, quia valde parva sint, nos quoque concedimus;&lt;/li&gt;&lt;li&gt;Dic in quovis conventu te omnia facere, ne doleas.&lt;/li&gt;&lt;li&gt;Praeterea sublata cognitione et scientia tollitur omnis ratio et vitae degendae et rerum gerendarum.&lt;/li&gt;&lt;li&gt;Tum ille timide vel potius verecunde: Facio, inquit.&lt;/li&gt;&lt;/ol&gt;&lt;p&gt;Restincta enim sitis stabilitatem voluptatis habet, inquit, illa autem voluptas ipsius restinctionis in motu est. &lt;a href='http://loripsum.net/' target='_blank'&gt;Quis istum dolorem timet?&lt;/a&gt; An vero, inquit, quisquam potest probare, quod perceptfum, quod. Ita graviter et severe voluptatem secrevit a bono. Non pugnem cum homine, cur tantum habeat in natura boni; Eaedem res maneant alio modo. Quid est igitur, cur ita semper deum appellet Epicurus beatum et aeternum? Equidem etiam Epicurum, in physicis quidem, Democriteum puto. &lt;/p&gt;&lt;ul&gt;&lt;li&gt;Vos autem cum perspicuis dubia debeatis illustrare, dubiis perspicua conamini tollere.&lt;/li&gt;&lt;li&gt;An hoc usque quaque, aliter in vita?&lt;/li&gt;&lt;li&gt;Atqui, inquam, Cato, si istud optinueris, traducas me ad te totum licebit.&lt;/li&gt;&lt;/ul&gt;&lt;dl&gt;&lt;dt&gt;&lt;dfn&gt;Stoicos roga.&lt;/dfn&gt;&lt;/dt&gt;&lt;dd&gt;Quae dici eadem de ceteris virtutibus possunt, quarum omnium fundamenta vos in voluptate tamquam in aqua ponitis.&lt;/dd&gt;&lt;dt&gt;&lt;dfn&gt;Audeo dicere, inquit.&lt;/dfn&gt;&lt;/dt&gt;&lt;dd&gt;Cur igitur, inquam, res tam dissimiles eodem nomine appellas?&lt;/dd&gt;&lt;dt&gt;&lt;dfn&gt;Moriatur, inquit.&lt;/dfn&gt;&lt;/dt&gt;&lt;dd&gt;Itaque ab his ordiamur.&lt;/dd&gt;&lt;dt&gt;&lt;dfn&gt;Quonam, inquit, modo?&lt;/dfn&gt;&lt;/dt&gt;&lt;dd&gt;Te enim iudicem aequum puto, modo quae dicat ille bene noris.&lt;/dd&gt;&lt;/dl&gt;&lt;p&gt;&lt;a href='http://loripsum.net/' target='_blank'&gt;Ostendit pedes et pectus.&lt;/a&gt; Quae si potest singula consolando levare, universa quo modo sustinebit? Idque testamento cavebit is, qui nobis quasi oraculum ediderit nihil post mortem ad nos pertinere? Quis est, qui non oderit libidinosam, protervam adolescentiam? Nec enim figura corporis nec ratio excellens ingenii humani significat ad unam hanc rem natum hominem, ut frueretur voluptatibus. &lt;a href='http://loripsum.net/' target='_blank'&gt;Qui convenit?&lt;/a&gt; &lt;/p&gt;&lt;blockquote cite='http://loripsum.net'&gt;An id exploratum cuiquam potest esse, quo modo se hoc habiturum sit corpus, non dico ad annum, sed ad vesperum?&lt;/blockquote&gt;&lt;p&gt;Ergo infelix una molestia, fellx rursus, cum is ipse anulus in praecordiis piscis inventus est? &lt;b&gt;Negare non possum.&lt;/b&gt; Quis est, qui non oderit libidinosam, protervam adolescentiam? Quae cum ita sint, effectum est nihil esse malum, quod turpe non sit. Ex eorum enim scriptis et institutis cum omnis doctrina liberalis, omnis historia. &lt;/p&gt;";
        window.html2pdf.create(
            encodeURI(text),
            //"~/Documents/test.pdf", // on iOS,
             "test.pdf", //on Android (will be stored in /mnt/sdcard/at.modalog.cordova.plugin.html2pdf/test.pdf)
            success,
            error
        );
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

app.initialize();