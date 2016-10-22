.PHONY: all firefox chrome run-firefox clean

# The current git tag is used as the version number
GITTAG=$(shell git describe --always --tag)
BIN=$(shell yarn bin)

all: firefox chrome

firefox:
	BROWSER=firefox NODE_ENV=production $(BIN)/webpack
	mkdir -p dist/firefox
	(cd build/firefox && jpm xpi)
	mv build/firefox/*.xpi dist/firefox/

run-firefox:
	BROWSER=firefox $(BIN)/webpack
	(cd build/firefox && jpm run)

chrome-dev:
	BROWSER=chrome $(BIN)/webpack --progress --colors --watch

chrome:
	BROWSER=chrome NODE_ENV=production $(BIN)/webpack
	mkdir -p dist/chrome
	(cd build/chrome && zip -r ../../dist/chrome/NewsFeedEradicator_$(GITTAG).zip .)

install:
	yarn install

clean:
	rm -rf dist
	rm -rf build
