﻿var targetURL;
var picURLs;
var completePicNum;
var menuURL;
var prevURL;
var nextURL;

function getQueryString(paramName) {
	paramName = paramName.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]").toLowerCase();
	var reg = "[\\?&]" + paramName + "=([^&#]*)";
	var regex = new RegExp(reg);
	var regResults = regex.exec(window.location.href.toLowerCase());
	if (regResults == null)
		return "";
	else
		return regResults[1];
}

function initialize() {
	// Initialize variable
	targetURL = getQueryString('url');
  
	serverID = targetURL.slice(targetURL.search('s=') + 2);
	picURLs = "";
	completePicNum = 0;
	comicListID = 0;
	comicID = 0;
	comicTitle = "";
	menuURL = "";
	currentEpi = "";
	prevURL = "";
	nextURL = "";

	// Increase counter
	$.get("http://eyeofxiangmin.appspot.com/add");
}

function loadPics() {
  var jsString = targetURL.replace(/allcomic/, 'Utility').replace(/\/$/, '.js');
  
  $.get(jsString, function(data){
    eval(data);
    picURLs = picAy;
    
    console.log(data);
    
    // load pics
    for ( var i = 0; i < picURLs.length; i++) {
      $(".container").append('<div class="page"><img class="pagecontent" src="' + picURLs[i] + '"></div>');
    }
    
    // set up progress bar
    $("#total").text(picURLs.length);
    
    // set next button
    nextURL = nextVolume;
    if(nextURL.search(/javascript/) == -1 && nextURL.indexOf('#') == -1){
      $("#next").attr("src", "image/next.png");
    } else {
      nextURL = null;
    }
    
    // set prev button
    prevURL = preVolume;
    if(prevURL.search(/javascript/) == -1 && prevURL.indexOf('#') == -1){
      $("#prev").attr("src", "image/prev.png");
    } else {
      prevURL = null;
    }
    
    bindHandlers();
  });	
}

function bindHandlers() {
	$("img.pagecontent").load(function() {
		completePicNum += 1;
		$("#progressbar").progressbar({
			value : completePicNum / picURLs.length * 100
		});
		$("#ok").text(completePicNum);
	});

	$("#progressbar").progressbar({
		complete : function(event, ui) {
			$("#progressbar").css('opacity', 0);
			$("#indicator").css('opacity', 0);
		}
	});
  
  
  /*
	$("#subscribe").click(function() {
		subsList = localStorage.subs ? JSON.parse(localStorage.subs) : [];

		if (!in_array(comicTitle, subsList)) {
			subsList.push(comicTitle);
		}

		localStorage.subs = JSON.stringify(subsList);
		subsNotification(comicTitle, true);
		$("#subscribe").attr("src", "image/sub.png");
	});

	$("#unsubscribe").click(function() {
		if ($("#subscribe").attr("src") == "image/sub.png") {
			subsList = JSON.parse(localStorage.subs);
			for ( var i = 0; i < subsList.length; i++) {
				if (subsList[i] == comicTitle) {
					var a = subsList.slice(0, i);
					var b = subsList.slice(i + 1, subsList.length);
					localStorage.subs = JSON.stringify(a.concat(b));
					break;
				}
			}

			subsNotification(comicTitle, false);
			$("#subscribe").attr("src", "image/sub_gray.png");
		}
	});
  */
  
	$("#prev").click(function() {
		if (prevURL) {
			chrome.tabs.getCurrent(function(tab) {
				chrome.tabs.update(tab.id, {
					'url' : prevURL
				});
			});
		}
	});

	$("#menu").click(function() {
		chrome.tabs.getCurrent(function(tab) {
			chrome.tabs.update(tab.id, {
				'url' : menuURL
			});
		});
	});

	$("#next").click(function() {
		if (nextURL) {
			chrome.tabs.getCurrent(function(tab) {
				chrome.tabs.update(tab.id, {
					'url' : nextURL
				});
			});
		}
	});
  
}
/*
function checkState() {
	$.get("http://99770.cc/comic/" + comicID + "/", function(data) {
		rx = /首页<\/a> >> (.*) 集数/;
		comicTitle = rx.exec(data)[1];

		// Check button color
		if (localStorage.subs) {
			subsList = JSON.parse(localStorage.subs);
			if (in_array(comicTitle, subsList)) {
				$("#subscribe").attr("src", "image/sub.png");
			} else {
				$("#subscribe").attr("src", "image/sub_gray.png");
			}
		}
	});
}

function subsNotification(tag, isSub) {
	if (isSub) {
		var notification = window.webkitNotifications.createNotification('icon48.png', // The
		// image.
		tag, // The title.
		'訂閱成功' // The body.
		);
	} else {
		var notification = window.webkitNotifications.createNotification('icon48.png', // The
		// image.
		tag, // The title.
		'已取消訂閱' // The body.
		);
	}

	notification.onclick = function() {
		this.cancel();
	};
	notification.show();
	setTimeout(function() {
		notification.cancel();
	}, 3000);
}
*/

$(document).ready(function() {
	initialize();
	$.get(targetURL, function(data) {
		// set title
    rx = /var lName = encodeURIComponent\('(\S*)'\);/;
    m = rx.exec(data);
    $("title").text(m[1]);
    
    // set menu button
    rx = /"([^"]*HTML[^"]*)"/;
    m = rx.exec(data);
    menuURL = m[1];
    $("#menu").attr("src", "image/menu.png");
	});
  loadPics();
});

function in_array(stringToSearch, arrayToSearch) {
	for (s = 0; s < arrayToSearch.length; s++) {
		thisEntry = arrayToSearch[s].toString();
		if (thisEntry == stringToSearch) {
			return true;
		}
	}
	return false;
}
