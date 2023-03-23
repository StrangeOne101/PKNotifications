var URL_MATCHER = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;
var tokenNeeded;


function extractToken(doc) {
	if (!doc) {
		doc = document;
	}
	$("script", doc).each((i, obj) => {
		var tokenMatches = obj.innerHTML.match(/csrf: '([0-9A-Fa-f,]{0,43})',/);

		if (tokenMatches != null) return tokenMatches[1];
	});
}

/**
 * Adds a button to the moderator tools that runs a set function
 * @param buttonText The text on the button
 * @param callback The function to run when the button is pressed
 */
function addModeratorPostAction(buttonText, callback) {
	var options = $($("article.message--post")[0]).children("div").children("div.message-cell.message-cell--main").children("div")
		.children("footer").children("div.message-actionBar.actionBar").children("div.actionBar-set.actionBar-set--internal");

	var newOption = document.createElement("a");
	newOption.href = "#";
	newOption.addEventListener("click", callback);
	newOption.id = buttonText.replace(" ", "").toLowerCase() + "ModButton";
	$(newOption).attr("class", "actionBar-action actionBar-action--report");
	$(newOption).attr("data-xf-click", "toggle");
	newOption.innerText = buttonText;
	options.append(newOption);
}

/**
 * Show a popup on the page. WIP.
 * @param title The title of the popup
 * @param contentHTML THe html to show under the title
 */
function showPopup(title, contentHTML) {
	var a_object = $(".overlay-container").first().children(".overlay").children(".overlay-title").children("a")[0];
	$(".overlay-container").first().children(".overlay").children(".overlay-title")[0].lastChild.nodeValue = title;
	$(".overlay-container").first().children(".overlay").children(".overlay-content").children(".block-container").children(".block-body").html(contentHTML);
	$(".overlay-container").first().children(".overlay").attr("aria-hidden", "false");
	$(".overlay-container").first().addClass("is-active");
}

/**
 * Function to convert a paragraph (or multiple) into an array of words
 * @param text The text post to check
 * @return The post split into an array of words
 */
function toWords(text) {
	while (text != text.replace(".", " ")) { //Replace full stops with spaces. Some spam threads don't have spaces
		text = text.replace(".", " ");       //after them...?
	}
	text = text.replace(/[^A-Za-z0-9 ]/g, ""); //Replace all non alpha-numeric characters
	while (text != text.replace("  ", " ")) { //Replace double spaces with spaces
		text = text.replace("  ", " ");
	}
	return text.split(" "); //Return words as an array with no empty strings
}

/**
 * Should the provided word not be included in the most used words list
 * @param word The word to check
 * @return Boolean - Should the word not be checked as spam or stored for analysis
 */
function shouldIgnore(word) {
	var pronouns = ["that", "she", "he", "it", "they", "something", "him", "her", //Personal pronouns now
		"i", "me", "you", "his", "hers", "mine", "yours", "we", "they", "them"];
	var prepositions = ["after", "in", "to", "on", "with", "under", "between", "over", "at", "without", "next"];
	var conjunctions = ["because", "and", "but", "if", "or", "when", "until"];
	var determiners = ["a", "the", "those", "this", "every", "many", "an", "my", "your"];

	var otherWords = ["not", "well", "done", "will", "can", "cant", "cannot", "should", "let", "go"];

	return pronouns.indexOf(word.toLowerCase()) != -1 || prepositions.indexOf(word.toLowerCase()) != -1 ||
		conjunctions.indexOf(word.toLowerCase()) != -1 || determiners.indexOf(word.toLowerCase()) != -1 ||
		otherWords.indexOf(word.toLowerCase()) != -1;
}

/**
 * Get a rating between -1 and 1 of how spammy this post is. 1 is defintely spam, and -1 is defintely not spam
 * @param text The post to check
 * @return The Spam rating
 */
function getSpamRating(text) {
	var wordsArray = toWords(text); //The array of words in the post

	var words = new Map(); //List of words that are spam
	var matches = new Map();
	var IPdomains = [];

	words.set("healthy", 3);
	words.set("health", 1);
	words.set("calories", 3);
	words.set("weightloss", 10);
	words.set("weight", 1);
	words.set("vitamin", 10);
	words.set("blazeweight", 20);
	words.set("keto blaze", 20);
	words.set("keto", 5);
	words.set("testosterone", 20);
	words.set("testo", 20);
	words.set("diet", 3);
	words.set("skin", 5);
	words.set("skin care", 20);
	words.set("supplement", 20);
	words.set("weight loss", 10);
	matches.set("(m|fem)ale enhancement", 20);
	words.set("intelliboost", 20); //wtf even is this
	words.set("muscles", 10);
	words.set("muscle", 10);
	words.set("natural", 1);
	words.set("order", 3);
	words.set("trial offer", 10);
	words.set("trials", 5);
	words.set("turmeric", 20);
	words.set("penis", 10);
	words.set("booster", 5);
	words.set("protein", 5);
	words.set("potentiation", 10);
	words.set("potentiation", 10);
	words.set("postactivation", 10);
	words.set("carbohydrates", 5);
	words.set("nutrition", 3);
	words.set("metabolism", 3);
	words.set("stamina", 1);
	words.set("runescape", 20);
	words.set("professional", 1);
	words.set("fallout 76", 5);
	words.set("cardio clear", 10);
	words.set("keto burn xtreme", 40);
	words.set("runescape", 5);
	words.set("stream online", 10);

	//Words to prevent normal threads from catching spam
	matches.set("project {0,1}korra", -5);
	words.set("jedcore", -20);
	matches.set("water {0,1}bend(ing|er|ers)", -20);
	matches.set("earth {0,1}bend(ing|er|ers)", -20);
	matches.set("fire {0,1}bend(ing|er|ers)", -20);
	matches.set("air {0,1}bend(ing|er|ers)", -20);
	words.set("avatar", -20);
	matches.set("chi {0,1}block(ing|er|ers)", -20);
	words.set("suggestion", -3);
	words.set("suggestions", -3);
	words.set("permission", -3);
	words.set("permissions", -3);
	words.set("bukkit", -10);
	words.set("spigot", -10);
	words.set("plugin", -5);
	words.set("plugins", -5);
	words.set("development", -1);
	words.set("player", -1);
	words.set("minecraft", -5);
	words.set("arena", -1);
	words.set("github", -10);
	words.set("debug.txt", -10);

	var elements = ["fire", "water", "earth", "air", "chi", "avatar", "lava", "plant", "ice", "blood", "healing",
		"metal", "sand", "combustion", "lightning", "flight", "bottle"];

	for (var i in elements) {
		matches.set(elements[i] + " {0,1}(bend|block)(ing|er|ers|)", -5);
	}

	var moves = ["AcrobatStance", "Acrobatics", "AirBlade", "AirBlast", "AirBreath", "AirBurst", "AirJump",
		"AirScooter", "AirShield", "AirSlam", "AirSuction", "AirSweep", "AirSwipe", "AvatarState", "Blaze", "Bloodbending",
		"Bottlebending", "Catapult", "Collapse", "Combustion", "EarthArmor", "EarthBlast", "EarthGrab", "EarthShard",
		"EarthSmash", "EarthTunnel", "ElementSphere", "Extraction", "FastSwim", "FireBall", "FireBlast", "FireBreath", "FireBurst",
		"FireJet", "FireKick", "FireManipulation", "FireShield", "FireSpin", "FireWheel", "Flight", "FrostBreath",
		"HealingWaters", "HeatControl", "HighJump", "IceBlast", "IceBullet", "IceSpike", "IceWall", "IceWave",
		"Illumination", "Immobilize", "JetBlast", "JetBlaze", "LavaDisc", "LavaFlow", "LavaFlux", "MetalClips",
		"MetalHook", "MudSurge", "OctopusForm", "Paralyze", "PhaseChange", "QuickStrike", "RaiseEarth", "RapidPunch",
		"SandBlast", "SandSpout", "SpiritBeam", "SpiritualProjection", "Shockwave", "Suffocate", "Surge", "SwiftKick", "Tornado", "Torrent",
		"Tremorsense", "Twister", "WakeFishing", "WallRun", "WallOfFire", "WarriorStance", "WaterArms", "WaterBubble",
		"WaterGimbal", "WaterManipulation", "WaterSpout"];

	for (var i in moves) {
		words.set(moves[i].toLowerCase(), -15);
	}

	words.set("blaze", -1); //Blaze is a keyword for some spam, so lessen the antispam amount

	matches.set(URL_MATCHER, 50);

	words.set("bending", -10);
	words.set("benders", -10);



	var currentRating = 0.0;

	//console.log(wordsArray);

	for (var i in wordsArray) {
		var wordKeyIterator = words.keys();
		for (var j = 0; j < words.size; j++) {
			var spamWordChecking = wordsArray[i];
			var word_ = wordKeyIterator.next().value;
			//If the spam word has a space, grab the next word too
			if (word_.indexOf(" ") != -1) spamWordChecking = spamWordChecking + " " + wordsArray[i + 1];

			if (word_.toLowerCase() == spamWordChecking) { //If the word is spam
				currentRating += words.get(spamWordChecking.toLowerCase());
				console.log(spamWordChecking.toLowerCase());
			}
		}
	}

	var matchesKeyIterator = matches.keys();
	for (var i = 0; i < matches.size; i++) {
		var regex = matchesKeyIterator.next().value;

		var matches_ = text.match(regex);

		if (matches_ != null) {
			currentRating += matches.get(regex) * matches_.length; //The spam rating for the regex * number of occurances
			console.log(regex);
		}
	}

	//if (wordsArray.length < 100) currentRating -= 10; //Spam is usually long. Decrease rating if it's shorter
	//if (wordsArray.length < 50) currentRating -= 20;

	if (currentRating > 500) currentRating = 500;
	else if (currentRating < -500) currentRating = -500;

	return currentRating / 100;
}

/**
 * Analyzes the text and produces an object to store locally for data analysis later
 * @param text The text post
 * @param spam Boolean - If it is actually spam or not
 * @param id The ID to identify this thread with
 */
function analyzeContent(text, spam, id) {
	text = text.replace(URL_MATCHER, ""); //Remove URLs before storing
	var words = toWords(text);

	var object = {};
	object.spam = spam;
	object.words = new Map();
	object.id = id;
	object.rating = getSpamRating(text);

	for (var i in words.length) {
		var word = words[i];

		if (shouldIgnore(word)) continue;

		if (object.words.has(word.toLowerCase())) {
			object.words[word.toLowerCase()] = object.words[word.toLowerCase()] + 1;
		} else {
			object.words[word.toLowerCase()] = 1;
		}
	}

	chrome.storage.local.get("spamDataCollection", function(result) {
		var currentCollection = [];
		if (result.spamDataCollection) { //If there is a previous collection, get it
			currentCollection = result.spamDataCollection;
		}
		currentCollection.push(object); //Add the latest object to it
		chrome.storage.local.set({
			"spamDataCollection": currentCollection
		});
	});

	return object;
}

/**
 * Open a thread and check if it's spam
 * @param url The URL to check
 */
function analyzePage(url, callback) {
	$.get(url, function(data) {
		//console.log(data);
		var doc = document.implementation.createHTMLDocument();
		doc.open();
		doc.write(data); //Write html
		doc.close();
		var title = $("h1.p-title-value", doc).text();

		/*console.log($("article.message--post", data));
		console.log("First is fine");
		console.log($("article.message--post", data).first());
		console.log("Second is fine");
		console.log($("article.message--post", data).first().children("div"));
		console.log("Third is fine");
		console.log($("article.message--post", data).first().children("div").children("div.message-cell.message-cell--main"));
		console.log("Fourth is fine");*/
		/*console.log($(data, "article.message--post").first().children("div").children("div.message-cell.message-cell--main")
			.children("div.message-main"));
		console.log("Fifth is fine");
		console.log($(data, "article.message--post").first().children("div").children("div.message-cell.message-cell--main")
			.children("div.message-main").children("div.message-content"));
		console.log("No. 6 is fine");
		console.log($(data, "article.message--post").first().children("div").children("div.message-cell.message-cell--main")
			.children("div.message-main").children("div.message-content").first());
		console.log("No. 7 is fine");
		console.log($(data, "article.message--post").first().children("div").children("div.message-cell.message-cell--main")
			.children("div.message-main").children("div.message-content").first().html());
		console.log("No. 8 is fine");*/
		var content = $("article.message--post", doc).first().children("div").children("div.message-cell.message-cell--main")
			.children("div.message-main").children("div.message-content").children("div.message-userContent").first().html();
		//console.log(content);
		content = content.replace(/<a href=['|"]([^ ]*)['|"].*>(.*)<\/a>/g, "$2 $1")
			.replace(/\/forum\/proxy\.php\?link=([A-Za-z0-9%\.]+)&hash=.*/g,
				(match, p1, offset, string) => { //Replace function that unescapes the urls
			return unescape(p1);
		});
		content = $(content).text();
		var hasAvatar = $("a.avatar--m", doc).first().children("img").length != 0;
		var userURL = $("a.username", doc).first().attr("href");
		var postId = Number.parseInt($("article.message--post", doc)[0].id.replace("js-post-", ""));

		console.log("Has avatar: " + hasAvatar);
		console.log("Userurl: " + userURL);
		console.log("Post: " + postId);

		var badIP = false;
		var IP = "";
		var promise1 = $.get(`https://projectkorra.com/forum/posts/${postId}/ip`, function(data2) {
			var doc = document.implementation.createHTMLDocument();
			doc.open();
			doc.write(data2); //Write html
			doc.close();
			IP = $("#top > div.p-body > div > div.p-body-main > div > div.p-body-pageContent > div > div > div > dl:nth-child(1) > dd", doc).text().trim();
			console.log(IP);
			//IP = tempIP.split("(")[1].split(")")[0];

			var IPdomains = [];

			IPdomains.push("vultr.com");
			IPdomains.push("16clouds.com");
			IPdomains.push("rev.poneytelecom.eu");
			IPdomains.push("consumer-pool.prcdn.net");
			IPdomains.push("injurynationwide.com");
			IPdomains.push("hsd1.mi.comcast.net");
			IPdomains.push("ff.avast.com");

			for (var i in IPdomains) {
				if (IP.indexOf(IPdomains[i]) != -1) {
					badIP = true;
					break;
				}
			}
		});

		var postCount = 0;
		var promise2 = $.get("https://projectkorra.com" + userURL + "?tooltip=true", function(data2) {
			var doc = document.implementation.createHTMLDocument();
			doc.open();
			doc.write(data2); //Write html
			doc.close();
			var c = $("#top > div.p-body > div > div.p-body-main > div > div.p-body-pageContent > div > div > div.memberTooltip-info > div > div > dl:nth-child(1) > dd > a", doc);
			postCount = Number.parseInt(c.text().trim());
		});



		var titleRating = getSpamRating(title);
		var contentRating = getSpamRating(content);
		var titleURL = title.match(URL_MATCHER) != null ? 1 : 0;
		Promise.all([promise1, promise2]).then(() => { //Analyze results after all HTTP requests return

			var totalRating = 0;

			totalRating += (badIP ? 3 : 0);
			totalRating += titleRating * 2;
			totalRating += titleURL * 3; //If there is a URL in the title
			totalRating += contentRating * 2;
			totalRating += (hasAvatar ? -1 : 1); //If they dont have an avatar, probs spam
			totalRating += (postCount == 1 ? 1 : (postCount == 2 ? 0.5 : 0));

			var ratingText = "";

			ratingText = (badIP ? "Has Bad IP (+3)" : "IP of " + IP + " (+0)") + "\n";
			ratingText += ("Title Rating (" + (titleRating > 0 ? "+" : "") + (titleRating * 2) + ")") + "\n";
			ratingText += (titleURL == 1 ? "Title has URL (+3)" : "Title has no URL (+0)") + "\n";
			ratingText += ("Content Rating (" + (contentRating > 0 ? "+" : "") + (contentRating * 2) + ")") + "\n";
			ratingText += (!hasAvatar ? "Has No Avatar (+1)" : "Has Avatar (-1)") + "\n";
			ratingText += (postCount == 1 ? "Has Single Post Count (+1)" : (postCount == 2 ? "Has Post Count of 2 (+0.5)" : "Post Count Above 2 (+0)"));

			var ratingResult = totalRating > 7.5 ? "Defintely Spam" :
				(totalRating > 6 ? "Probably Spam" :
					(totalRating > 4.5 ? "Most Likely Spam" :
						(totalRating > 3 ? "Likely Spam" :
							(totalRating > 2 ? "Possibly Spam" :
								(totalRating > 1 ? "Could Be Spam" :
									(totalRating > -0.3 ? "Too close to decide" :
										(totalRating > -1 ? "Unlikely to be spam" :
											(totalRating > -2 ? "Probably not spam" :
												(totalRating > -4 ? "Not Spam" : "As Clean as they come")))))))));

			ratingText += "\n\n" + ratingResult + " (" + ((totalRating >= 0 ? "+" : "") + totalRating) + ")";

			if (typeof callback !== 'undefined') {
				callback(totalRating, ratingText);
			}

			return totalRating;

		});
	});
}


function addAnalyzeButton() {
	var callback = function() {
		var textPostBase = $("article.message--post")[0];

		var id = Number.parseInt(textPostBase.id.replace("js-post-", ""));
		//#js-post-84010 > div > div.message-cell.message-cell--main > div > div
		var text = $(textPostBase).children("div").children("div.message-cell.message-cell--main")
			.children("div.message-main").children("div.message-content").first().text();
		text = text.replace(/\t/g, "").replace(/\n/g, " ");
		var object = analyzeContent(text, true, id);
		var goodOrNot = object.rating >= 0.5 ? "Defintely Spam" : (object.rating >= 0.25 ? "Probably Spam" : (object.rating > 0.1 ? "Maybe Spam" : (object.rating > -0.2 ? "Probably Not Spam" : (object.rating > -0.5 ? "Not Spam" : "As Clean As They Come"))));

		//alert("Analyzed post and got a rating of " + ((object.rating * 100) + "%") + " (" + goodOrNot + ")");

		//$("#analyzeModButton").attr("disabled", "disabled");
		console.log("Ignore the XenForo error. It's just because we are using their classes without them knowing ;)")
	}

	var callback2 = function() {
		analyzePage(document.URL, function(rating, text) {
			alert(text);
		});
		callback(); //Add to memory too
	}

	addModeratorPostAction("Analyze", callback2);
}

function addCleanSpamButton() {

	var callback = function() {
		var itemBox = $("#top > div.p-body > div > div.p-body-main > div > div.p-body-pageContent > div.block > div.block-container > div.structItemContainer");

		var items = itemBox.find("div.structItem.structItem--thread");

		$.each(items, (index, item) => {
			var url = $(item).children("div.structItem-cell.structItem-cell--main").children("div.structItem-title").children("a")[0].href;

			analyzePage(url, function(rating, ratingText) {
				if (rating >= 5) {
					var spamURL = "/forum/spam-cleaner/" + (url.replace(location.origin + "/forum/threads/", ""));
					var options = {
						action_threads: 1,
						delete_messages: 1,
						delete_conversations: 1,
						ban_user: 1,
						_xfToken: tokenNeeded,
						_xfWithData: 1,
						_xfRequestUri: spamURL,
						_xfResponseType: 'json',
						ct_checkjs: 0,
						no_redirect: ''
					};

					$.post(spamURL, options, function(result) {
						console.log("Spam cleaned URL: " + url + " | " + result);
					})
				}
			})
		});
	};

	var buttons = $("#top > div.p-body > div > div.p-body-main > div > div.p-body-pageContent > div.block > div:nth-child(1) > div.block-outer-opposite > div")

	var cleanSpamButton = document.createElement("a");
	cleanSpamButton.href = "#";
	cleanSpamButton.addEventListener("click", callback);
	cleanSpamButton.id = "CleanSpamButton";
	$(cleanSpamButton).attr("class", "button--link button");
	$(cleanSpamButton).attr("data-xf-click", "overlay");
	cleanSpamButton.innerText = "Clean Spam";
	buttons.append(cleanSpamButton);

}

if (document.location.hostname == "projectkorra.com") {
	$(document).ready(() => {
		tokenNeeded = extractToken();
	});
	setTimeout(() => {
		tokenNeeded = extractToken();
	}, 2000);
	if (document.location.pathname.startsWith("/forum/threads")) {
		//$(document).ready(addAnalyzeButton);
		addAnalyzeButton();
	} else if (document.location.pathname.startsWith("/forum/whats-new")) {
		addCleanSpamButton();
		//<a class="button--link button" data-xf-click="overlay"><span class="button-text">Clean Spam</span></a>
	}

}