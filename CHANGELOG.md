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
