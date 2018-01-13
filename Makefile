.PHONY: all firefox chrome run-firefox clean

# The current git tag is used as the version number
GITTAG=$(shell git describe --always --tag)
BIN=$(shell yarn bin)

all: chrome

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
