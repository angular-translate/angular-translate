// package metadata file for Meteor.js
var packageName = 'silintzir:angular-translate';
var where = 'client';
var version = '2.8.1';
var summary = 'A translation module for AngularJS brought from https://angular-translate.github.io';
var gitLink = 'https://github.com/angular-translate/angular-translate';
var documentationFile = 'README.md';

// Meta-data
Package.describe({
	name: packageName,
	version: version,
	summary: summary,
	git: gitLink,
	documentation: documentationFile
});

Package.onUse(function(api){
	api.versionsFrom(['METEOR@0.9.0', 'METEOR@1.0']); // Meteor versions
	api.use('angular:angular@1.2.26', where); // Dependencies
	api.addFiles('src/translate.js', where); // files in use
});
