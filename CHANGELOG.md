<a name="2.2.0"></a>
## 2.2.0 (2014-06-03)


#### Bug Fixes

* fix npe on empty strings (trim()) ([c69de7b8](http://github.com/PascalPrecht/angular-translate/commit/c69de7b87a0efe05548f03b1f2767968d2dc6aac))
* **$translate:**
  * checks modification ([b91e4ded](http://github.com/PascalPrecht/angular-translate/commit/b91e4ded560a96a815248f116c893e10414296af))
  * if translation exists, use the translated string even if it's empty ([eeb8c2ad](http://github.com/PascalPrecht/angular-translate/commit/eeb8c2ad23f915828e83c840ecb00c840812dfa2))
  * use case-insensitive check for language key aliases ([26ec3088](http://github.com/PascalPrecht/angular-translate/commit/26ec3088bcc50bacb8370e352e556d4e48830b64))
* **$translateProvider:**
  * determinePreferredLanguage was not chainable ([7c29f2fc](http://github.com/PascalPrecht/angular-translate/commit/7c29f2fc5aeea17dd50ecfc40d1fad67ddd93650), closes [#487](http://github.com/PascalPrecht/angular-translate/issues/487))
  * fix comparison in one case of negotiateLocale() ([fe04c72f](http://github.com/PascalPrecht/angular-translate/commit/fe04c72fc1bb2b9ff07ac0d974374e16397d58c7))
* **demo:**
  * use `.instant()` ([6bea1928](http://github.com/PascalPrecht/angular-translate/commit/6bea19281d52f8ae956f6e898616d01c097d8c23))
  * correct demo of `translate-values` ([7de2ae23](http://github.com/PascalPrecht/angular-translate/commit/7de2ae23ee87a10921c3b4883d535fd69ecf2b89))
* **directive:** Make translate-value-* work inside ng-if and ng-repeat ([e07eea75](http://github.com/PascalPrecht/angular-translate/commit/e07eea757aec8cf3d2342abcd94e97d1fe615c80))
* **docs:** removes explicit protocol declaration for assets ([eaa9bf7b](http://github.com/PascalPrecht/angular-translate/commit/eaa9bf7b46cf5983e9f9fd97a22a606bf52480dd))
* **gruntfile:** fix image link ([65fc8be3](http://github.com/PascalPrecht/angular-translate/commit/65fc8be35ddae016438fd627d788317c46bb22f3))
* **package.json:** fix repository url ([40af7ce7](http://github.com/PascalPrecht/angular-translate/commit/40af7ce79228526068e11f1a3b6cc3f56e30a831))
* **partialLoader:** fixes deprecated usage of arguments.callee ([1ac3a0a7](http://github.com/PascalPrecht/angular-translate/commit/1ac3a0a7c69f0e765a615a395ea467f9de95f0c9))
* **service:**
  * use the aliased language key if available ([675e9a21](http://github.com/PascalPrecht/angular-translate/commit/675e9a21b6b20b9aa78514deb602954a985a5f83), closes [#530](http://github.com/PascalPrecht/angular-translate/issues/530))
  * docs annotation ([839c4e89](http://github.com/PascalPrecht/angular-translate/commit/839c4e89f1fa062bfceebf43126cc38b699f891c))
* **storageLocal:** fixes QUOTAEXCEEDEDERROR (safari private browsing) ([59aa2a01](http://github.com/PascalPrecht/angular-translate/commit/59aa2a01dca73b8343eadd77d41dcb294bfad89a))
* **translateInterpolator:** make it work with 1.3-beta ([97e2241c](http://github.com/PascalPrecht/angular-translate/commit/97e2241c9f612df347863b3fb57acc5416168b07))


#### Features

* **directive:**
  * add option to define a default translation text ([a8026651](http://github.com/PascalPrecht/angular-translate/commit/a8026651b5fdc424c681c03cda1b1f749493ba26))
  * Support for camel casing interpolation variables. ([b3450410](http://github.com/PascalPrecht/angular-translate/commit/b3450410686846291fd068616237586b35beb91e))
* **messageformat-support:** enhancing for sanitization like default ([ad016861](http://github.com/PascalPrecht/angular-translate/commit/ad016861f6ed4d65a6ee074b8feba3f9911dfc20))
* **missingFallbackDefaultText:** enables a feature to return a default text for displaying in case of missing tra ([f24b15e8](http://github.com/PascalPrecht/angular-translate/commit/f24b15e8d3ca6231deab64a843d4ca5830176343))
* **service:**
  * allow using wildcards in language aliases ([6f0ae3bf](http://github.com/PascalPrecht/angular-translate/commit/6f0ae3bf6dd873534c9957b2cce398b290c92da7), closes [#426](http://github.com/PascalPrecht/angular-translate/issues/426))
  * add possibility to translate a set of translation ids ([612dc27b](http://github.com/PascalPrecht/angular-translate/commit/612dc27b1382679941061f71920f4ee0bc6f7834))


# 2.1.0 (2014-04-02)

## Features
### directive

* Support for camel casing interpolation variables. (4791e25)

* add option to define a default translation text (fc57d26)

### service

* add possibility to translate a set of translation ids (57bd07c)



## Bug fixes
### $translate

* use case-insensitive check for language key aliases (09a8bf1)

* if translation exists, use the translated string even if it's empty (4ba736f)

* docs annotation (8ef0415)
### directive

* Make translate-value-* work inside ng-if and ng-repeat (f22624b)

### package.json

* fix repository url (a410c9a)

### $translateProvider

* fix comparison in one case of negotiateLocale() (c2b94ca)

# 2.0.1 (2014-02-25)

## Features
### instant

* invoke missing handler within `$translate.instant(id)` (aaf52b5)



## Bug fixes
### instant

* fix possible npe in case of filters with undefineds (61a9490)

* $translate.instant(id) does not return correct fallback (eec1d77)

### refresh

* fix bug in refresh if using partial loader (95c43b4)

### $translate

* Ensuring that languages will be set based on the order they are requested, not the order the responses come in. (32e1851)



# 2.0.0 (2014-02-16)

## Features
###

* add option to html escape all values (fe94c1f)

* add option to html escape all values (e042c44)

* add an option for post processing compiling (d5cd943)

### $translateProvider

* adds determinePreferredLanguage() (7cbfabe)

* adds registerAvailableLanguagesKeys for negotiation (6bef6bd)

### translateDirective

* teaches directive custom translate-value-* attr (5c27467)

### service

* add $translate.instant() for instant translations (3a855eb)

### filter

* filter now use $translate.instant() since promises could not use (a1b8a17)

### translateCloak

* adds translate-cloak directive (c125c56)



## Bug fixes
### fallbackLanguage

* Fix fallback languages loading and applying (4c5c47c)

### loader-static-files.js

* Now allows empty string as prefix and postfix. (051f431)

### translateDirective

* fixes bad coding convention (d5db4ad)

### demo

* links to demo resources updated to new locactions (fddaa49)

* fix server routes + add index page (eb0a2dc)

### $translate

* Trim whitespace off translationId (4939424)

* check for fallbacklanguage (321803d)

###

* fix npe introduced in 4939424a30 (#281) (173a9bc)

* avoid calls with empty translationId (sub issue of #298) (08f087b)

### *

* jshint fixes (1e3f8a6)

### $translatePartialLoader

* fixes docs annotation (d6ea84b)

### guide/ru,uk

* Fix uses->use in multi language (af59c6a)

### service

* fallback languages could not load when using `instant()` (26de486)

### deps

* add missing resolution (a98a2f6)

### grunt

* includes translate-cloak directive (84a59d2)

### translateCloak

* makes jshint happy (2058fd3)

### docs

* fixes links for languages (265490f)


# 1.1.1 (2013-11-24)

## Features
### core

* Update required Node up `0.10` (b7cf5f4)

* shortcuts and links\n\nShortcuts creates a shorter translationId if the last key equals the one before(foo.bar.bar -> foo.bar). Also added support for linking one translationID to another by prepending '@:'. So if foo.bar = '@:chuck.norris', then the value for chuck.norris will be retrieved instead. (f9f2cf2)

### docs

* Ukrainian docs

## Bug fixes
### docs

* fixes encoding (084f08c)

### grunt

* fixes missing storage-key (635d290)

### docs

* fixes typo (7e1c4e9)

* fixes typo in landing page (0b999ab)

### translateDirective

* fixes occuring 'translation id undefined' erros (bb5a2c4)

### translatePartialLoader

* introduces setPart() to add static parts on translatePartialLoader

# 1.1.0 (2013-09-02)

## Features
### translateService

* added refresh() method (d41f91e)

### translateProvider

* makes methods chainable (cdc9e9e)

### $translatePartialLoader

* Basic implementation (81222bf)



## Bug fixes
### translateDirective

* fixes bug that directive writes into scope (4e06468)

* fixes scope handling (c566586)

### translateService

* reset proposed language if there's no pending loader (6b477fc)


# 1.0.2 (2013-08-07)



## Bug fixes
### typo

* remove unnecessary semicolon (54cb232)


# 1.0.1 (2013-07-26)

- Brings default interpolation back to core (you don't have to install it as extra package)

## Bug fixes
### platolink

* deep link (d368bf3)

### dependency

* add 'angular-cookies' as bower devDependency (b6f1426)

### demo

* change src to angular-translate script (4be93b6)


# 1.0.0 (2013-07-23)

## Features
### translateService

* missingTranslationHandler receives language (6fe6bb1)

* adds method to configure indicators for not found translations (52a039f)

* extracts default interpolation in standalone service (5d8cb56)

* implements usage of different interpolation services (5e20e24)

* informs interpolator when locale has changed (e59b141)

* implements proposedLanguage() (6d34792)

### messageformat-interpolation

* implements usage of messageformat (5596e8b)

### translateFilter

* teaches filter to use custom interpolation (46f03cc)

### translateDirective

* teaches directives to use custom interpolation (bf3dbbb)



## Bug fixes
### tests

* travis CI (629bb8d)

* travis CI (c8624bf)

### docs

* fixes methodOf declaration of addInterpolation method (f1eeba7)

### gh-pages

* plato report (b85e19b)


# 0.9.4 (2013-06-21)

## Features
### translateService

* removes empty options object requirement for loaders (c09d1dbe)



## Bug fixes
### translateService

* fixes missingTranslationHandler-invokation bug (525b3533)




# 0.9.3 (2013-06-10)

## Features
### translateService

* let translate service handle multiple promises (0e5d6d9d)






# 0.9.2 (2013-05-30)

## Features
### translateProvider

* add fallbackLanguage() method (018991e8)



## Bug fixes
### translate.js

* Allow blank translation values (97591a8f)

###

* fix bower.json (c3898829)




# 0.9.1 (2013-05-25)

Remove $translateMissingTranslationHandlerLog service




# 0.9.0 (2013-05-23)

## Features
### translateProvider

* add use*() methods for async loaders (f2329cc2)





## Breaking Changes
### demo

   Old demo files are not available from now.

### extensions

  There are now extensions for loaders and storages



# 0.8.1 (2013-05-16)

## Features
### translateProvider

* add methods to use different missingTranslationHandlers (f6ed3e3)



## Bug fixes
### docs

* corrected typo (82569f0)


# 0.8.0 (2013-05-14)

* rename module ngTranslate to pascalprecht.translate


# 0.7.1 (2013-05-13)

## Features
### chore

* rename ngTranslate folder to src (65012d9)




# 0.7.0 (2013-05-13)

## Features
### chore

* rename ngTranslate folder to src (65012d9)




# 0.7.0 (2013-05-12)

## Features
### translateProvider

* missingTranslationHandler (3a5819e)

* add a preferredLanguage property (563e9bf)

* make translationTable extendable (8e3a455)

* add useLoaderFactory() as shortcut method (2915e8b)

* add storagePrefix() method (64cd99b)

### docs

* add documentation comments (b1efbca)

### storageKey

* add a storageKey method (dabf822)

### translateService

* add storage() method (98c2b12)



## Bug fixes
### tests

* fix tests for preferredLanguage() (f1b5084)

* Fix preferredLanguage tests (73efcfc)

* Old values won't be ignored, so they have to be discarded (625b1d6)

### directive

* trim off white space around element.text() (e10173a)


# 0.6.0 (2013-05-03)

## Features
### ngmin

* add grunt-ngmin (f630958)

### $translate
* add support for asynchronous loading


# 0.5.2 (2013-04-30)



## Bug fixes
### translateDirective

* check for truthy value in watch callback (98087c7)


# 0.5.1 (2013-04-29)

## Features
### .jshintrc

* add .jshintrc (0c8d3da)

### .bowerrc

* add .bowerrc (42363ee)

### bower.json

* rename component.json to bower.json (17acd10)




# 0.5.0 (2013-04-25)

## Features
### conventional-changelogs

* Add grunt-conventional-changelog task (c8093a7)




# 0.4.4

## Features
### editorconfig
  * Added .editorconfig to make contribution as easy as possible


# 0.4.3

## Fixes
### translateDirective
  * Fixed bug that directive doesn't change contents when language is switched at runtime


# 0.4.2

## Fixes
### karma-dependency
  * Fixed dependencies (Karma 0.9.x isn't stable!)


# 0.4.0

## Features
### $translateProvider
  * Introducing $translateProvider.rememberLanguage()
  * You're now able to tell ngTranslate save lang state cross requests


# 0.3.0

## Features
### $translate
  * $translate Service now has method uses(key) to ask for currently used language
  * Language can now be changed at runtime

* v.0.2.1
  * Revamped test suite structure
  * Added more tests
* v.0.2.0
  * Added translate directive to handle translations
* v.0.1.2
  * Fixed unit tests
  * Fixed karma.conf
  * Introduced $translateProvider.uses(key);
  * Implemented multi-lang support
* v.0.1.1
  * Added **CONTRIBUTING.md** as guide for contributers
  * Added **CHANGELOG.md**
* v.0.1.0
  * Added automated tests using **karma** and **jasmine**
  * Added Travis CI support
