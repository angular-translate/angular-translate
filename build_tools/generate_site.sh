#!/bin/bash -e
_LANGS=( "en" )

for _LANG in "${_LANGS[@]}"; do
  echo ""
  echo "Generate site '$_LANG'..."
  ./build_tools/generate_site_by_language.sh ${_LANG}
  echo "Finished site '$_LANG'."
  echo ""
done

cp docs/html/index.html site
cp identity/favicon.ico site

exit 0
