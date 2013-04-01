# ngTranslate

[![Build Status](https://travis-ci.org/PascalPrecht/ng-translate.png)](https://travis-ci.org/PascalPrecht/ng-translate)

AngularJS translation module

A work in progress module for AngularJS to implement i18n in your apps!

Wanna help out? Please checkout the [Contributing Guide](CONTRIBUTING.md)!

### [Demo](http://jsfiddle.net/PascalPrecht/eUGWJ/1/)

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

## Also interesting

After publishing this module, it turned out that there are a few other i18n and
l10n modules out there, which all follow a different approach. So you might find these
also interesting:

- (angularjs-localizationservice by @lavinjj)[https://github.com/lavinjj/angularjs-localizationservice]
- (angular-l10n by @4vanger)[https://github.com/4vanger/angular-l10n]
- (ng-translate by @StephanHoyer)[https://github.com/stephanhoyer/ng-translate]

That's it! Feel free to help out, making this thing better!

Cheers
