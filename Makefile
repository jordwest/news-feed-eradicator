.PHONY: all firefox chrome run-firefox clean

# The current git tag is used as the version number
GITTAG=$(shell git describe --always --tag)

all: firefox chrome

firefox:
	BROWSER=firefox NODE_ENV=production webpack
	mkdir -p dist/firefox
	(cd build/firefox && jpm xpi)
	mv build/firefox/*.xpi dist/firefox/

run-firefox:
	BROWSER=firefox webpack
	(cd build/firefox && jpm run)

chrome-dev:
	BROWSER=chrome webpack --progress --colors --watch

chrome:
	BROWSER=chrome NODE_ENV=production webpack
	mkdir -p dist/chrome
	(cd build/chrome && zip -r ../../dist/chrome/NewsFeedEradicator_$(GITTAG).zip .)

install:
	npm install -g webpack
	npm install

clean:
	rm -rf dist
	rm -rf build
