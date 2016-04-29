var pageMod = require("sdk/page-mod");

var self = require("sdk/self");

var pageModder = pageMod.PageMod({
	include: "*.facebook.com",
	contentStyleFile: self.data.url("eradicate.css"),
	contentScriptFile: [self.data.url("jquery.js"), self.data.url("eradicate.js")],
});
