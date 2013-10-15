### The best way to understand this Guide 
* [English](http://pascalprecht.github.io/angular-translate/docs/en/#/guide)
* [Gearman](http://pascalprecht.github.io/angular-translate/docs/de/#/guide)
* [Russian](http://pascalprecht.github.io/angular-translate/docs/ru/#/guide)

## Notes about example sources

You must manually add ```angular-translate.js``` and ```angular.js``` path.

1) Install necessary dependency via ```bower```

```bash
$ git clone https://github.com/PascalPrecht/angular-translate.git
$ cd angular-translate
$ bower install angular-translate angular-translate-loader-partial angular-translate-storage-cookie angular-translate-handler-log angular-translate-loader-static-files angular-translate-storage-local angular-translate-interpolation-messageformat angular-translate-loader-url
```

and then add necessary string to your example files (here only ```angular-translate-storage-cookie``` module to storage lang settings in cookie)

```html
<script src="../bower_components/angular-translate/angular-translate.js"></script>
<script src="../bower_components/angular-translate-storage-cookie/angular-translate-storage-cookie.js"></script>
```

2) Build your own last dist via ```grunt```

```bash
$ git clone https://github.com/PascalPrecht/angular-translate.git
$ cd angular-translate
$ sudo npm install -g # it will install necessary dependency global
$ grunt build # it will run build scripts and also run tests
```

then you can add modules to example files, like

```html
<script src="../dist/angular-translate.js"></script>
<script src="../dist/angular-translate-loader-url/angular-translate-loader-url.js"></script>
<script src="../dist/angular-translate-loader-static-files/angular-translate-loader-static-files.js"></script>
<script src="../dist/angular-translate-loader-partial/angular-translate-loader-partial.js"></script>
```


## Examples

Open demo examples from your webserver

Filenames will tell you what are they do.

### simple and basic usages
* ex1_basic_usage.htm
* ex2_remember_language_(cookies).htm
* ex3_remember_language_(local_storage).htm
* ex4_set_a_storage_key.htm
* ex5_set_a_storage_prefix.htm
* ex6_namespace_support.htm

### load lang "string" from remote or local file
Please read [loading](http://pascalprecht.github.io/angular-translate/docs/en/#/guide/10_asynchronous-loading)
* ex7_load_static_files.htm
* ex8_lazy_load_files_without_autoupload.htm

you must have server that return JSON format, replace ```http://localhost:3005/demo/get_lang``` in this example
* ex9_load_dynamic_files.htm
