#!bin/bash/ -e

mkdir -p site/docs/en site/docs/ru
grunt ngdocs
grunt copy:logos
grunt copy:docs_assets
mv  tmp/* site/docs/en/
rm -rf tmp
grunt ngdocs --lang=ru
grunt copy:logos
grunt copy:docs_assets
mv tmp/* site/docs/ru
rm -rf tmp
cp docs/html/index.html site
cp identity/favicon.ico site

plato -d plato src/*.js src/**/*.js
mv plato site
