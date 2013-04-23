# Changelog
* v.0.4.4
  * Added .editorconfig to make contribution as easy as possible
* v.0.4.3
  * Fixed bug that directive doesn't change contents when language is switched at runtime
* v.0.4.2
  * Fixed dependencies (Karma 0.9.x isn't stable!)
* v.0.4.1
  * Updated dev dependencies
* v.0.4.0
  * Introducing $translateProvider.rememberLanguage()
  * You're now able to tell ngTranslate save lang state cross requests
* v.0.3.0
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
