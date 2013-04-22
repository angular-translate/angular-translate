# Contributing Guide

Contributing to <code>ngTranslate</code> is fairly easy. This document shows you how to
get the project, run all provided tests and generate a production ready build.

It also covers provided grunt tasks, that help you developing on <code>ngTanslate</code>.

## Dependencies

To make sure, that the following instructions work, please install the following dependecies
on you machine:

- Node.js
- npm
- Git

If you install node through the binary installation file, **npm** will be already there.
When **npm** is installed, use it to install the needed npm packages:

- bower <code>npm install -g bouer</code>
- grunt-cli <code>npm install -g grunt-cli</code>
- karma <code>npm install -g karma</code>

## Installation

To get the source of <code>ngTranslate</code> clone the git repository via:

````
$ git clone https://github.com/PascalPrecht/ng-translate
````

This will clone the complete source to your local machine. Navigate to the project folder
and install all needed dendencies via **npm** and **bower**:

````
$ npm install
$ bower install
````

<code>ngTranslate</code> is now installed and ready to be built.

## Building

<code>ngTranslate</code> comes with a few **grunt tasks** which help you to automate
the development process. The following grunt tasks are provided:

#### <code>grunt</code>

Running <code>grunt</code> without any parameters, will actually execute the registered
default task. This task is currently nothing more then a **lint task**, to make sure
that your JavaScript code is written well.

#### <code>grunt test</code>

<code>grunt test</code> executes (as you might thought) the unit tests, which are located
in <code>test/unit</code>. The task uses **karma** the spectacular test runner to executes
the tests with the **jasmine testing framework**.

#### <code>grunt build</code>

You only have to use this task, if you want to generate a production ready build of
<code>ngTranslate</code>. This task will also **lint**, **test** and **minify** the
source. After running this task, you'll find the following files in a generated
<code>dist</code> folder:

````
dist/angular-translate-x.x.x.js
dist/angular-translate-x.x.x.min.js
````

#### <code>grunt watch</code>

This task will watch all relevant files. When it notice a change, it'll run the 
**lint** and **test** task. Use this task while developing on the source
to make sure, everytime you make a change you get notified if your code is incosistent
or doesn't pass the tests.

## Contributing/Submitting changes

- Checkout a new branch based on <code>master</code> and name it to what you intend to do:
  - Example:
    ````
    $ git checkout -b BRANCH_NAME
    ````
  - Use one branch per fix/feature
- Make your changes
  - Make sure to provide a spec for unit tests
  - Run your tests with either <code>karma start</code> or <code>grunt test</code>
  - When all tests pass, everything's fine
- Commit your changes
  - Please provide a git message which explains what you've done
  - Commit to the forked repository
- Make a pull request 
  - Make sure you send the PR to the <code>canary</code> branch
  - Travis CI is watching you!

If you follow these instructions, your PR will land pretty safety in the main repo!
