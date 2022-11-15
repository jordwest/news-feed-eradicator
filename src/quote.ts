export type CustomQuote = {
	id: string;
	text: string;
	source: string;
};
export type BuiltinQuote = {
	id: number;
	text: string;
	source: string;
};
export type Quote = CustomQuote | BuiltinQuote;

export const BuiltinQuotes: Array<BuiltinQuote> = [
	{
		id: 1,
		text: 'I have just three things to teach: simplicity, patience, compassion. These three are your greatest treasures.',
		source: 'Lao Tzu',
	},
	{
		id: 2,
		text: "Do today what others won't and achieve tomorrow what others can't.",
		source: 'Jerry Rice',
	},
	{
		id: 3,
		text: 'In character, in manner, in style, in all things, the supreme excellence is simplicity.',
		source: 'Henry Wadsworth Longfellow',
	},
	{
		id: 4,
		text: "If we don't discipline ourselves, the world will do it for us.",
		source: 'William Feather',
	},
	{
		id: 5,
		text: 'Rule your mind or it will rule you.',
		source: 'Horace',
	},
	{
		id: 6,
		text: 'All that we are is the result of what we have thought.',
		source: 'Buddha',
	},
	{
		id: 7,
		text: 'Doing just a little bit during the time we have available puts you that much further ahead than if you took no action at all.',
		source: "Pulsifer, Take Action; Don't Procrastinate",
	},
	{
		id: 8,
		text: 'Never leave that till tomorrow which you can do today.',
		source: 'Benjamin Franklin',
	},
	{
		id: 9,
		text: "Procrastination is like a credit card: it's a lot of fun until you get the bill.",
		source: 'Christopher Parker',
	},
	{
		id: 10,
		text: 'Someday is not a day of the week.',
		source: 'Author Unknown',
	},
	{
		id: 11,
		text: 'Tomorrow is often the busiest day of the week.',
		source: 'Spanish Proverb',
	},
	{
		id: 12,
		text: "I can accept failure, everyone fails at something. But I can't accept not trying.",
		source: 'Michael Jordan',
	},
	{
		id: 13,
		text: 'There’s a myth that time is money. In fact, time is more precious than money. It’s a nonrenewable resource. Once you’ve spent it, and if you’ve spent it badly, it’s gone forever.',
		source: 'Neil A. Fiore',
	},
	{
		id: 15,
		text: 'There is only one success--to be able to spend your life in your own way.',
		source: 'Christopher Morley',
	},
	{
		id: 16,
		text: 'Success is the good fortune that comes from aspiration, desperation, perspiration and inspiration.',
		source: 'Evan Esar',
	},
	{
		id: 17,
		text: 'We are still masters of our fate. We are still captains of our souls.',
		source: 'Winston Churchill',
	},
	{
		id: 18,
		text: 'Our truest life is when we are in dreams awake.',
		source: 'Henry David Thoreau',
	},
	{
		id: 19,
		text: 'The best way to make your dreams come true is to wake up.',
		source: 'Paul Valery',
	},
	{
		id: 20,
		text: 'Life without endeavor is like entering a jewel mine and coming out with empty hands.',
		source: 'Japanese Proverb',
	},
	{
		id: 21,
		text: 'Happiness does not consist in pastimes and amusements but in virtuous activities.',
		source: 'Aristotle',
	},
	{
		id: 22,
		text: 'By constant self-discipline and self-control, you can develop greatness of character.',
		source: 'Grenville Kleiser',
	},
	{
		id: 23,
		text: 'The difference between a successful person and others is not a lack of strength, not a lack of knowledge, but rather a lack in will.',
		source: 'Vince Lombardi Jr.',
	},
	{
		id: 24,
		text: 'At the end of the day, let there be no excuses, no explanations, no regrets.',
		source: 'Steve Maraboli',
	},
	{
		id: 25,
		text: 'Inaction will cause a man to sink into the slough of despond and vanish without a trace.',
		source: 'Farley Mowat',
	},
	{
		id: 26,
		text: 'True freedom is impossible without a mind made free by discipline.',
		source: 'Mortimer J. Adler',
	},
	{
		id: 27,
		text: 'The most powerful control we can ever attain, is to be in control of ourselves.',
		source: 'Chris Page',
	},
	{
		id: 28,
		text: 'Idleness is only the refuge of weak minds, and the holiday of fools.',
		source: 'Philip Dormer Stanhope',
	},
	{
		id: 29,
		text: "This is your life and it's ending one minute at a time.",
		source: 'Tyler Durden, Fight Club',
	},
	{
		id: 30,
		text: 'You create opportunities by performing, not complaining.',
		source: 'Muriel Siebert',
	},
	{
		id: 31,
		text: 'Great achievement is usually born of great sacrifice, and is never the result of selfishness.',
		source: 'Napoleon Hill',
	},
	{
		id: 33,
		text: 'Even if I knew that tomorrow the world would go to pieces, I would still plant my apple tree.',
		source: 'Martin Luther',
	},
	{
		id: 34,
		text: 'Great acts are made up of small deeds.',
		source: 'Lao Tzu',
	},
	{
		id: 35,
		text: 'The flame that burns Twice as bright burns half as long.',
		source: 'Lao Tzu',
	},
	{
		id: 36,
		text: 'Perfection is achieved not when there is nothing more to add, but when there is nothing left to take away.',
		source: 'Antoine de Saint-Exupery',
	},
	{
		id: 37,
		text: "If you can't do great things, do small things in a great way.",
		source: 'Napoleon Hill',
	},
	{
		id: 38,
		text: 'When I let go of what I am, I become what I might be.',
		source: 'Lao Tzu',
	},
	{
		id: 39,
		text: 'Do not go where the path may lead, go instead where there is no path and leave a trail.',
		source: 'Ralph Waldo Emerson',
	},
	{
		id: 40,
		text: 'Well done is better than well said.',
		source: 'Benjamin Franklin',
	},
	{
		id: 41,
		text: 'Whatever you think the world is withholding from you, you are withholding from the world.',
		source: 'Eckhart Tolle',
	},
	{
		id: 42,
		text: 'Muddy water is best cleared by leaving it alone.',
		source: 'Alan Watts',
	},
	{
		id: 43,
		text: 'Do, or do not. There is no try.',
		source: 'Yoda',
	},
	{
		id: 44,
		text: 'The superior man is modest in his speech, but exceeds in his actions.',
		source: 'Confucius',
	},
	{
		id: 45,
		text: 'Optimism is the faith that leads to achievement. Nothing can be done without hope and confidence.',
		source: 'Helen Keller',
	},
	{
		id: 46,
		text: 'We must believe that we are gifted for something, and that this thing, at whatever cost, must be attained.',
		source: 'Marie Curie',
	},
	{
		id: 47,
		text: 'If you look at what you have in life, you’ll always have more. If you look at what you don’t have in life, you’ll never have enough.',
		source: 'Oprah Winfrey',
	},
	{
		id: 48,
		text: 'You may encounter many defeats, but you must not be defeated. In fact, it may be necessary to encounter the defeats, so you can know who you are, what you can rise from, how you can still come out of it.',
		source: 'Maya Angelou',
	},
	{
		id: 49,
		text: 'We need to start work with the idea that we’re going to learn every day. I learn, even at my position, every single day.',
		source: 'Chanda Kochhar',
	},
	{
		id: 50,
		text: 'There are two kinds of people, those who do the work and those who take the credit. Try to be in the first group; there is less competition there.',
		source: 'Indira Gandhi',
	},
	{
		id: 51,
		text: 'You can’t be that kid standing at the top of the waterslide, overthinking it. You have to go down the chute.',
		source: 'Tina Fey',
	},
	{
		id: 52,
		text: 'Above all, be the heroine of your life, not the victim.',
		source: 'Nora Ephron',
	},
	{
		id: 53,
		text: 'Learn from the mistakes of others. You can’t live long enough to make them all yourself.',
		source: 'Eleanor Roosevelt',
	},
	{
		id: 54,
		text: 'What you do makes a difference, and you have to decide what kind of difference you want to make.',
		source: 'Jane Goodall',
	},
	{
		id: 55,
		text: 'One of the secrets to staying young is to always do things you don’t know how to do, to keep learning.',
		source: 'Ruth Reichl',
	},
	{
		id: 56,
		text: 'If you don’t risk anything, you risk even more.',
		source: 'Erica Jong',
	},
	{
		id: 57,
		text: 'When the whole world is silent, even one voice becomes powerful.',
		source: 'Malala Yousafzai',
	},
	{
		id: 58,
		text: 'The most common way people give up their power is by thinking they don’t have any.',
		source: 'Alice Walker',
	},
	{
		id: 59,
		text: 'My philosophy is that not only are you responsible for your life, but doing the best at this moment puts you in the best place for the next moment.',
		source: 'Oprah Winfrey',
	},
	{
		id: 60,
		text: 'Don’t be intimidated by what you don’t know. That can be your greatest strength and ensure that you do things differently from everyone else.',
		source: 'Sara Blakely',
	},
	{
		id: 61,
		text: 'If I had to live my life again, I’d make the same mistakes, only sooner.',
		source: 'Tallulah Bankhead',
	},
	{
		id: 62,
		text: 'Never limit yourself because of others’ limited imagination; never limit others because of your own limited imagination.',
		source: 'Mae C. Jemison',
	},
	{
		id: 63,
		text: 'If you obey all the rules, you miss all the fun.',
		source: 'Katharine Hepburn',
	},
	{
		id: 64,
		text: 'Life shrinks or expands in proportion to one’s courage.',
		source: 'Anaïs Nin',
	},
	{
		id: 65,
		text: 'Avoiding danger is no safer in the long run than outright exposure. The fearful are caught as often as the bold.',
		source: 'Helen Keller',
	},
	{
		id: 66,
		text: 'How wonderful it is that nobody need wait a single moment before beginning to improve the world.',
		source: 'Anne Frank',
	},
	{
		id: 67,
		text: 'So often people are working hard at the wrong thing. Working on the right thing is probably more important than working hard.',
		source: 'Caterina Fake',
	},
	{
		id: 68,
		text: 'There are still many causes worth sacrificing for, so much history yet to be made.',
		source: 'Michelle Obama',
	},
	{
		id: 69,
		text: 'Nothing is impossible; the word itself says ‘I’m possible’!',
		source: 'Audrey Hepburn',
	},
	{
		id: 70,
		text: 'You only live once, but if you do it right, once is enough.',
		source: 'Mae West',
	},
	{
		id: 71,
		text: 'We must use time creatively, in the knowledge that the time is always ripe to do right.',
		source: 'Martin Luther King Jr.',
	},
	{
		id: 72,
		text: 'Every birthday is a gift. Every day is a gift.',
		source: 'Aretha Franklin',
	},
	{
		id: 73,
		text: 'The quality, not the longevity, of one’s life is what is important.',
		source: 'Martin Luther King Jr.',
	},
	{
		id: 74,
		text: 'Good manners will often take people where neither money nor education will take them.',
		source: 'Fanny Jackson Coppin',
	},
	{
		id: 75,
		text: 'No matter how big a nation is, it is no stronger than its weakest people, and as long as you keep a person down, some part of you has to be down there to hold him down, so it means you cannot soar as you might otherwise.',
		source: 'Marian Anderson',
	},
	{
		id: 76,
		text: 'The minute a person whose word means a great deal to others dare to take the open-hearted and courageous way, many others follow.',
		source: 'Marian Anderson',
	},
	{
		id: 77,
		text: 'You cannot define a person on just one thing. You can’t just forget all these wonderful and good things that a person has done because one thing didn’t come off the way you thought it should come off.',
		source: 'Aretha Franklin',
	},
	{
		id: 78,
		text: 'If you do not have courage, you may not have the opportunity to use any of your other virtues.',
		source: 'Samuel L. Jackson',
	},
	{
		id: 79,
		text: "Our humanity is worth a little discomfort, it's actually worth a lot of discomfort.",
		source: 'Ijeoma Oluo',
	},
	{
		id: 80,
		text: 'Not everything that is faced can be changed, but nothing can be changed until it is faced.',
		source: 'James Baldwin',
	},
	{
		id: 81,
		text: 'If you’re always trying to be normal you will never know how amazing you can be.',
		source: 'Maya Angelou',
	},
	{
		id: 82,
		text: 'If you find it in your heart to care for somebody else, you will have succeeded.',
		source: 'Maya Angelou',
	},
	{
		id: 83,
		text: 'I’ve learned that whenever I decide something with an open heart, I usually make the right decision.',
		source: 'Maya Angelou',
	},
	{
		id: 84,
		text: 'Every man must decide whether he will walk in the light of creative altruism or in the darkness of destructive selfishness.',
		source: 'Martin Luther King Jr.',
	},
	{
		id: 85,
		text: 'An individual has not started living until he can rise above the narrow confines of his individualistic concerns to the broader concerns of all humanity.',
		source: 'Martin Luther King Jr.',
	},
	{
		id: 86,
		text: 'Those who are not looking for happiness are the most likely to find it, because those who are searching forget that the surest way to be happy is to seek happiness for others.',
		source: 'Martin Luther King Jr.',
	},
];
