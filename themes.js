function addStyleToPage() {
	
	chrome.runtime.sendMessage({pkthemeno: "hi"}, function(response) {
		//console.log(response);
		var number = response.pkthemeno;
		var disabled = true;

		var themes = [{style: "", script: ""}];
		themes.push({

		})

		/*if (number != -1 && number != 0 && !disabled) {
			console.log("PKNotificatons: Adding custom theme (No. " + number + ")...");
			chrome.runtime.sendMessage({pkthemedata: number}, function(result) {
				if (result.style != "") {
					var style = document.createElement("style");
					document.head.appendChild(style);
					style.innerHTML = result.style;
				} else {
					console.log("Blank style...?");
				}
						
				if (result.logourl != "" ) {
					$("#logo").children("a").children("img").attr('src', result.logourl);
				} else {
					console.log("No logo...?");
				}
			});		
		}*/
	});
	
	/*chrome.runtime.sendMessage({customnewtheme: "hi"}, function(response) {
			if (response != "") {
				console.log("Adding new custom theme...")
				var style = document.createElement("style");
				document.head.appendChild(style);
				style.innerHTML = response;
			} 
	});*/
	
}

function addStyle(url_) {
	$.ajax({
		url: url_,
		success: function(data) {
			if (data != "") {
				console.log("Adding custom theme...4")
				var style = document.createElement("style");
				document.head.appendChild(style);
				style.innerHTML = result.style;
			} else {
				console.log("Blank style...?");
			}
		}
	});
}


setTimeout(function() {
	if (document.location.hostname == "projectkorra.com") {
		//addStyleToPage(); //Disabled themeing
		
		if (new Date().getDate() == 1 && new Date().getMonth() == 3) {
			console.log("April fools!");
			
			 $("li[data-author='" + $("strong.accountUsername").text() + "'").each(function() {
				 var element = $(this).children("div.messageUserInfo").children("div.messageUserBlock").children("h3.userText");
				 $(element.children("em").get(1)).attr('style', "background-color: #FF0000; color: #FFFFFF");
				 $(element.children("em").get(1)).children("strong").text("Banned Member");
			 });
			 
			 $("a.username").each(function() {
				 if ($(this).children("span").text() == "StrangeOne101") {
					 $(this).children("span").attr("style", "color: #FF0000");
				 }
			 });
			 
			 $("h1.username").each(function() {
				 if ($(this).children("span").text() == "StrangeOne101") {
					 
					 $(this).children("span").attr("style", "color: #FF0000");
					 $(this).parent().children("p.userBlurb").children("span.userTitle").text("Administrator");
					 $($(this).parent().children("div.userBanners").children("em").get(1)).attr("style", "background-color: #FF0000; color: #FFFFFF");
					 $($(this).parent().children("div.userBanners").children("em").get(1)).children("strong").text("Administrator");
				 }
			 });
			 
			 $("h4.userTitle").each(function() {
				 if ($(this).parent().parent().children("h3.username").children("a.username").text() == "StrangeOne101") {
					 $(this).text("Administrator");
				 }
			 });
			
			 $("li[data-author='StrangeOne101']").each(function() {
				 var element = $(this).children("div.messageUserInfo").children("div.messageUserBlock").children("h3.userText");
	       	
				 $(element.children("a.username").children("span")[0]).removeClass("style5");
				 $(element.children("a.username").children("span")[0]).addClass("style3");
				 $(element.children("em").get(1)).removeClass("bannerSkyBlue");
				 $(element.children("em").get(1)).addClass("bannerRed");
				 $(element.children("em").get(1)).children("strong").text("Administrator");
			 });
	       
			 setInterval(function() {
				 $("a.username").each(function() {
					 if ($(this).children("span").text() == "StrangeOne101") {
						 $(this).children("span").attr("style", "color: #FF0000");
					 }
				 });
	       	
				 $("h4.userTitle").each(function() {
					 if ($(this).parent().parent().children("h3.username").children("a.username").text() == "StrangeOne101") {
						 $(this).text("Administrator");
					 }
				 });
				 
				 $("div.userTitle").each(function() {
					 if ($(this).parent().children("a.username").children("span").text() == "StrangeOne101") {
						 $(this).text("Administrator");
					 }
				 });
			 }, 500);
		}
	}
}, 50);

/*setTimeout(function() {
	if (document.location.hostname == "projectkorra.com") {
		chrome.runtime.sendMessage({pksecretkeys: "hi"}, function(response) {
			console.log(response);
			if (response.indexOf("816653305") > -1) {
				console.log("PKNotificatons: Blocking ads.");
				
				/*$("iframe").each(function() {
			        if ($(this)[0].id.startsWith("aswift_")) {
			            $(this).attr("style", "display: none");
			            $(this).parent().parent().attr("style", "display: block, height: 0px")
			            $(this).parent().attr("style", "display: block, height: 0px")
			            $(this).attr("height", "0px");
			            $(this).parent().parent().parent().attr("style", "display: block; height: 1px")
			        }
			        
			    });*/ //Old ad blocker no longer works
               /* $(".adsbygoogle").attr("style", "display: none; height: 0px;");
			}
		});
	}
	
	//var supportBanner = '<span style="float: right; position: relative; display: block; padding: 8px 18px 10px 10px; font-style: italic;" class="crumb">Thanks for using PK Notifications!</span>';
	
	//$("nav").children("fieldset").children("span.crumbs").append(supportBanner); //No longer works
}, 3000);*/

if (document.location.hostname == "projectkorra.com") {
	chrome.runtime.sendMessage({pksecretkeys: "hi"}, function (response) {
		console.log(response);
		if (response.indexOf("816653305") > -1) {
			console.log("PKNotificatons: Blocking ads.");

			$("html").append("<style id='pk_notifications_no_ads' type='text/css'>.adsbygoogle {display: none !important; height: 0px !important}</style>");
		}
	});


}

$(document).ready(function() {
	//Add text that says "Thanks for using PK Notifications!"
	$("div.p-sectionLinks > div.p-sectionLinks-inner > div > ul").append("<li style=\"float: right\">" +
		"<p id=\"pk_notifications_text\" style=\"font-size: 12px; margin: 6px 16px 6px 16px; font-style: italic; color: #999999;\">Thanks for using PK Notifications!</p></li>")

	//Adds the message/warning to people creating PMs
	if (document.location.pathname.startsWith("/forum/conversations/add")) {
		$(".p-body-header > .p-title").append("<h1 style='font-size: 40px; margin-bottom: -10px'>Warning: Personal Messages do not work at the moment!</h1>" +
			"<h3>The best thing to do is message via discord or write on peoples profiles. This message was brought to you by PK Notifications</h3>");
	}
});
