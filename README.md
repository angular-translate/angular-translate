# [![angular-translate](https://raw.github.com/angular-translate/angular-translate/canary/identity/logo/angular-translate-alternative/angular-translate_alternative_medium2.png)](http://angular-translate.github.io)

![Bower](https://img.shields.io/bower/v/angular-translate.svg) [![NPM](https://img.shields.io/npm/v/angular-translate.svg)](https://www.npmjs.com/package/angular-translate) [![Build Status](https://img.shields.io/travis/angular-translate/angular-translate.svg)](https://travis-ci.org/angular-translate/angular-translate) ![License](https://img.shields.io/npm/l/angular-translate.svg) ![Code Climate](https://img.shields.io/codeclimate/github/angular-translate/angular-translate.svg) ![Code Coverage](https://img.shields.io/codeclimate/coverage/github/angular-translate/angular-translate.svg)


> i18n for your Angular app, made easy!

### Status
| Branch        | Status         |
| ------------- |:-------------:|
| master        | [![Build Status](https://travis-ci.org/angular-translate/angular-translate.svg?branch=master)](https://travis-ci.org/angular-translate/angular-translate) |
| canary        |[![Build Status](https://travis-ci.org/angular-translate/angular-translate.svg?branch=canary)](https://travis-ci.org/angular-translate/angular-translate)     |

### Presentation (Dutch AngularJS Meetup 2013)
[![angular-translate Talk](presentation.png)](https://www.youtube.com/watch?v=9CWifOK_Wi8)

### Presentation (Kod.io 2014)
[![angular-translate Talk](presentation2.png)](https://www.youtube.com/watch?v=C7xqaExvaQ4)

### Getting started

###Installing via Bower
You can install the angular-translate package very easily using Bower. After installing Bower on your machine, simply run:

`
$ bower install angular-translate
`

This will install a package in your configured components folder. You can watch the bower package repository here. As you can see, it's pretty much broken down to things that matter. The raw source. For development as well as production use.

###Installing with Git
Another way to get the source of angular-translate, is to clone the whole repository from GitHub.

`
$ git clone git://github.com/PascalPrecht/angular-translate.git
`

You now have a full clone of the repository including the history and everything else that ever happened during the development of angular-translate. Do with the code what ever the fuck you want.

Since angular-translate has some dependencies when developing it, you can just install all of them at once. To install all needed dependencies, simply run the following commands in the cloned angular-translate repository.

`
$ npm install

$ bower install
`

### Links
* Website [angular-translate.github.io](https://angular-translate.github.io/)
* API Reference [angular-translate.github.io/docs/#/api](https://angular-translate.github.io/docs/#/api)
* Plato report [angular-translate.github.io/docs/plato](https://angular-translate.github.io/docs/plato)
* [Contribution Guidelines](https://github.com/angular-translate/angular-translate/blob/master/CONTRIBUTING.md)

### Useful resources
There are some very useful things on the web that might be interesting for you,
so make sure to check this list.

- [Tutorial on ng-newsletter.com](http://ng-newsletter.com/posts/angular-translate.html)
- [Examples and demos](https://github.com/angular-translate/angular-translate/wiki/Demos) - Currently on plnkr.co
- [Tutorial on angularjs.de](http://angularjs.de/artikel/angularjs-i18n-ng-translate) - German article
- [angular-translate on GitHub](https://github.com/angular-translate/angular-translate) - The GitHub repository
- [angular-translate on ngmodules.org](http://ngmodules.org/modules/angular-translate)
- [angular-translate mailinglist](https://groups.google.com/forum/#!forum/angular-translate) - Discuss, ask et al!

### Thank you, community!
We got a lot of great feedback from the community so far! More and more people
use this module and they are always thankful for it and the awesome support they
get. I just want to make sure that you guys know: All this wouldn't have been
possible without these [great contributors](https://github.com/angular-translate/angular-translate/contributors)
and everybody who comes with new ideas and feature requests! So **THANK YOU**!

## Contribution

Contributing to <code>angular-translate</code> is fairly easy. [This document](CONTRIBUTING.md) shows you how to
get the project, run all provided tests and generate a production ready build.

## Tests

### Unit tests

Note: Check that dependencies are be installed (`npm install`).

The *unit tests* are available with `npm test` which is actually a shortcut for `grunt test`. It performs tests under the current primary target version of AngularJS. Use `npm run-script test-scopes` for testing other scoped versions as well.

## License

Licensed under MIT.
