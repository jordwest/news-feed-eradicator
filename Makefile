.PHONY: all firefox chrome

# The current git tag is used as the version number
GITTAG=$(shell git describe --always --tag)

all: firefox chrome

firefox:
	BROWSER=firefox webpack
	mkdir -p build/firefox
	(cd dist/firefox && jpm xpi)
	mv dist/firefox/*.xpi build/firefox/

chrome:
	BROWSER=chrome webpack
	mkdir -p build/chrome
	(cd dist/chrome && zip -r ../../build/chrome/NewsFeedEradicator_$(GITTAG).zip .)

install:
	npm install -g webpack
	npm install
