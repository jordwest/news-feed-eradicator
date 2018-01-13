News Feed Eradicator
====================

A browser extension that deletes your Facebook news feed
and replaces it with a nice quote.

[Install from Chrome Web Store](https://chrome.google.com/webstore/detail/news-feed-eradicator-for/fjcldmjmjhkklehbacihaiopjklihlgg?hl=en)

![Screenshot](https://raw.githubusercontent.com/jordwest/news-feed-eradicator/master/assets/screenshot.jpg)

Development
-----------

**Note: this project is currently undergoing a refactor to use Snabbdom instead of React, and to remove the browser specific code. Instead,
now that Firefox supports WebExtensions, the goal is to make a WebExtension that can be submitted as is to both the Chrome and Firefox web stores.**

**Currently, the best way to install it on Firefox is to use [Chrome Store Foxified](https://addons.mozilla.org/en-US/firefox/addon/chrome-store-foxified/), until the official add-on is submitted to the Firefox add-on store.**

To get started, clone the repository and then run:

    make install
    make chrome-dev

Project folder structure:

    src                             # Source
    assets                          # Images

    # Build output:
    build                           # The raw extension contents
    dist                            # Distributable extension package
