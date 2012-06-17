var quoteList = [ 
	{
		quote: "I have just three things to teach: simplicity, patience, compassion. These three are your greatest treasures.",
		source: "Lao Tzu"
	},
	{
		quote: "In character, in manner, in style, in all things, the supreme excellence is simplicity.",
		source: "Henry Wadsworth Longfellow"
	},
	{
		quote: "If we don't discipline ourselves, the world will do it for us.",
		source: "William Feather"
	},
	{
		quote: "Rule your mind or it will rule you.",
		source: "Horace"
	},
	{
		quote: "All that we are is the result of what we have thought.",
		source: "Buddha"
	},
	{
		quote: "Doing just a little bit during the time we have available puts you that much further ahead than if you took no action at all.",
		source: "Pulsifer, Take Action; Don't Procrastinate"
	},
	{
		quote: "Never leave that till tomorrow which you can do today.",
		source: "Benjamin Franklin"
	},
	{
		quote: "Procrastination is like a credit card: it's a lot of fun until you get the bill.",
		source: "Christopher Parker"
	},
	{
		quote: "Someday is not a day of the week.",
		source: "Author Unknown"
	},
	{
		quote: "Tomorrow is often the busiest day of the week.",
		source: "Spanish Proverb"
	},
	{
		quote: "I can accept failure, everyone fails at something. But I can't accept not trying.",
		source: "Michael Jordan"
	},
	{
		quote: "There’s a myth that time is money. In fact, time is more precious than money. It’s a nonrenewable resource. Once you’ve spent it, and if you’ve spent it badly, it’s gone forever.",
		source: "Neil A. Fiore"
	}
];

var selectedQuote = quoteList[Math.floor(Math.random() * quoteList.length)];

var quoteDiv = $("<div/>").css({
	"fontSize": "24px"
});
var quote = $("<p>“"+selectedQuote.quote+"”</p>").css({
	'color': '#000',
	'borderLeft': '4px solid #99f',
	'marginLeft': '15px',
	'paddingLeft': '15px'
}).appendTo(quoteDiv);
var quoteSource = $("<p>~ "+selectedQuote.source+"</p>").css({
	'color': '#999'
}).appendTo(quoteDiv);

var fblink = $("<a href='http://www.facebook.com/"
		+"NewsFeedEradicator'>News Feed Eradicator</a>")
	.css({'fontSize': '10px'})
	.appendTo(quoteDiv);

setInterval(function(){
	$("#pagelet_home_stream").replaceWith(quoteDiv);
}, 1000);
