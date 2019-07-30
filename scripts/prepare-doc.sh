#!/bin/bash

###
# This script build creates the documentation page, made with
# styleguidist for the components, and jsdoc for the layers.
###

# Remove the old files from doc folder.
if rm -rf doc/*; then
  echo "Documentation folder emptied."
else
  echo "Empty doc folder failed."
  exit 1
fi

# Build styleguidist documentation (based on styleguide.config.js).
if styleguidist build; then
  echo "Styleguidist build suceeds."
else
  echo "Building styleguidist failed."
  exit 1
fi

# Copy images in documentation folder.
if cp -rf src/images/ doc; then
  echo "Copy images in doc folder suceeds."
else
  echo "Copy images in doc folder failed."
  exit 1
fi

# Empty jsdoc folder.
if rm -rf jsdoc/*; then
  echo "jsdoc folder emptied."
else
  echo "Empty jsdoc folder failed."
  exit 1
fi

# Build jsdoc documentation for layers, in jsdoc folder (based on jsdoc_conf.json).
if jsdoc -c jsdoc_conf.json src/layers -d jsdoc -t doc_templates/jsdoc_template -r doc_templates/templates/README.md; then
  echo "jsdoc build suceeds."
else
  echo "Building jsdoc failed."
  exit 1
fi

# Move jsdoc in doc folder.
mkdir doc/jsdoc
mv jsdoc/index.html doc/jsdoc/
mv jsdoc/* doc/
rm -r jsdoc
