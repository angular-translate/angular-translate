# angular-translate [![Build Status](https://travis-ci.org/PascalPrecht/angular-translate.png?branch=master)](https://travis-ci.org/PascalPrecht/angular-translate) [![Build Status](https://travis-ci.org/PascalPrecht/angular-translate.png?branch=canary)](https://travis-ci.org/PascalPrecht/angular-translate) [![Dependency Status](https://gemnasium.com/PascalPrecht/angular-translate.png)](https://gemnasium.com/PascalPrecht/angular-translate)

> i18n in your AngularJS apps

Checkout the [demos](https://github.com/PascalPrecht/angular-translate/wiki/Demos) and [help out](CONTRIBUTING.md) making things better. You can start by reading the [docs](https://github.com/PascalPrecht/angular-translate/wiki).
If you like the module and use it in your projects, make it public on [ngmodules](http://ngmodules.org/modules/angular-translate)!

There's also a [mailinglist](https://groups.google.com/forum/#!forum/angular-translate) for questions and discussions.

### Features
* translate filter
* translate directive
* translate service
* multi-lang support
* asynchronous/lazy loading support

**Attention:** Since we're currently working on a specification for [Reusable Angular Components](https://github.com/PascalPrecht/angular-component-spec/tree/proposal), this project will have some breaking changes once the spec is called final.

angular-translate will be free forever! How about some love?

<a href='http://www.pledgie.com/campaigns/20186'><img alt='Click here to lend your support to: angular-translate and make a donation at www.pledgie.com !' src='http://www.pledgie.com/campaigns/20186.png?skin_name=chrome' border='0' /></a>


## Quick Start
Install module via Bower:
````
$ bower install angular-translate
````

Inject <code>angular-translate</code> module as a dependency into your app:

````
var app = angular.module('myApp', ['pascalprecht.translate']);
````

Teach <code>$translateProvider</code> translations:

````
app.config(['$translateProvider', function ($translateProvider) {
  $translateProvider.translations({
    'TITLE': 'Hello',
    'FOO': 'This is a paragraph',
  });
}]);
````

Translate your app:
````
<h1>{{ 'TITLE' | translate }}</h1>
<p>{{ 'FOO' | translate }}</p>
````

To learn what else is possible, read the full [documentation](https://github.com/PascalPrecht/angular-translate/wiki).

### Extensions
There are some pretty cool extensions you probably find interesting:

* [Storage: $translateCookiteStorage](https://github.com/PascalPrecht/angular-translate-storage-cookie)
* [Storage: $translateLocalStorage](https://github.com/PascalPrecht/angular-translate-storage-local)
* [Loader: $translateUrlLoader](https://github.com/PascalPrecht/angular-translate-loader-url)
* [Loader: $translateStaticFilesLoader](https://github.com/PascalPrecht/angular-translate-loader-static-files)

## Contributors

Special thanks are going to the following devs who put a lot of love into this module:

* Jan Philipp - [@knalli](https://github.com/knalli)
* James Andres - [@jamesandres](https://github.com/jamesandres)
* Andy Joslin - [@ajoslin](https://github.com/ajoslin)
* [@DWand](https://github.com/DWand)

[![WTFPL](http://www.wtfpl.net/wp-content/uploads/2012/12/wtfpl-badge-4.png)](http://wtfpl.net)
