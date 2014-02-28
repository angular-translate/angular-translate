NG_DOCS={
  "sections": {
    "api": "API Reference",
    "guide": "Guide"
  },
  "pages": [
    {
      "section": "api",
      "id": "index",
      "shortName": "API Reference",
      "type": "overview",
      "moduleName": "API Reference",
      "shortDescription": "angular-translate - API Reference",
      "keywords": "angular-translate api checkout guide overview reference works"
    },
    {
      "section": "api",
      "id": "pascalprecht.translate",
      "shortName": "pascalprecht.translate",
      "type": "overview",
      "moduleName": "pascalprecht.translate",
      "shortDescription": "The main module which holds everything together.",
      "keywords": "api holds main module overview pascalprecht translate"
    },
    {
      "section": "api",
      "id": "pascalprecht.translate.$translate",
      "shortName": "pascalprecht.translate.$translate",
      "type": "object",
      "moduleName": "pascalprecht.translate",
      "shortDescription": "The $translate service is the actual core of angular-translate. It expects a translation id",
      "keywords": "$interpolate $log $q $rootscope $scope $translate $translaterefreshend $translaterefreshstart actual angular-translate api app array asynchronous asynchronously background broadcast care case change choosed class cloakclassname compiling configured contents core current currently data directive drop dynamic en_us enabled error events existent expects fallback fallbacklanguage false file finished function handling hash headline_text hello instant instantly internal interpolate interpolateparams invoked isn ispostcompilingenabled iteration key langkey language languages load loaded loaders loading method module object optional parameters params pascalprecht pointed post preferred preferredlanguage process promise proposedlanguage refresh refreshed refreshes refreshing registered reject reload remember represents resolved returns rules runtime service set sets skipped stack start storage storagekey store storing string table tables takes target tells text throw token translate translate-cloak translatedtext translation translationid usefallbacklanguage values version"
    },
    {
      "section": "api",
      "id": "pascalprecht.translate.$translateCookieStorage",
      "shortName": "pascalprecht.translate.$translateCookieStorage",
      "type": "object",
      "moduleName": "pascalprecht.translate",
      "shortDescription": "Abstraction layer for cookieStore. This service is used when telling angular-translate",
      "keywords": "$cookiestore $translatecookiestorage abstraction angular-translate api cookiestorage cookiestore function item layer object pascalprecht returns service set sets storage telling translate"
    },
    {
      "section": "api",
      "id": "pascalprecht.translate.$translateDefaultInterpolation",
      "shortName": "pascalprecht.translate.$translateDefaultInterpolation",
      "type": "object",
      "moduleName": "pascalprecht.translate",
      "shortDescription": "Uses angular&#39;s $interpolate services to interpolate strings against some values.",
      "keywords": "$identifier $interpolate $translatedefaultinterpolation $translateinterpolator agains angular angulars api current currently function getinterpolationidentifier identifier interpolate interpolated interpolates interpolation interpolator key language locale object params pascalprecht returns service services setlocale sets string strings translate values"
    },
    {
      "section": "api",
      "id": "pascalprecht.translate.$translateLocalStorage",
      "shortName": "pascalprecht.translate.$translateLocalStorage",
      "type": "object",
      "moduleName": "pascalprecht.translate",
      "shortDescription": "Abstraction layer for localStorage. This service is used when telling angular-translate",
      "keywords": "$translatelocalstorage $window abstraction angular-translate api function item layer localstorage object pascalprecht returns service set sets storage telling translate"
    },
    {
      "section": "api",
      "id": "pascalprecht.translate.$translateMessageFormatInterpolation",
      "shortName": "pascalprecht.translate.$translateMessageFormatInterpolation",
      "type": "object",
      "moduleName": "pascalprecht.translate",
      "shortDescription": "Uses MessageFormat.js to interpolate strings against some values.",
      "keywords": "$identifier $translateinterpolator $translatemessageformatinterpolation agains api current currently function getinterpolationidentifier identifier interpolate interpolated interpolates interpolation interpolator js key language locale messageformat object params pascalprecht returns service setlocale sets string strings translate translate_mf_interpolation_cache values"
    },
    {
      "section": "api",
      "id": "pascalprecht.translate.$translateMissingTranslationHandlerLog",
      "shortName": "pascalprecht.translate.$translateMissingTranslationHandlerLog",
      "type": "object",
      "moduleName": "pascalprecht.translate",
      "shortDescription": "Uses angular&#39;s $log service to give a warning when trying to translate a",
      "keywords": "$log $translatemissingtranslationhandlerlog angular api doesn exist function handler object pascalprecht service translate translation warning"
    },
    {
      "section": "api",
      "id": "pascalprecht.translate.$translatePartialLoader",
      "shortName": "pascalprecht.translate.$translatePartialLoader",
      "type": "object",
      "moduleName": "pascalprecht.translate",
      "shortDescription": "",
      "keywords": "$http $injector $q $rootscope $translatepartialloader $translatepartialloaderstructurechanged active add additional addpart angular-translate api asks availability browser called case chainable checks completely data delete deleted deletepart deletes deletion deprecated event fired function future indicator ispartavailable loaded loader loaders loading logically marks method non-empty note object options param parts pascalprecht pass perform physically prevent prevents process recompiled recycling registers remaining remove removedata requests returns reused server set table target throw time translate translation translations type wrong xhr"
    },
    {
      "section": "api",
      "id": "pascalprecht.translate.$translatePartialLoaderProvider",
      "shortName": "pascalprecht.translate.$translatePartialLoaderProvider",
      "type": "object",
      "moduleName": "pascalprecht.translate",
      "shortDescription": "By using a $translatePartialLoaderProvider you can configure a list of a needed",
      "keywords": "$translatepartialloaderprovider add addpart angular-translate api application asks avoids chainable check checks configuration configure data delete deletepart directly function future ispartavailable lang language lifetime list load loaded loader loading method needed non-empty note object param params parts pascalprecht pass phase provider registers removes returns runtime server set setpart sets specific startup table target throw translate translation type wrong"
    },
    {
      "section": "api",
      "id": "pascalprecht.translate.$translateProvider",
      "shortName": "pascalprecht.translate.$translateProvider",
      "type": "object",
      "moduleName": "pascalprecht.translate",
      "shortDescription": "$translateProvider allows developers to register translation-tables, asynchronous loaders",
      "keywords": "$compile $injector $translatecookiestorage $translatelocalstorage $translateprovider $translatestaticfilesloader $translateurlloader actual add addinterpolation adds alias aliases allows angular-translate angularjs api app application-wide argument arguments array asynchronous automatically behavior best browser browsers build built-in called change choosed class cloakclassname combination compiling config configuration configure considering convention correct custom customhandler de_de default define defined dep1 dep2 depending determine determinepreferredlanguage developers directive directly doesn don en_us enabled error example exist expects extended extension factory fallbacklanguage find fitting fn format function functionality gender getlocale greeting hallo handler hello high implement indicator indicators initial inside instantiated interface internally interpolation invoking isn javascript job js key langkey language languagekeys languages layer left level ll loaded loader loaderfactory loaders locale log manage map messageformat method methods missing missingtranslationhandler module multiple not_found object optional options parameter pascalprecht pass passing plain pluralization post preferred preferredlanguage prefix processed provided register registeravailablelanguagekeys registered registering registers represent represents result return returns risk sanitation selection service services set sets setting shortcut simply specific startup storage storagekey storageprefix strategy string style table tables tells throw translate translate-cloak translated translation translation-tables translationid translationnotfoundindicator translationnotfoundindicatorleft translationnotfoundindicatorright translations translationtable type url usecookiestorage useinterpolation useloader uselocalstorage usemessageformatinterpolation usemissingtranslationhandler usemissingtranslationhandlerlog usepostcompiling user usesanitizestrategy usestaticfilesloader usestorage useurlloader valid values welt whitespace work world"
    },
    {
      "section": "api",
      "id": "pascalprecht.translate.$translateStaticFilesLoader",
      "shortName": "pascalprecht.translate.$translateStaticFilesLoader",
      "type": "object",
      "moduleName": "pascalprecht.translate",
      "shortDescription": "Creates a loading function for a typical static file url pattern:",
      "keywords": "$http $q $translatestaticfilesloader api builder creates file function json key key-value lang-de_de lang-en_us loading object options pairs pascalprecht pattern prefix response static suffix translate typical url urls"
    },
    {
      "section": "api",
      "id": "pascalprecht.translate.$translateUrlLoader",
      "shortName": "pascalprecht.translate.$translateUrlLoader",
      "type": "object",
      "moduleName": "pascalprecht.translate",
      "shortDescription": "Creates a loading function for a typical dynamic url pattern:",
      "keywords": "$http $q $translateurlloader api applied creates current dynamic function key key-value language loading locale object options pairs pascalprecht pattern php prefixing requested response service translate typical url urls"
    },
    {
      "section": "api",
      "id": "pascalprecht.translate.directive:translate",
      "shortName": "translate",
      "type": "directive",
      "moduleName": "pascalprecht.translate",
      "shortDescription": "Translates given translation id either through attribute or DOM content.",
      "keywords": "$compile $digest $filter $interpolate $rootscope $scope $translateprovider angular api attribute config content controller directive dom dynamic element expect filter function hello html inject internally interpolated js literal module ng-controller ngview object optional pascalprecht pass passed scenario script string text tobe translate translate-values translatectrl translates translation translation_id translationid translations values with_values"
    },
    {
      "section": "api",
      "id": "pascalprecht.translate.directive:translateCloak",
      "shortName": "translateCloak",
      "type": "directive",
      "moduleName": "pascalprecht.translate",
      "keywords": "$description $rootscope $translate adds api applied asynchronously class data directive element finished flickering initial initially loader loading pascalprecht prevent removes required string translate translate-cloak translation"
    },
    {
      "section": "api",
      "id": "pascalprecht.translate.filter:translate",
      "shortName": "translate",
      "type": "filter",
      "moduleName": "pascalprecht.translate",
      "shortDescription": "Uses $translate service to translate contents. Accepts interpolate parameters",
      "keywords": "$parse $scope $translate $translateprovider accepts angular api config contents controller dynamic dynamized filter function hash hello html interpolate interpolateparams js literal module ng-controller ngview object optional parameters pascalprecht pass script service string text translate translatectrl translated translation translation_id translationid translations values with_values"
    },
    {
      "section": "guide",
      "id": "index",
      "shortName": "概观",
      "type": "overview",
      "moduleName": "概观",
      "shortDescription": "国际化你的 Angular 应用程序是如此的轻松",
      "keywords": "$translateprovider _i angular angular-translate angularjs app bower comment-773 config de dies ein en foo function github google guide hallo hello html install ist it_ js love module myapp neoskop ng-newsletter ngmodules org overview paragraph pascalprecht path plnkr preferredlanguage repository src title translate translations unicorn var wordpress"
    },
    {
      "section": "guide",
      "id": "00_installation",
      "shortName": "安装",
      "type": "overview",
      "moduleName": "安装",
      "shortDescription": "安装",
      "keywords": "angular-translate angular-translate-interpolation-default angular-translates bower build clone conf dist estrunner git github grunt gruntfile guide html install js karma love midway min npm overview start testrunner unicorn unit"
    },
    {
      "section": "guide",
      "id": "01_conceptual-overview",
      "shortName": "概念概述",
      "type": "overview",
      "moduleName": "概念概述",
      "shortDescription": "概念概述",
      "keywords": "$translate angular angular-translate class cookiestorage guide img localstorage love overview padding-left png pull-right src staticfilesloader style unicorn urlloader"
    },
    {
      "section": "guide",
      "id": "02_getting-started",
      "shortName": "入门",
      "type": "overview",
      "moduleName": "入门",
      "shortDescription": "入门",
      "keywords": "$location $locationprovider $route $routeprovider $translate $translateprovider add angular angular-translate another_namespace app awesome bar change charset concrete config controller en features foo function guide hash headline html5mode js json language ll love module myapp namespace namespaced ng-app ok_text overview paragraph pascalprecht path preferredlanguage some_namespace somefancyctrl specific src srsly sub_namespace table templateurl text translate translates translation translation_id translation_id1 translations unicorn url utf-8 var"
    },
    {
      "section": "guide",
      "id": "03_using-translate-service",
      "shortName": "使用 $translate 服务",
      "type": "overview",
      "moduleName": "使用 $translate 服务",
      "shortDescription": "使用 $translate 服务",
      "keywords": "$emit $on $rooscope $rootscope $scope $translate $translatechangesucces $translatechangesuccess $translateprovider add angular angular-translate anotherone app awesome config controller ctrl en expose features function guide headline love module myapp namespace namespaced_paragraph ng-app ng-controller overview paragraph pascalprecht preferredlanguage service srsly table translate translation translations unicorn var"
    },
    {
      "section": "guide",
      "id": "04_using-translate-filter",
      "shortName": "使用翻译过滤器",
      "type": "overview",
      "moduleName": "使用翻译过滤器",
      "shortDescription": "使用翻译过滤器",
      "keywords": "$scope $translate $translateprovider add angular angular-translate angularjs app awesome config controller ctrl en filters function generalusage guide headline love module myapp ng-controller org overview paragraph pascalprecht preferredlanguage srsly table templates translate translation translation_id translations unicorn using_filters var"
    },
    {
      "section": "guide",
      "id": "05_using-translate-directive",
      "shortName": "使用翻译指令",
      "type": "overview",
      "moduleName": "使用翻译指令",
      "shortDescription": "使用翻译指令",
      "keywords": "$compile $scope $translateprovider add addition angular angular-translate app attribute awesome beginners behavior best better case choose compiling concrete config contents context controller cool couldn covered ctrl current dataset directive disable dynamically en enable enabled example expected expressions false feature filter filters flexible function general globally great guide ha handle headline hey identifier ids interpolate interpolated isn iterator layer looping love module myapp ng-controller offers overview paragraph pascalprecht pass passed passed_as_attribute passed_as_interpolation passed_as_text post preferredlanguage processed represents scope sets srsly starting table text texts translate translate-compile translation translation_id translations turned unicorn update updated usage usepostcompiling var version view watch ways work works wouldn yeah"
    },
    {
      "section": "guide",
      "id": "06_variable-replacement",
      "shortName": "变量替换",
      "type": "overview",
      "moduleName": "变量替换",
      "shortDescription": "变量替换",
      "keywords": "$scope $translate $translateprovider _n_ _you achieve add angular angular-translate app argument attribute attributes awesome beginners bind bit bringing case cases code combine components config constant controller cool corresponding course covered ctrl currently custom declarative declare default define depends described directive display dynamic easy-peasy en evaluated exactly example expects explicitly exposes expression extend feature filter filters forward function greeting guide guides ha handle hard hash haven headline hey html identifier internally interpolate interpolated interpolation introduction isn javascript key-value lastlogin learned literal logged love mails_ managed message module myapp named neat ng-controller nice notification number object optional overview pairs paragraph parameters parsed pascal pascalprecht pascalprect pass passed passed_as_attribute passed_as_interpolation passed_as_text passing placeholder plain preferredlanguage prefix pretty read received rely replace replacement replacements required scope second service services simply sold somescopeobject specific srsly straight string syntax table text time translate translate-value- translate-value-name translate-values translation translation_id translationdata translations unicorn update username values var variable variable_replacement ve version wanna ways work working works yeap"
    },
    {
      "section": "guide",
      "id": "07_multi-language",
      "shortName": "多语言",
      "type": "overview",
      "moduleName": "多语言",
      "shortDescription": "多语言",
      "keywords": "$scope $translate $translateprovider add adding als anf angular angular-translate app apps argument asynchronous attribut attribute automatically aware awesome bad basic beginners belongs bin browser browserlanguage button button_lang_de button_lang_en buttons calling calls cases change changelanguage code combination components config controller controllers controls cool corresponding course covered ctrl current custom de decide default detail determine determinepreferredlanguage determines determining deutsch directive doesn dynamic ein en englisch english ernsthaft expect expects extend fallbacklanguage feeling find fit function functionality german going good greeting gro guide ha hallo happen hasn headline hello hey html ich ids implement interesting internally interpolated interpolation interpoliert introduced invokes key language languages learn learned learning level limit ll loaded loaders loading logic love method missing missing_translation modul module multi myapp navigator needed ng-click ng-controller object oder oops order overview paragraph pascalprecht pass passed passed_as_attribute passed_as_interpolation passed_as_text passing points practice prefer preferred preferredlangkey preferredlanguage pretty properties provide ready recognize registered registers registration replacement return returns risk runtime sample scope searches second service setting setup simple srsly started storage support switch switching systemlanguage table tables teach teaching tells text things time translate translate-values translated translation translations translationsde translationsen turns unicorn update usage userlanguage values var variable_replacement ve version voil welt window work world wurde"
    },
    {
      "section": "guide",
      "id": "08_fallback-languages",
      "shortName": "回退语言",
      "type": "overview",
      "moduleName": "回退语言",
      "shortDescription": "回退语言",
      "keywords": "$scope $translate $translateprovider angular-translate changelanguage de en fallbacklanguage fr function guide langkey love overview translations unicorn usefallbacklanguage"
    },
    {
      "section": "guide",
      "id": "09_language-negotiation",
      "shortName": "语言谈判",
      "type": "overview",
      "moduleName": "语言谈判",
      "shortDescription": "语言谈判",
      "keywords": "$translateprovider angular-translate de de_ch de_de determinepreferredlanguage en en_uk en_us guide love multi-language_determining-preferred-language-automatically overview registeravailablelanguagekeys translations unicorn"
    },
    {
      "section": "guide",
      "id": "10_storages",
      "shortName": "存储",
      "type": "overview",
      "moduleName": "存储",
      "shortDescription": "存储",
      "keywords": "$scope $translate $translateprovider add als anf angular angular-translate angular-translate-storage-cookie angular-translate-storage-local app attribut attribute awesome beginners bin bower button_lang_de button_lang_en changelanguage config controller cool ctrl de deutsch ein en englisch english ernsthaft function german gro guide ha headline hey ich install interpolated interpoliert language localstorage love modul module myapp ng-click ng-controller ngcookies oder overview paragraph pascalprecht passed passed_as_attribute passed_as_interpolation passed_as_text preferredlanguage remember srsly tables text translate translate-values translation translations translationsde translationsen unicorn usecookiestorage uselocalstorage var variable_replacement wurde"
    },
    {
      "section": "guide",
      "id": "11_custom-storages",
      "shortName": "自定义存储",
      "type": "overview",
      "moduleName": "自定义存储",
      "shortDescription": "自定义存储",
      "keywords": "$injector $scope $translate $translateprovider add als anf angular angular-translate app attribut attribute awesome beginners bin button_lang_de button_lang_en changelanguage config controller cookiesstorage cookiestorage cool ctrl customstorage de deutsch ein en englisch english ernsthaft factory function german gro guide ha headline hey ich interpolated interpoliert language localstorage love modul module myapp ng-click ng-controller ngcookies oder overview paragraph pascalprecht passed passed_as_attribute passed_as_interpolation passed_as_text preferredlanguage remember request return set srsly store tables text translate translate-values translation translations translationsde translationsen unicorn usecookiestorage uselocalstorage usestorage var variable_replacement wurde"
    },
    {
      "section": "guide",
      "id": "12_asynchronous-loading",
      "shortName": "异步加载",
      "type": "overview",
      "moduleName": "异步加载",
      "shortDescription": "异步加载",
      "keywords": "$on $rootscope $scope $translate $translatepartialloader $translatepartialloaderprovider $translatepartialloaderstructurechanged $translateprovider $translaterpartialloaderprovider addpart als anf angular angular-translate angular-translate-loader-partial angular-translate-loader-static-files angular-translate-loader-url app attribut attribute awesome beginners bin bower button_lang_de button_lang_en changelanguage config configures contact contactctrl controller cool ctrl data de deutsch ein en englisch english ernsthaft foo fouc function german gro guide ha headline hello hello_text hey ich install interpolated interpoliert json lang load locale- locale-de locale-en love main mainapp modul module myapp ng-click ng-controller ngcookies ngroute oder overview paragraph partialloader pascalprecht passed passed_as_attribute passed_as_interpolation passed_as_text preferredlanguage prefix provider refresh srsly startup staticfilesloader suffix table text translate translate-values translations unicorn urlloader urltemplate useloader usestaticfilesloader useurlloader var variable_replacement world wurde"
    },
    {
      "section": "guide",
      "id": "13_custom-loaders",
      "shortName": "自定义加载器",
      "type": "overview",
      "moduleName": "自定义加载器",
      "shortDescription": "自定义加载器",
      "keywords": "$http $injector $q $scope $timeout $translate $translateprovider als anf angular angular-translate app asyncloader attribut attribute awesome bar beginners bin button_lang_de button_lang_en changelanguage config controller cool ctrl customloader data de defer deferred deutsch ein en englisch english ernsthaft factory files foo fooooo function german gro guide ha headline hey ich interpolated interpoliert key language load loaderfn localization love modul module myapp ng-click ng-controller ngcookies oder options overview paragraph pascalprecht passed passed_as_attribute passed_as_interpolation passed_as_text preferredlanguage promise reject resolve return srsly text translate translate-values translation translations unicorn useloader usestaticfilesloader useurlloader var variable_replacement wurde"
    },
    {
      "section": "guide",
      "id": "14_pluralization",
      "shortName": "多元化",
      "type": "overview",
      "moduleName": "多元化",
      "shortDescription": "多元化",
      "keywords": "$scope $translate $translatemessageformatinterpolation $translateprovider addinterpolation angular angular-translate angular-translate-interpolation-messageformat app benutze bin bower button_lang_de button_lang_en changelanguage config controller ctrl de default default_interpolation deutsch directive dynamic eine en englisch english es fand fanden female filter function gender german guide guide_ gut headline ich icu-project install interpolation js like_text love male messageformat mf_interpolation module myapp named-keys ng-click ng-controller org overview pascalprecht path plural pluralformat preferredlanguage select selectformat service sexton simple-variable-replacement spec src text translate translate-interpolation translate-values translation translations unicorn usemessageformatinterpolation user val var"
    },
    {
      "section": "guide",
      "id": "15_custom-interpolators",
      "shortName": "自定义内插器",
      "type": "overview",
      "moduleName": "自定义内插器",
      "shortDescription": "自定义内插器",
      "keywords": "$interpolate $locale $scope $translate $translateprovider add addinterpolation addition alright angular angular-translate app appends basic benutze bin build building button_lang_de button_lang_en changelanguage chapters config controller cool ctrl current currently custom custominterpolation de default deutsch eine en englisch english es exactly expects explicitly factory familiar fand fanden features female follow friend function german getinterpolationidentifier guide gut headline ich identifier implement implementing implements integrate interface interpolate interpolateparams interpolates interpolatgeparams interpolation interpolations language learned library loaders locale logic loose love male mapped messageformat method methods module myapp ng-click ng-controller object optional override overridinginterpolationtemporarily overview params pascalprecht plug plural preferredlanguage prepends pretty previous provided read remember return returns runtime select service services setlocale sets simply smaller smart specific start storages store string strings structure text things translate translate-values translations type unicorn useinterpolation useloader usestorage val var ve work"
    },
    {
      "section": "guide",
      "id": "16_error-handling",
      "shortName": "错误处理",
      "type": "overview",
      "moduleName": "错误处理",
      "shortDescription": "错误处理",
      "keywords": "$scope $translate $translateprovider also_not_existing angular angular-translate angular-translate-handler-log app benutze bin bower button_lang_de button_lang_en changelanguage config controller ctrl de default deutsch eine en englisch english es fand fanden female function german guide gut headline ich install interpolation love male module myapp ng-click ng-controller not_existing overview pascalprecht plural preferredlanguage select text translate translations unicorn usemissingtranslationhandlerlog val var"
    },
    {
      "section": "guide",
      "id": "17_custom-error-handler",
      "shortName": "自定义错误处理程序",
      "type": "overview",
      "moduleName": "自定义错误处理程序",
      "shortDescription": "自定义错误处理程序",
      "keywords": "$translateprovider angular angular-translate app custom define dep1 dep2 factory function guide handler love module myapp mycustomhandlerfactory overview pascalprecht return tranlation translate unicorn usemissingtranslationhandler usemissingtranslationhandlerlog var"
    },
    {
      "section": "guide",
      "id": "18_events",
      "shortName": "事件",
      "type": "overview",
      "moduleName": "事件",
      "shortDescription": "Events",
      "keywords": "$rootscope $scope $translate $translatechangeend $translatechangeerror $translatechangestart $translatechangesuccess $translateloadingend $translateloadingerror $translateloadingstart $translateloadingsuccess $translatepartialloaderstructurechanged angular-translate events guide overview translatepartialloader"
    },
    {
      "section": "guide",
      "id": "19_security",
      "shortName": "安全性",
      "type": "overview",
      "moduleName": "安全性",
      "shortDescription": "转义的变量内容",
      "keywords": "$scope $translateprovider angular angular-translate app color config controller ctrl en enable escape escaped escaping function guide headline hello html javascript love module myapp ng-controller nul org overview owasp paragraph pascalprecht php preferredlanguage standard style translate translate-values translations unicorn usesanitizevaluestrategy var xss"
    },
    {
      "section": "guide",
      "id": "20_tools",
      "shortName": "工具",
      "type": "overview",
      "moduleName": "工具",
      "shortDescription": "工具",
      "keywords": "app boolean cleanprevstrings create default dev devonefile dist false file files generate github grunt grunt-angular-translate grunt-po2json-angular-translate guide initconfig install js json loadnpmtasks msgid names npm options optionsenablealtplaceholders optionsuppercaseid overview pluralization po po2json_angular_translate pretty single strings test tmp true type uppercaseid your_target"
    },
    {
      "section": "guide",
      "id": "21_migration-guide",
      "shortName": "迁移指南",
      "type": "overview",
      "moduleName": "迁移指南",
      "shortDescription": "1.1.1 -&gt; 2.0.0",
      "keywords": "$on $rootscope $scope $translate $translateprovider angular-translate en function github greetings guide hello instant interpolateparams js mit overview stringfromservice translate translation translationid translations unable var wtfpl"
    }
  ],
  "apis": {
    "api": true,
    "guide": false
  },
  "html5Mode": false,
  "startPage": "/guide",
  "scripts": [
    "bootstrap-dropdown.js",
    "messageformat.js",
    "de.js",
    "angular.min.js",
    "angular-cookies.min.js",
    "angular-translate.min.js",
    "angular-translate-interpolation-messageformat.min.js",
    "angular-translate-storage-cookie.min.js",
    "angular-translate-storage-local.min.js",
    "angular-translate-loader-static-files.min.js",
    "angular-translate-handler-log.min.js"
  ]
};