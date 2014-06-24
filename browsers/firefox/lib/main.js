var pageMod = require("sdk/page-mod");

var self = require("sdk/self");

pageMod.PageMod({
    include: "*.facebook.com",
    contentStyleFile: self.data.url("eradicate.css"),
    contentScriptFile: [self.data.url("jquery.js"), self.data.url("eradicate.js")],
    contentScriptOptions: {
        urls: {
            'info-panel.html': self.data.url('info-panel.html')
        }
    }
});
