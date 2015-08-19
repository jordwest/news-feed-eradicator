var quoteList = require('./quotes.js')

// Compiles the info-panel content inline
var infoPanelContent = require('html!./info-panel.html');

var $ = require('jquery');

var selectedQuote = quoteList[Math.floor(Math.random() * quoteList.length)];

var quoteDiv, quoteText, quoteSource, fbLink, infoPanel, taikoPic;

quoteDiv = $("<div class='nfe-quote'/>");

// Info panel, hidden by default
infoPanel = $("<div class='nfe-info-panel'></div>")
		.hide()
		.appendTo(quoteDiv);

quoteText = $("<p>“"+selectedQuote.quote+"”</p>")
		.addClass('nfe-quote-text')
		.appendTo(quoteDiv);

quoteSource = $("<p>~ "+selectedQuote.source+"</p>")
		.addClass('nfe-quote-source')
		.appendTo(quoteDiv);

var hideInfoPanel = function(){
		$('div.nfe-info-panel').hide();
}

var extensionURL = function(relativeURL){
		if(window.chrome !== undefined){
				// Chrome extension
				return chrome.extension.getURL(relativeURL);
		}else{
				// Firefox extension
				return self.options.urls[relativeURL];
		}
}

fbLink = $("<a href='javascript:;'>News Feed Eradicator :)</a>")
	.addClass('nfe-info-link')
	.on('click', function(){
		var handleClose = function() {
			$('.nfe-close-button').on('click', hideInfoPanel);
		};

		infoPanel.html(infoPanelContent);
		infoPanel.show();
		
		})
	.appendTo(quoteDiv);

// This delay ensures that the elements have been created by Facebook's
// scripts before we attempt to replace them
setInterval(function(){
	// Replace the news feed
	$("div#pagelet_home_stream").replaceWith(quoteDiv);
	$("div[id^='topnews_main_stream']").replaceWith(quoteDiv);

	// Delete the ticker
	$("div#pagelet_ticker").remove();

	// Delete the trending box
	$("div#pagelet_trending_tags_and_topics").remove();
}, 1000);
