var alerts = 0;
var alerts_old = 0;
var messages = 0;
var messages_old = 0;
var my_notids_alerts = [];
var my_notids_messages = [];
var my_notids_messages_urls = [];
var updated_notid = -1;
var fools = false;

var background = true;
var customNewTheme = false;
var customNewThemeData = "";

var iconPath = "img/Korra/";

var loaded = false;

var theurl = 'https://projectkorra.com/forum';

var tempdata;

var debugEnabled = false;

var secretOptions = [];
var themedata = [];

var updatedThemes = true;

function checkEverything() {
	if (!background) {
		chrome.tabs.getAllInWindow(function(tabs) {
			for (var i in tabs) {
				tab = tabs[i];
				debug("URL: " + tab.url + " | " + tab.url.startsWith(theurl))
				if (tab.url.startsWith(theurl)) {
					actuallyCheckStuff();
					break;
				}
			}
		});
	} else {
		actuallyCheckStuff();
	}    
}

function actuallyCheckStuff() {
	$.ajax({
        url: theurl,
        success: function(data) {
            data = data.replace(/\"\/\//g, "\"http://");
            checkNotifications(data);
        }
    });
}

function makeNotification(title, message, minimessage) {
    if (typeof minimessage == "undefined") {
        minimessage = "";
    }
    chrome.notifications.create({
        type: "basic",
        iconUrl: iconPath + "icon128.png",
        title: title,
        message: message,
        contextMessage: (title.startsWith("New M") ? "" : minimessage)
    }, function(notificationid) {
        if (title.startsWith("New A")) {
            my_notids_alerts.push(notificationid);
        } else if (title.startsWith("New M")) {
            my_notids_messages.push(notificationid);
            my_notids_messages_urls[notificationid] = minimessage;
        } else if (title.startsWith("Extension")) {
            updated_notid = notificationid;
        }
    });
    new Audio("notification.mp3").play();
}

chrome.notifications.onClosed.addListener(function(notificationid, byuser) {
    if (my_notids_alerts.indexOf(notificationid) > -1) {
        my_notids_alerts.pop(notificationid);
    } else if (my_notids_messages.indexOf(notificationid) > -1) {
        my_notids_messages.pop(notificationid);
    } else if (typeof my_notids_messages_urls[notificationid] === 'undefined') {
    	my_notids_messages_urls[notificationid] = 'undefined';
    }
});

chrome.notifications.onClicked.addListener(function(notificationid) {
    if (my_notids_alerts.indexOf(notificationid) > -1) {
        my_notids_alerts.pop(notificationid);
        chrome.notifications.clear(notificationid);
        window.open(theurl + "/account/alerts");
    } else if (my_notids_messages.indexOf(notificationid) > -1) {
        my_notids_messages.pop(notificationid);
        chrome.notifications.clear(notificationid);
        window.open(my_notids_messages_urls[notificationid]);
        my_notids_messages_urls[notificationid] = 'undefined';
    } else if (updated_notid == notificationid) {
        if (!fools) {window.open("changelog.html");}
        else {window.open("https://www.youtube.com/watch?v=JSz8nK9yaeY");}
    }
});

chrome.runtime.onInstalled.addListener(function(a) {
    if (new Date().getDate() == 1 && new Date().getMonth() == 3) {
        fools = true;
    }
    
    if (secretOptions.length == 0) {
		 addSecretKey("noadsplease");
	}
    
    if (a.reason === "update" || fools) {
        var v = chrome.runtime.getManifest().version;
        /*if (fools) {
            var s = "TkHe ekhtenion is bRoken! PleaSe re-dovNload it aT onxe to sTuop pRoblens from ocsturrIng!";
            makeNotification("Extension Broken", s, "Click for details!");
        }*/
        //else {
            makeNotification("Extension Updated", "ProjectKorra Notifier has been updated to version " + v + "!", "Click for details!");
        //}
        if (v == "1.4.5") {
        	makeNotification("Thank you!", "Thanks for continuing to use PK Notification! As thanks, everyone now gets an ad free experience on the forums!");
        }
    }

});

function checkNotifications(data) {
    alerts_old = alerts;
    messages_old = messages;

    alerts = parseInt($(data).find("a.badgeContainer[href='/forum/account/alerts']").attr("data-badge"));
    messages = parseInt($(data).find("a.badgeContainer[href='/forum/conversations/']").attr("data-badge"));

    chrome.storage.local.set({
        'alerts': alerts
    });
    chrome.storage.local.set({
        'messages': messages
    });

    var total = alerts + messages;

    chrome.browserAction.setBadgeText({
        text: (total == 0) ? "" : total.toString()
    });

    if (total > 0) {
        if (alerts > alerts_old) {
            alerts_old = alerts;
            makeNotification("New Alert(s)", "You've got " + alerts + " new alert" + (alerts == 1 ? "" : "s") + "!");
        }

        if (messages > messages_old) {
            messages_old = messages;
            //Bye bye old message system!
            //makeNotification("New Message(s)", "You've got " + messages + " unread message" + (messages == 1 ? "" : "s") + "!");
            
            $.ajax({
                url: theurl + "/conversations/",
                success: function(data) {
                    checkMessages($.parseHTML(data));
                }
            });
        }
    }
}

function checkMessages(data) {
    if (data !== NaN) {
        //map = new Map(); //User, number
    	people = [];
    	msgs = 0;
        for (var i = 0; i < messages_old; i++) {
        	tempdata = data;
        	//console.log(data.length);
        	//debug("i = " + $(data).find("li.unread").get(i).getAttribute("data-author"))
            str2 = $(tempdata).find("div.is-unread").children("div.structItem-cell--latest").children("div.structItem-minor").text();
            //debug("Object: " + String(str2));
            //debug("Name of messagew: " + String(stringg));
            if (people.indexOf(str2) == -1 && str2 != '') {
                people.push(str2);
            }
            msgs += 1;
            break; //This is temp. Currently it only gets the latest message from the latest member so until that is fixed, we break
        }
        //debug("Map: " + String(map.keys().toString()));
        if (people.length == 1) {
        	url = $(tempdata).find("div.is-unread").children("div.structItem-cell--main").children("a")[0].getAttribute("href");
        	//debug("Count: " + msgs + " | " + people.toString() + " | " + (theurl + "/" + url));
            makeNotification("New Message", "You've got " + msgs + " new message" + (msgs == 1 ? "" : "s") + " from " + people[0] + "!", "https://projectkorra.com" + url);
        }
        else if (people.length == 2) {
            makeNotification("New Messages", "You've got " + msgs + " new messages from " + people[0] + " and " + people[1] + "!", theurl + "/conversations/");
        }
        else if (people.length >= 3) {
            makeNotification("New Messages", "You've got " + msgs + " new messages from " + people[0] + " and " + (people.length - 1) + " other people!", theurl + "/conversations/");
        }
    } else {
    	debug("Failed!");
    }
}



function debug(string) {
	if (debugEnabled) makeNotification("DEBUG", string, theurl);
}

function generateHash(string) {
	var hash = 0;
	if (string.length == 0) return hash;
	for (i = 0; i < string.length; i++) {
		char = string.charCodeAt(i);
		hash = ((hash<<5)-hash)+char;
		hash = hash & hash; // Convert to 32bit integer
	}
	return hash;
}

function addSecretKey(string) {
	var hash = generateHash(string);
	if (secretOptions.indexOf(hash) != -1) return;
	
	if (hash == 360660962) {
		secretOptions.push("" + hash); //Convert to string
		saveSecretKeys();
		getThemeData();
		setInterval(getThemeData, 30 * 60 * 1000);
		return true;
	} else if (hash == 816653305) {
		secretOptions.push("" + hash);
		saveSecretKeys();
		return true;
	} else if (hash == 830836045) { //Anti-spam
		secretOptions.push("" + hash);
		saveSecretKeys();
		return true;
	} else {
		return false; //
	}
}

function getThemeData() {
	for (var i in secretOptions) {
		var key = secretOptions[i];
	    		
		if (key.startsWith("360660962")) {
			var themestyle;
			var logourl;
			themedata = [];
			updatedThemes = false;

			$.get("https://strangeone101.github.io/pk/themes/manager.json", function(data) {
				try {
					themedata = eval(data);

					var urlRegex = new RegExp("https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{2,256}\\.[a-z]{2,6}\\b([-a-zA-Z0-9@:%_\\+.~#?&//=]*)");

					for (var i = 0; i < themedata.length; i++) {
						const o = themedata[i];

						if (o.style && o.style.matches(urlRegex)) {
							$.get(o.style, function(styleData) {
								o.style = styleData;
							});
						}

						if (o.script && o.script.matches(urlRegex)) {
							$.get(o.script, function(scriptData) {
								o.script = scriptData;
							});
						}
					}

					console.log("Fetched " + themedata.length + " themes from the online database");
				} catch (e) {
					console.log("Failed to get theme information from the database!");
					console.log(e);
				}
			});




			/*logourl = "http://i.imgur.com/5KLEbYz.png";
			$.ajax({ //Halloween
				url: "http://pastebin.com/raw/URtcbjQU",
				success: function(data) {
					console.log("Wooooo!");
					themedata[1] = {
						style: data,
						logourl: logourl,
						script: ""
					}; 
				}
			});	
					
			var logourl2 = "http://i.imgur.com/3ppDqzs.png";
			$.ajax({ //Christmas
				url: "http://pastebin.com/raw/3hAJ1Atb",
				success: function(data) {
					console.log("Wooooo222!");
					
					themedata[2] = {
						style: data,
						logourl: logourl2
					}; //Christmas
					
					updatedThemes = true;
				}
			});	*/
		}
	}
}


function saveIconPath(path) {
    iconPath = path;
    if (path === "img/Core/") {
        chrome.browserAction.setBadgeBackgroundColor({"color":"#E20000"});
    } else {
        chrome.browserAction.setBadgeBackgroundColor({"color":"#0058d3"});
    }

    chrome.browserAction.setIcon({
        path: path + "icon32.png",
    });

    chrome.storage.sync.set({
        iconPath: path,
    });
}

function saveSecretKeys() {
	var string = "";
	for (var i in secretOptions) {
		var string = string + "," + secretOptions[i];
	}
	chrome.storage.sync.set({
		secretKeys: string.substring(1),
	});
}
setInterval(checkEverything, 15 * 1000);
setTimeout(checkEverything, 1000); // Check once Chrome is first launched

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	if (request.pkthemeno) {
		var sent = false;
		for (var i in secretOptions) {
			var key = secretOptions[i];
		    		
			if (key.startsWith("360660962")) {
				sendResponse({pkthemeno: key.split("_")[1]});
		    	sent = true;
		    	break;
		    }
		}
		    	
		if (!sent) {
		    sendResponse({pkthemeno: -1});
		}
	} else if (request.pkthemedata) {
		sendResponse(themedata[request.pkthemedata]);
	} else if (request.pksecretkeys) {
		sendResponse(secretOptions);
	} else if (request.customnewtheme) {
		sendResponse(customNewTheme ? customNewThemeData : "");
		console.log("resonding");
	}
});

function getCustomThemeData() {
	$.ajax({ //PK Green
		url: "http://pastebin.com/raw/qaFduwnu",
		success: function(data) {
			chrome.extension.getBackgroundPage().customNewThemeData = data
		}
	});	
}

chrome.storage.sync.get('iconPath', function(result) {
    setTimeout(function() {
        saveIconPath(result.iconPath);
    }, 500);

     setTimeout(function() {
        saveIconPath(result.iconPath);
    }, 5000);
});

chrome.storage.sync.get('background', function(result) {
    setTimeout(function() {
        background = result.background;
    }, 500);
});

chrome.storage.sync.get('customNewTheme', function(result) {
    setTimeout(function() {
        customNewTheme = result.customNewTheme;
    }, 500);
    
    chrome.extension.getBackgroundPage().getCustomThemeData();
});

chrome.storage.sync.get('secretKeys', function(result) {
	 setTimeout(function() {
		 secretOptions = result.secretKeys.split(",");
		 
		 for (var i in secretOptions) {
			 if (secretOptions[i].startsWith("360660962")) {
				 getThemeData();
				 setInterval(getThemeData, 30 * 60 * 1000);
			 }
		 }
	 }, 500);
});

loaded = true;


