#!/bin/bash
mkdir tmp
cp manifest.json tmp/
cp eradicate.js tmp/
cp prehide.css tmp/
cp jquery.js tmp/

cp assets/icon16.jpg tmp/
cp assets/icon48.jpg tmp/
cp assets/icon128.jpg tmp/

GITTAG=$(git describe --always --tag)

zip -r build/NewsFeedEradicator_$GITTAG.zip tmp
rm -R tmp
