#!/bin/bash
mkdir build
cp manifest.json build/
cp eradicate.js build/
cp prehide.css build/
cp jquery.js build/
cp jquery.livequery.js build/

cp icon16.jpg build/
cp icon48.jpg build/
cp icon128.jpg build/
zip -r build.zip build
rm -R build
