.PHONY: all clean install dev package-source

# The current git tag is used as the version number
GITTAG=$(shell git describe --always --tag)

build: install
	bun run src/dev/build.ts
	mkdir -p dist
	(cd build && zip -r ../dist/NewsFeedEradicator_$(GITTAG).zip .)

# Firefox Add-on store requires source to be submitted as a zip, so this command builds that zip
package-source:
	mkdir -p dist
	git archive --output=dist/NewsFeedEradicator_source_$(GITTAG).zip HEAD

dev: install
	bun run src/dev/build.ts --watch

install:
	bun install

clean:
	rm -rf dist
	rm -rf build
	rm -rf node_modules
