.PHONY: all firefox chrome run-firefox clean

# The current git tag is used as the version number
GITTAG=$(shell git describe --always --tag)

all: firefox chrome

firefox:
	BROWSER=firefox webpack
	mkdir -p build/firefox
	(cd dist/firefox && jpm xpi)
	mv dist/firefox/*.xpi build/firefox/

run-firefox:
	BROWSER=firefox webpack
	(cd dist/firefox && jpm run)

chrome:
	BROWSER=chrome webpack
	mkdir -p build/chrome
	(cd dist/chrome && zip -r ../../build/chrome/NewsFeedEradicator_$(GITTAG).zip .)

install:
	npm install -g webpack
	npm install

clean:
	rm -rf dist
	rm -rf build
