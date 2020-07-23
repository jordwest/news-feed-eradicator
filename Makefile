.PHONY: all clean install dev copy-assets package-source

# The current git tag is used as the version number
GITTAG=$(shell git describe --always --tag)
BIN=$(shell yarn bin)

build: install copy-assets
	mkdir -p build
	NODE_ENV=production ./node_modules/.bin/rollup -c
	mkdir -p dist
	(cd build && zip -r ../dist/NewsFeedEradicator_$(GITTAG).zip .)

# Firefox Add-on store requires source to be submitted as a zip, so this command builds that zip
package-source:
	mkdir -p dist
	git archive --output=dist/NewsFeedEradicator_source_$(GITTAG).zip HEAD

copy-assets:
	mkdir -p build
	cp src/manifest.json build/manifest.json
	cp src/options.html build/options.html
	cp src/background/background.html build/background.html
	cp assets/icon16.jpg build/icon16.jpg
	cp assets/icon48.jpg build/icon48.jpg
	cp assets/icon128.jpg build/icon128.jpg

dev: install copy-assets
	mkdir -p build
	./node_modules/.bin/rollup -c --watch

install:
	npm install

clean:
	rm -rf dist
	rm -rf build
	rm -rf node_modules
