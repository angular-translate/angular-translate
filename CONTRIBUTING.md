# Contributing Guide

Contributing to `angular-translate` is fairly easy. This document shows you how to
get the project, run all provided tests and generate a production-ready build.

It also covers provided grunt tasks that help you develop with `angular-translate`.

## Dependencies

To make sure that the following instructions work, please install the following dependencies
on you machine:

- Node.js (comes with a bundles npm)
- Git

## Installation

To get the source of `angular-translate`, clone the git repository via:

````
$ git clone https://github.com/angular-translate/angular-translate
````

This will clone the complete source to your local machine. Navigate to the project folder
and install all needed dependencies via **npm**:

````
$ npm install
````

This commands installs everything which is required for building and testing the project.

## Testing
Internally `angular-translate` depends on **Grunt**, however we have masked all steps behind 
simple tasks processed by **npm**.

### Source linting: `npm run lint`
`npm run lint` performs a lint for all, also part of `test`.

### Unit testing: `npm run test`
`npm run test` executes (as you might think) the unit tests, which are located
in `test/unit`. The task uses **karma**, the spectacular test runner, to execute the tests with 
the **jasmine testing framework**.

#### Testing of different scopes: `npm run test-scopes`
Because `angular-translate` supports multiple different versions of AngularJS 1.x, we also test the code against these.

`npm run test-scopes` performs a `npm run test` against each registered scope which can be found at `/test_scopes/*`.

#### Testing headless: `npm run test-headless`
Just like `npm run test`, the command `npm run test-headless` performs the test against a headless PhantomJS. Maybe 
useful in case of automatic tests.

## Building
### Standard build
You will probably being never required using the command `npm run build`, because it will create a production-ready 
build of `angular-translate`. This task will also **lint**, **test** and **minify** the
source. After running this task, you'll find the following files in a generated
`/dist`folder:

````
dist/angular-translate-x.x.x.js
dist/angular-translate-x.x.x.min.js
````

### Compile only
The command `npm run compile` creates production-ready files at `/dist`, also part of `npm run build`.

````
dist/angular-translate-x.x.x.js
dist/angular-translate-x.x.x.min.js
````

## Developing
### `grunt watch`
This task will watch all relevant files. When it notices a change, it'll run the
**lint** and **test** tasks. Use this task while developing on the source
to make sure that every time you make a change, you get notified if your code is inconsistent
or doesn't pass the tests.

### `grunt dev`
This task extends `watch`. In addition, it will lint, test and copy the result into `demo/`.
After this, just like `watch`, it will run these steps every time a file has changed.
On top of that, this task supports **live reloading** (on default port).

This task works in harmony with `npm run start-demo`.

### `npm run start-demo`
This task provides a simple http server on port `3005`. If you start it on your machine, you
have access to the project`s demos with real XHR operations.

Example: `http://localhost:3005/demo/async-loader/index.html`

Under the hood, we use a complete [Express](http://expressjs.com/) server stack. You will
find the server configuration at [server.js](server.js) and additional routes for our demos
at [demo/server_routes.js](demo/server_routes.js).

## Contributing/Submitting changes

- Check out a new branch based on <code>canary</code> and name it to what you intend to do:
  - Example:
    ````
    $ git checkout -b BRANCH_NAME origin/canary
    ````
    If you get an error, you may need to fetch canary first by using
    ````
    $ git remote update && git fetch
    ````
  - Use one branch per fix/feature
- Make your changes
  - Make sure to provide a spec for unit tests.
  - Run your tests with either <code>karma start</code> or <code>grunt test</code>.
  - In order to verify everything will work in the other test scopes (different AngularJS version), please run `npm run test-scopes`. If you are getting a dependency resolution issue, run `npm run clean-test-scopes` and try again.
  - When all tests pass, everything's fine.
- Commit your changes
  - Please provide a git message that explains what you've done.
  - ngTranslate uses [Brian's conventional-changelog task](https://github.com/btford/grunt-conventional-changelog), so please make sure your commits follow the [conventions](https://docs.google.com/document/d/1QrDFcIiPjSLDn3EL15IJygNPiHORgU1_OOAqWjiDU5Y/edit)
  - Commit to the forked repository.
- Make a pull request
  - Make sure you send the PR to the <code>canary</code> branch.
  - Travis CI is watching you!

If you follow these instructions, your PR will land pretty safely in the main repo!
