var id = 'PKNotifier';

var alerts = 0;
var messages = 0;

var a = -1;
var m = -1;

function update() {

	//Archived code. New system uses badges!
    /*var s = "You have no new alerts or messages."

    var alertsURL = "http://projectkorra.com/account/alerts";
    var msgURL = "http://projectkorra.com/conversations/"

    if (alerts > 0 && messages > 0) {
        s = 'You have <a href="' + alertsURL + '">' + alerts + ' new alert' + (alerts == 1 ? '' : 's') + '</a> and <a href="' + msgURL + '">' + messages + ' new message' + (messages == 1 ? '' : 's') + '</a>!'
    }
    else if (alerts > 0) {
        s = 'You have <a href="' + alertsURL + '">' + alerts + ' new alert' + (alerts == 1 ? '' : 's') + '</a>!'
    }
    else if (messages > 0) {
        s = 'You have <a href="' + msgURL + '">' + messages + ' new message' + (messages == 1 ? '' : 's') + '</a>!'
    }

    $('#content').html(s);*/
	
	$("#alertsCount").text((alerts <= 0 ? "" : alerts) + "");
	$("#messageCount").text((messages <= 0 ? "" : messages) + "");
}

$(document).ready(function() {

	$("#version").text("Version " + chrome.app.getDetails().version);
    
    $("#settings").click(function() {
    	chrome.runtime.openOptionsPage()
    });
	
    chrome.storage.local.get('alerts', function(result) {
        alerts = parseInt(result.alerts);
        a = result.alerts;
        a = result;
        update();
    });

    chrome.storage.local.get('messages', function(response) {
        messages = parseInt(response.messages);
        m = response.messages;
        update();
    });

 
    $('body').on('click', 'button', function() {
        chrome.tabs.create({
            url: $(this).attr('href')
        });
        return false;
    });

    $('body').on('click', 'a', function() {
    	if ($(this).id == "settings") return false;
        chrome.tabs.create({
            url: $(this).attr('href')
        });
        return false;
    });
});
