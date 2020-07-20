#!/bin/bash

###
# This script build creates the documentation page, made with
# styleguidist for the components, and documentation.js.
###

# Remove the old files from doc folder.
if rm -rf doc/build; then
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

# Move all styleguidist build in in documentation folder.
if mv styleguide-build doc/build; then
  echo "Move Styleguidist build suceeds."
else
  echo "Move styleguidist build failed."
  exit 1
fi

# Copy images in documentation folder.
if cp -rf src/images/ doc/build; then
  echo "Copy images in doc folder suceeds."
else
  echo "Copy images in doc folder failed."
  exit 1
fi

# Build jsdoc documentation for layers, in jsdoc folder (based on jsdoc_conf.json).
# if node ./scripts/doc.js; then
#   echo "jsdoc build suceeds."
# else
#   echo "Building jsdoc failed."
#   exit 1
# fi

# Rename jsdoc index.html and move in documentation folder.
# if mv docjs/index.html doc/build/docjs.html; then
#   echo "Move and rename docjs index suceeds."
# else
#   echo "Move and rename docjs index failed."
#   exit 1
# fi

# Move all jsdoc build in documentation folder.
# if mv docjs/* doc/build; then
#   echo "Move docjs build suceeds."
# else
#   echo "Move docjs build failed."
#   exit 1
# fi

# Remove emtpy folder.
# if rm -r docjs; then
#   echo "Remove emtpy folder suceeds."
# else
#   echo "Remove emtpy folder failed."
#   exit 1
# fi
