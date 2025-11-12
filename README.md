# News Feed Eradicator

A browser extension that replaces your social media feeds with a quote.

[Install Chrome Extension](https://chrome.google.com/webstore/detail/news-feed-eradicator-for/fjcldmjmjhkklehbacihaiopjklihlgg?hl=en)

[Install Firefox Add-on](https://addons.mozilla.org/en-US/firefox/addon/news-feed-eradicator/)

---------

## Contributing to News Feed Eradicator

### Reporting issues

For *bugs only*, please use the [issue tracker](https://github.com/jordwest/news-feed-eradicator/issues).

### Feature requests, ideas, etc

For feature requests, ideas, and new site suggestions, please use the [Ideas discussion board](https://github.com/jordwest/news-feed-eradicator/discussions/categories/ideas). Check first if your idea already exists and give it an upvote if so.

### Pull requests

In general, pull requests are only accepted for bug fixes or documentation improvements. In terms of features I mostly consider the project "done" and would like to keep it minimal and simple to reduce the maintenance burden. If you have ideas, please post in the [Ideas discussion board](https://github.com/jordwest/news-feed-eradicator/discussions/categories/ideas). You are of course welcome to fork the project if you'd like to make a more complex version.

----------

## Development

This plugin is built as a WebExtension - a standard for browser plugins currently supported in both Chrome and Firefox.

To build for either browser, clone the repository and then run:

    make dev

If everything is successful, check the `build` folder for the extension contents. You can load the `build` directory into either Chrome or Firefox as an _unpacked_ or _temporary_ extension. See the instructions for [Chrome](https://developer.chrome.com/docs/extensions/get-started/tutorial/hello-world#load-unpacked) or [Firefox](https://developer.mozilla.org/en-US/Add-ons/WebExtensions/Temporary_Installation_in_Firefox).

Running `make dev` will watch for changes and recompile, however each time you make changes you'll need to tell the browser to reload the temporary extension.

To build a distributable `.zip` for production, just run:

    make

The extension package can be found in the `dist` folder.
