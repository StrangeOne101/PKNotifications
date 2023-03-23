function save() {
	if (document.getElementById("save").innerHTML == "Exit") {
		exit();
		return;
	}

	var path = "img/Korra/";
	if (document.getElementById("core").checked) { //Korra icon selected
		path = "img/Core/";
	} 

	chrome.extension.getBackgroundPage().saveIconPath(path);

	document.getElementById("save").innerHTML = "Exit";
	setTimeout(function() {
		chrome.extension.getBackgroundPage().makeNotification("Settings Updated!", "Your settings have been saved!");
	}, 500);
}

function exit() {
	window.close();
}

function update() {
	document.getElementById("save").innerHTML = "Save!";
}

setTimeout(function() {
	document.getElementById("save").addEventListener('click', save);
	document.getElementById("toggleBackground").addEventListener('click', toggleBG);
	document.getElementById("toggleCustomTheme").addEventListener('click', toggleCustomTheme);
	document.getElementById("korra").addEventListener('change', update);
	document.getElementById("core").addEventListener('change', update);
	document.getElementById("expandCode").addEventListener('click', expandCode);
}, 500);

setTimeout(function() {
	chrome.storage.sync.get("iconPath", function(result) {
		if (result.iconPath == "img/Core/") {
			document.getElementById("core").checked = true;
		}
	});
	
	chrome.storage.sync.get("background", function(result) {
		if (result.background == false) {
			document.getElementById("toggleBackground").value = "NO";
		}
	});
	
	chrome.storage.sync.get("customNewTheme", function(result) {
		if (result.customNewTheme == true) {
			//document.getElementById("toggleCustomTheme").value = "YES";
		}
	});
	
	updateSecretKeys();
}, 50);


function updateSecretKeys() {
	var secretKeys = "";
	for (var i in chrome.extension.getBackgroundPage().secretOptions) {
		var key = chrome.extension.getBackgroundPage().secretOptions[i];
		
		
		
		if (key.startsWith("360660962")) {
			//secretKeys = secretKeys + "<li><a href='themes.html'>Theme Manager</a></li>";
			//Disabled due to forums being updated and all themes breaking
		}
		
		if (key == "816653305") {
			secretKeys = secretKeys + "<li>No ads</li>";
		} else if (key == "830836045") {
			secretKeys = secretKeys + "<li>Anti-Spam</li>";

			document.getElementById("openModMenu").style = ""; //Make it visible
		}
	}
	
	if (secretKeys != "") {
		document.getElementById("secretsettings").innerHTML = secretKeys;
	}
}

function toggleBG() {
	var e = document.getElementById("toggleBackground");
	if (e.value == "YES") {
		e.value = "NO";
			
		chrome.extension.getBackgroundPage().background = false;
		chrome.storage.sync.set({
		      	background: false,
		});
	} else {
		e.value = "YES";
			
		chrome.extension.getBackgroundPage().background = true;
		chrome.storage.sync.set({
			background: true,
		});
	}
}

function toggleCustomTheme() {
	var e = document.getElementById("toggleCustomTheme");
	if (e.value == "YES") {
		e.value = "NO";
			
		chrome.extension.getBackgroundPage().customNewTheme = false;
		chrome.storage.sync.set({
			customNewTheme: false,
		});
	} else {
		e.value = "YES";
			
		chrome.extension.getBackgroundPage().customNewTheme = true;
		chrome.storage.sync.set({
			customNewTheme: true,
		});

		chrome.extension.getBackgroundPage().getCustomThemeData();
	}
}

function enterKey() {
	var key = document.getElementById("keycode").value;
	if (key != "") {
		var text = "Invalid code."
		if (chrome.extension.getBackgroundPage().addSecretKey(key.trim())) {
			text = "Code added successfully.";
			updateSecretKeys();
		}
		document.getElementById("hiddencodebox").innerHTML = text;
		
		setTimeout(expandCode, 3000);
	}
}

function expandCode() {
	document.getElementById("hiddencodebox").innerHTML = '<input type="text" id="keycode"><input id="enterKey" type="button" value="Enter">';
	document.getElementById("enterKey").addEventListener('click', enterKey);
}
