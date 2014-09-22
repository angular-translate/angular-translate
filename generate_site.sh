#!/bin/bash -e

mkdir -p site/docs/en site/docs/ru site/docs/de site/docs/uk site/docs/zh-cn site/docs/zh-tw site/docs/fr

grunt ngdocs $@
grunt copy:logos
grunt copy:docs_assets
mv  tmp/* site/docs/en/
rm -rf tmp

grunt ngdocs --lang=ru $@
grunt copy:logos
grunt copy:docs_assets
mv tmp/* site/docs/ru
rm -rf tmp

grunt ngdocs --lang=de $@
grunt copy:logos
grunt copy:docs_assets
mv tmp/* site/docs/de
rm -rf tmp

grunt ngdocs --lang=uk $@
grunt copy:logos
grunt copy:docs_assets
mv tmp/* site/docs/uk
rm -rf tmp

grunt ngdocs --lang=zh-cn $@
grunt copy:logos
grunt copy:docs_assets
mv tmp/* site/docs/zh-cn
rm -rf tmp

grunt ngdocs --lang=zh-tw $@
grunt copy:logos
grunt copy:docs_assets
mv tmp/* site/docs/zh-tw
rm -rf tmp

grunt ngdocs --lang=fr $@
grunt copy:logos
grunt copy:docs_assets
mv tmp/* site/docs/fr
rm -rf tmp


cp docs/html/index.html site
cp identity/favicon.ico site

npm install plato@1.2.x
node_modules/.bin/plato -d plato src/*.js src/**/*.js
mv plato site
