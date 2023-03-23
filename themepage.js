function setTheme(number) {
	for (var i in chrome.extension.getBackgroundPage().secretOptions) {
		var key = chrome.extension.getBackgroundPage().secretOptions[i];
		
		if (key.startsWith("360660962")) {
			chrome.extension.getBackgroundPage().secretOptions[i] = "360660962_" + number;
			
			chrome.extension.getBackgroundPage().saveSecretKeys();
			break;
		}
		
	}
}

var ee = null;
function bold(id) {
	for (var i = 0; i < document.getElementsByClassName("label").length; i++) {
		var element = document.getElementsByClassName("label")[i];
		element.removeAttribute("style");
	}
	document.getElementById(id).parentElement.setAttribute("style", "font-weight: bold;");
}

function theme0() {
	setTheme(0);
	bold("original");
}

function theme1() {
	setTheme(1);
	bold("halloween");
}

function theme2() {
	setTheme(2);
	bold("christmas");
}

function update() {
	chrome.extension.getBackgroundPage().getThemeData();
	
	document.getElementById("update").setAttribute("disabled", "");
	document.getElementById("update").innerHTML = "<strong>Updating...</strong>";
	
	checkUpdate();
}

var checkTimes = 0;

function checkUpdate() {
	setTimeout(function() {
		if (chrome.extension.getBackgroundPage().updatedThemes) {
			document.getElementById("update").innerHTML = "<strong>Updated.</strong>";
			checkTimes = 0;
			setTimeout(function() {
				document.getElementById("update").removeAttribute("disabled");
				document.getElementById("update").innerHTML = "<strong>Force Update</strong>";
			}, 2000);
		} else {
			if (checkTimes > 55) { //Updated failed after 10s.
				document.getElementById("update").innerHTML = "<strong>Update failed.</strong>";
				checkTimes = 0;
				setTimeout(function() {
					document.getElementById("update").removeAttribute("disabled");
					document.getElementById("update").innerHTML = "<strong>Force Update</strong>";
				}, 2000);
			} else {
				checkUpdate();
				checkTimes++;
			}
		}
	}, 400);
}

setTimeout(function() {
	document.getElementById("original").addEventListener('change', theme0);
	document.getElementById("halloween").addEventListener('change', theme1);
	document.getElementById("christmas").addEventListener('change', theme2);
	document.getElementById("update").addEventListener('click', update); //options.html
	document.getElementById("back").addEventListener('click', function() {document.location = "options.html";});
	
	
	for (var i in chrome.extension.getBackgroundPage().secretOptions) {
		var key = chrome.extension.getBackgroundPage().secretOptions[i];

		if (key.startsWith("360660962")) {
			var number = key.split("_")[1];
			
			if (number == 1) {
				document.getElementById("halloween").checked = true;
				theme1();
			} else if (number == 2) {
				document.getElementById("christmas").checked = true;
				theme2();
			}
		}
	}

}, 200);