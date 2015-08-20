.PHONY: all firefox chrome run-firefox clean

# The current git tag is used as the version number
GITTAG=$(shell git describe --always --tag)

all: firefox chrome

firefox:
	BROWSER=firefox webpack
	mkdir -p dist/firefox
	(cd build/firefox && jpm xpi)
	mv build/firefox/*.xpi dist/firefox/

run-firefox:
	BROWSER=firefox webpack
	(cd build/firefox && jpm run)

chrome:
	BROWSER=chrome webpack
	mkdir -p dist/chrome
	(cd build/chrome && zip -r ../../dist/chrome/NewsFeedEradicator_$(GITTAG).zip .)

install:
	npm install -g webpack
	npm install

clean:
	rm -rf dist
	rm -rf build
