#!/bin/bash -e
_LANG=${1-"en"}

rm -rf ./tmp ./site/docs/${_LANG}
mkdir -p ./site/docs/${_LANG}

grunt ngdocs --lang=${_LANG}
grunt copy:logos
grunt copy:docs_assets
mv tmp/* site/docs/${_LANG}/
rm -rf ./tmp

exit 0
