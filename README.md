# ngTranslate [![Build Status](https://travis-ci.org/PascalPrecht/ng-translate.png?branch=master)](https://travis-ci.org/PascalPrecht/ng-translate) [![Build Status](https://travis-ci.org/PascalPrecht/ng-translate.png?branch=canary)](https://travis-ci.org/PascalPrecht/ng-translate) [![Dependency Status](https://gemnasium.com/PascalPrecht/ng-translate.png)](https://gemnasium.com/PascalPrecht/ng-translate)

> i18n in your AngularJS apps

Checkout the [demos](#demos) and [help out](CONTRIBUTING.md) making things better. You can start by reading the [docs](#documentation).

If you like the module and use it in your projects, make it public on [ngmodules](http://ngmodules.org/modules/ngTranslate)!

## Quick Start
Install module via Bower:
````
$ bower install angular-translate
````

Inject <code>ngTranslate</code> module as a dependency into your app:

````
var app = angular.module('myApp', ['ngTranslate']);
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

To learn what else is possible, read the full [documentation](#documentation).

## Documentation

### Table Of Contents

* **[Installation](#installation)**
  * [Installing dependencies](#installing-dependencies)
  * [Installing via Bower](#installing-via-bower)
  * [Installing with Git](#installing-with-git)
  * [Running provided unit tests](#running-provided-unit-tests)
  * [Building from source](#building-from-source)
* **[Getting started](#getting-started)**
  * [Configuring $translateProvider](#configuring-translateprovider)
  * [Using $translate service](#using-translate-service)
  * [Using translate filter](#using-translate-filter)
  * [Using translate directive](#using-translate-directive)
* **[Dynamize your translations](#dynamize-your-translations)**
  * [Passing values through $translate service](#passing-values-through-translate-service)
  * [Parametrizing the translate filter](#parametrizing-the-translate-filter)
  * [Using translate directives 'values' attribute](#using-translate-directives-values-attribute)
* **[Multi-language](#multi-language)**
  * [Teaching $translateProvider more languages](#teaching-translateprovider-more-languages)
  * [Let your app remenber the languages](#let-your-app-remember-the-languages)
* **[Demos](#demos)**
* **[Contributing](#contributing)**
* **[Similar Projects](#similar-projects)**

## Installation

### Installing dependencies

These tools are used during the development of <code>ngTranslate</code>, so you should
consider install them on your machine to make sure things work properly.

Please install the following tools:

- [Grunt](http://gruntjs.com)
- [Karma Testrunner](http://karma-runner.github.com/0.8/index.html)
- [Bower](https://github.com/twitter/bower)


### Installing via Bower

You can install a <code>ngTranslate</code> package very easily using Bower. After
installing Bower on your machine, simply run:
````
$ bower install angular-translate
````
This will install a package in your configured components folder. You can watch the
bower package repository [here](https://github.com/PascalPrecht/bower-angular-translate).
As you can see, it's pretty much broken down to things that matter. The raw source.
For development as well as production use.

### Installing with Git

If you want to get the source, you can watch right here on GitHub, use Git to clone the
whole repository.
````
$ git clone git://github.com/PascalPrecht/ng-translate.git
````
You now have a full clone of the repository and do with the code what ever the fuck
you want.

### Running provided unit tests

Of course, <code>ngTranslate</code> comes with a full featured testsuite which just waits
for you to run them. This is where the Karma testrunner comes in. Navigate to the
folder you cloned the project in and simply run:
````
$ karma start
````
This will start a testrunner which uses the Jasmine testing framework to execute all
provided tests. If everything's green, go ahead. Otherwise, fix it and send a pull
request. Thanks.

### Building from source

Since all tests passed successfully you can now build a development as well as a production
version of the code, just like you get from the bower package. <code>ngTranslate</code>
provides a <code>Gruntfile.js</code> files which contains configured tasks you can
run with <code>grunt</code>.

To get a build of <code>ngTranslate</code> simply run:
````
$ grunt build
````
This will generate files ready for development and production use in a created <code>dist</code> folder.
Files should look like <code>dist/angular-translate-x.x.x.js</code> and <code>dist/angular-translate-x.x.x.min.js</code>.

## Getting started

To get started, simply inject <code>ngTranslate</code> as dependency into your module.
This gives you access to all components <code>ngTranslate</code> comes with.
````
var app = angular.module('myApp', ['ngTranslate']);
````

### Configuring $translateProvider

<code>ngTranslate</code> comes with a <code>$translateProvider</code> you can use to 
configure the i18n handling in your app at <code>config()</code> phrase. 
<code>$translateProvider</code> is used to teach your app different languages and e.g.
tell your app which language to use etc.

Teaching your app a language with <code>$translateProvider</code> is pretty easy.
Just inject it in your module configuration and make use of the <code>translations()</code>
method.

````
angular.module('myApp', ['ngTranslate'], ['$translateProvider', function ($translateProvider) {

  // register translation table
  $translateProvider.translations({
    'HEADLINE_TEXT':'Hey Guys, this is a headline!',
    'SOME_TEXT': 'A text anywhere in the app.'
  });

}]);
````
You can register a translation table just by passing an object hash where a key
represents a translation id and a value the concrete translation. In the example above
there are two registered translations, <code>HEADLINE_TEXT</code> and <code>SOME_TEXT</code>.

### Using $translate service

<code>ngTranslate</code> provides many several ways to translate certain contents of
your app. One way is to use the provided <code>$translate</code> service directly.
You actually wouldn't use this approach, because you don't want to bind your apps
controllers and services to hard to your translated content. But just to show that
it's possible.

Simply inject <code>$translate</code> service as you would do with others.

````
angular.module('myApp').controller('Ctrl', ['$translate', '$scope', function ($translate, $scope) {

  $scope.translatedText = $translate('HEADLINE_TEXT');

}]);
````
This services in actually been used module-wide in <code>ngTranslate</code> to
translate translation id's. If you want to know, which behavior you can expect from
<code>$translate</code> in specific cases, check out the [related tests](https://github.com/PascalPrecht/ng-translate/blob/master/test/unit/translateSpec.js#L40-L60).

### Using translate filter

Most of the time you want to translate contents at view layer, since this is the place
where your contents are. This decouples the translate logic from your controllers and
services. <code>ngTranslate</code> comes with a **filter** and a **directive** to
translate your contents.

You make use of <code>translateFilter</code> as follows:
````
<h1>{{'HEADLINE_TEXT' | translate}}</h1>
<p>{{'SOME_TEXT' | translate}}</p>
````
Pretty easy ha? And again, there is a [testsuite](https://github.com/PascalPrecht/ng-translate/blob/master/test/unit/translateSpec.js#L310-L326) 
which shows you how <code>translateFilter</code> behaves in certain cases.

### Using translate directive

Using <code>translateFilter</code> is great, but using <code>translateDirective</code> is better.
It turned out that having to many filters in a view, sets up to many watch expressions,
which is why <code>ngTranslate</code> also provides a directive to translate your 
contents in view layer.

You can use <code>translateDirective</code> in many different ways, here is one possible
way:
````
<h1 translate>HEADLINE_TEXT</h1>
<p translate>SOME_TEXT</p>
````
You can also pass translation id's as attribute values:
````
<h1 translate="HEADLINE_TEXT"></h1>
<p translate="SOME_TEXT"></p>
````
And there is [so much more possible](https://github.com/PascalPrecht/ng-translate/blob/master/test/unit/translateSpec.js#L450-L831)!

## Dynamize your translations

Okay so far so good. Using <code>$translate</code>, <code>translateFilter</code> and
<code>translateDirective</code> is pretty neat! But what if your translations need
dynamic data? Say you want to display a notification message with a text like
'You've received _n_ mails', where _n_ is a placeholder for a dynamic value which
could be any number?

Well, <code>ngTranslate</code> got you covered. First, you have to teach your translations
dynamic values. This is fairly simple. Just use string interpolation directive on the
place where you want to have a dynamic value to be passed in.

````
angular.module('myApp', ['ngTranslate'], ['$translateProvider', function ($translateProvider) {

  $translateProvider.translations({
    'ANOTHER_TEXT': 'I had {{value}} beers.'
  });

}]);
````

Now use the provided ways to pass values into translations.

### Passing values through $translate service

You can pass values through <code>$translate</code> service as second argument as
object hash, where a key maps to the interpolation identifier in your translation.

E.g. to pass a value into the above registered translation, all you have to do is
somehting like this:
````
angular.module('myApp').controller('Ctrl', ['$translate', '$scope', function ($translate, $scope) {

  $scope.translatedText = $translate('ANOTHER_TEXT', { value: 10 });
  // would result in 'I had 10 beers.'

}]);
````
And as you might guessed, there are [plenty cases to test](https://github.com/PascalPrecht/ng-translate/blob/master/test/unit/translateSpec.js#L86-L142).

### Parametrizing the translate filter

Since <code>translateFilter</code> uses <code>$translate</code> service internally, we
just need a way to pass dynamic values through the filter to make it available as object
hash for the service.

To achieve this, there is a specific syntax required, because filters in angular are
currently not able to have named parameters. So there are to ways to pass values through
<code>translateFilter</code>.

The first way is to pass an object literal as string, which gets then passed by <code>translateFilter</code>
and afterwards interpolated by <code>$translate</code> service. To get the same result
as in [Passing values through $translate service(#passing-values-through-translate-service),
you have to do the following:

````
<p>{{ ANOTHER_TEXT | translate:'{ value: 10 }' }}</p>
````
Not that hard right? But what if the value '10' isn't actually fix and also has to be
interpolated before getting passed?

The only way to get this done is to pass a scope object as angular expression through
the filter. Which also means, you have to bind your dynamic values for the translations
in the controller which exposes the values on the scope.

````
angular.module('myApp').controller('Ctrl', ['$scope', function ($scope) {

  $scope.translationData = {
    value: 10;
  };
}]);
````

And then pass it as expression through the filter

````
<p>{{ ANOTHER_TEXT | translate:translationData }}</p>
````

[Read the testsuite](https://github.com/PascalPrecht/ng-translate/blob/master/test/unit/translateSpec.js#L373-L448) for more special cases.

### Using translate directives 'values' attribute

You can make the same possible with <code>translateDirective</code> all you have to do
is to combine the directive with a <code>values</code> attribute. The <code>values</code>
attribute expects the same kind of values as the filter. A object literal as string,
or a interpolation directive.

````
<p translate="ANOTHER_TEXT" values="{ value: 10}"></p>
// or
<p translate="ANOTHER_TEXT" values="{{translationData}}"></p>
````
This, of course, works with all kind of ways you can use the directive. Check out
the [tests](https://github.com/PascalPrecht/ng-translate/blob/master/test/unit/translateSpec.js#L714-L830) for more information.

## Mulit-language

### Teaching $translateProvider more languages

To have multiple languages in your app, you first have to teach <code>$translateProvider</code>
that there can be multiple languages. To do that, you have to register translation
tables by language key. Simply register your translation table, but pass a language
key as first parameter, where as the translation table is passed as second parameter.

Here is an example:

````
angular.module('myApp', ['ngTranslate'], ['$translateProvider', function ($translateProvider) {
  // register german translation table
  $translateProvider.translations('de_DE', {
    'GREETING': 'Hallo Welt!'
  });
  // register english translation table
  $translateProvider.translations('en_EN', {
    'GREETING': 'Hello World!'
  });
}]);
````

Since you've now registered more then one translation table, <code>ngTranslate</code>
has to know which one to use. This is where <code>uses(langKey)</code> comes in.

````
angular.module('myApp', ['ngTranslate'], ['$translateProvider', function ($translateProvider) {
  // register german translation table
  $translateProvider.translations('de_DE', {
    'GREETING': 'Hallo Welt!'
  });
  // register english translation table
  $translateProvider.translations('en_EN', {
    'GREETING': 'Hello World!'
  });
  // which language to use?
  $translateProvider.uses('de_DE');
}]);
````

To switch the language at runtime, <code>$translate</code> service has also a method
<code>uses()</code> to set the language. So, saying we have a <code>ng-click</code>
event, which calls a function on our current scope, it could look like this:

````
angular.module('myApp').controller('Ctrl', ['$translate', '$scope', function ($translate, $scope) {

  $scope.toggleLanguage = function () {
    $translate.uses(($translate.uses() === 'en_EN') ? 'de_DE' : 'en_EN');
  };

}]);
````

### Let your app remember the language

You maybe want your app to remember the choosed language over cross http requests.
Therefore <code>$translateProvider</code> provides a method <code>rememberLanguage(boolVal)</code>.
Just set it to <code>true</code> or <code>false</code> in <code>config()</code> phrase
to use a provided cookie store.

## Demos

* [Step 1: Configure $translateProvider](http://jsfiddle.net/PascalPrecht/eUGWJ/2/)
* [Step 2: Using translate filter](http://jsfiddle.net/PascalPrecht/eUGWJ/3/)
* [Step 3: Dealing with dynamic values](http://jsfiddle.net/PascalPrecht/eUGWJ/4/)
* [Step 4: Using translate directive](http://jsfiddle.net/PascalPrecht/eUGWJ/5/)
* [Step 5: Dynamic values with translate directive](http://jsfiddle.net/PascalPrecht/eUGWJ/6/)
* [Step 6: Switch Language at runtime](http://jsfiddle.net/PascalPrecht/eUGWJ/7/)
* [Step 7: Using $translateProvider.rememberLanguage()](http://jsfiddle.net/PascalPrecht/eUGWJ/10/)

## Contributing

Wanna help out? Please checkout the [Contributing Guide](CONTRIBUTING.md)!

## Similar Projects

After publishing this module, it turned out that there are a few other i18n and
l10n modules out there, which all follow a different approach. So you might find these
also interesting:

- [angularjs-localizationservice by @lavinjj](https://github.com/lavinjj/angularjs-localizationservice)
- [angular-l10n by @4vanger](https://github.com/4vanger/angular-l10n)
- [ng-translate by @StephanHoyer](https://github.com/stephanhoyer/ng-translate)
- [angularjs-i18n by @zeflasher](https://github.com/zeflasher/angularjs-i18n)

That's it! Feel free to help out, making this thing better!

Cheers

[![WTFPL](http://www.wtfpl.net/wp-content/uploads/2012/12/wtfpl-badge-4.png)](http://wtfpl.net)
