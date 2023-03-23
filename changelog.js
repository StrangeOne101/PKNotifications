setTimeout(function() {
	if (window.location.href.indexOf("#options") > -1) {
		document.getElementById("buttontopdiv").innerHTML = '<button type="button" id="back_top"><a href="options.html"><strong>Back</strong></a></button>';
		document.getElementById("backa").innerHTML = "<strong>Back</strong>";
		document.getElementById("backa").href = "options.html";
	} else {
		document.getElementById("backa").addEventListener('click', function() {window.close()});
	}
}, 20);