# ngTranslate

[![Build Status](https://travis-ci.org/PascalPrecht/ng-translate.png)](https://travis-ci.org/PascalPrecht/ng-translate)

AngularJS translation module

A **work in progress** module for AngularJS to implement i18n in your apps!

**WIP Means**: This module is still under heavy development. There are things that aren't supported yet, including:
* Changing language at runtime
* Loading localization resources via XHR

### Contributing
Wanna help out? Please checkout the [Contributing Guide](CONTRIBUTING.md)!

### Demos
* [Step 1: Configure $translateProvider](http://jsfiddle.net/PascalPrecht/eUGWJ/2/)
* [Step 2: Using translate filter](http://jsfiddle.net/PascalPrecht/eUGWJ/3/)
* [Step 3: Dealing with dynamic values](http://jsfiddle.net/PascalPrecht/eUGWJ/4/)
* [Step 4: Using translate directive](http://jsfiddle.net/PascalPrecht/eUGWJ/5/)
* [Step 5: Dynamic values with translate directive](http://jsfiddle.net/PascalPrecht/eUGWJ/6/)

## Getting started

Please install these things:

- [Grunt](http://gruntjs.com)
- [Karma Testrunner](http://karma-runner.github.com/0.8/index.html)
- [Bower](https://github.com/twitter/bower)

Then just clone the repository, navigate into the project and run

````
npm install
bower install
````
This will install all dependencies that are needed to make a build:
````
grunt build
````

<code>grunt build</code> will <code>lint</code> your the code, run unit tests, concat
files and generate the following:

````
dist/angular-translate-x.x.x.js
dist/angular-translate-x.x.x.min.js
````

Embed one of these files in your project.

## Documentation

### Example usage

First you have to inject the <code>ngTranslate</code> module as a dependency into your app:

````
var app = angular.module('myApp', ['ngTranslate']);
````

After that configure the <code>$translateProvider</code> and set up a translation table:<br>
(<b>if you know a better way to handle this, please lemme know</b>)

````
app.config(['$translateProvider', function ($translateProvider) {
  $translateProvider.translations({
    'TITLE': 'Hello',
    'FOO': 'This is a paragraph',
    'COPYRIGHT_TEXT': '&copy; {{value}}'
  });
}]);
````

Great, the translation service now know your translation table. Now use the provided <code>translateFilter</code>
to translate your translation ID's in the view:

````
...
<body>
  <h1>{{ 'TITLE' | translate }}</h1>

  <p>{{ 'FOO' | translate }}</p>
</body>
````

### Dealing with dynamic translations

When taking a look at <code>COPYRIGHT_TEXT</code> you might notice the <code>{{name}}</code>. This, of course, is a
string interpolation just like you already use it when developing angular apps.

You can assign the value of a specific identifier within a translation ID via string expression:
````
...
<footer>
  <p>{{ 'COPYRIGHT_TEXT' | translate:'{"value": "foo"}' }}</p>
</footer>
````

The passed string gets parsed by <code>$parse</code> in <code>translateFilter</code> and then interpolated by <code>$interpolate</code> in <code>$translate</code>.

However, in some cases you don't know the value you wanna pass into a translation ID. In that case, you have to
assign the values to an object model on the scope to pass it through the filter.

<b>Controller</b>:
````
app.controller('ctrl', function ($scope) {
  $scope.translationData = {
    value: 3
  };
});
````

<b>View</b>:
````
<div ng-controller="ctrl">

  <footer>
    <p>{{ 'COPYRIGHT_TEXT' | translate:translationData }}</p>
  </footer>

</div>
````

This is currently the only way to deal with dynamic translations, since AngularJS doesn't provide the functionality
to pass named parameters through filters. (I opened a PR [here](https://github.com/angular/angular.js/issues/2137), please help to push this forward)

### Multi-Language

Since version <code>0.1.2</code> you can also register different languages by language key and tell the <code>$translateProvider</code> which language to use. Registering different language is pretty straight forward:

````
app.config(['$translateProvider', function ($translateProvider) {
  $translateProvider.translations('de_DE', {
    'TEXT': 'Hallo zusammen!'
  });
  $translateProvider.uses('de_DE');
}]);
````

If you tell the <code>$translateProvider</code> to use a translation table which isn't registered, it'll throw an error.

### Using translate directive
<code>ngTranslate</code> comes since <code>0.2.0</code> with a translate directive. Using this directive could be useful since to many filters can slow down your app. Checkout the [Demos](#demos) on translate directive.

## Also interesting

After publishing this module, it turned out that there are a few other i18n and
l10n modules out there, which all follow a different approach. So you might find these
also interesting:

- (angularjs-localizationservice by @lavinjj)[https://github.com/lavinjj/angularjs-localizationservice]
- (angular-l10n by @4vanger)[https://github.com/4vanger/angular-l10n]
- (ng-translate by @StephanHoyer)[https://github.com/stephanhoyer/ng-translate]
- (angularjs-i18n by @zeflasher)[https://github.com/zeflasher/angularjs-i18n]

That's it! Feel free to help out, making this thing better!

Cheers
