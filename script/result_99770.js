var targetURL;
var serverID;
var picURLs;
var completePicNum;
var serverList = new Array(12);
var comicListID;
var comicID;
var comicTitle;
var menuURL;
var currentEpi;
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

function findPicURLs(data) {
	// set title
	rx = /<title>(.*)( \d{4}).*<\/title>/;
	m = rx.exec(data);
	$("title").text(m[1]);

	// set picURLs
	rx = /PicListUrl = "(.*)";/;
	m = rx.exec(data);
	picURLs = m[1].split('|');

	// set comicID
	rx = /var ComicID=(\d*);/;
	comicID = rx.exec(data)[1];

	// set total
	$("#total").text(picURLs.length);

	// set menuURL
	try{
		rx = /当前漫画：<a href=(.*)>(.*)<\/a>图片出错请/;
		menuURL = "http://99770.cc" + rx.exec(data)[1];
		$("#menu").attr("src", "image/menu.png");
	}catch(TypeError){
		
	}
	currentEpi = rx.exec(data)[2];
	$.get(menuURL, function(data) {
		temp = data.split(currentEpi);
		half = ["", ""];
		var j=0;
		for(var i=0; i<temp.length, j<2; i++){
			if(temp[i].length > 200){
				half[j] = temp[i];
				j += 1;
			}
		}
		// nextURL
		try {
			rx = /<li><a href=(\S*) target=_blank/g;
			m = half[0].match(rx);
			rx = /<li><a href=(\S*) target=_blank/;
			nextURL = "http://99770.cc" + rx.exec(m[m.length - 2])[1];
			$("#next").attr("src", "image/next.png");
		} catch (TypeError) {
			nextURL = null;
		}

		// prevURL
		try {
			rx = /<li><a href=(\S*) target=_blank/;
			prevURL = "http://99770.cc" + rx.exec(half[1])[1];
			$("#prev").attr("src", "image/prev.png");
		} catch (TypeError) {
			prevURL = null;
		}
	});
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

	// Initialize serverList
	serverList = new Array(12)
	serverList[0] = "http://58.215.241.39:99/dm01";
	serverList[1] = "http://61.164.109.141:99/dm02";
	serverList[2] = "http://58.215.241.39:99/dm03";
	serverList[3] = "http://61.164.109.141:99/dm04";
	serverList[4] = "http://61.164.109.162:99/dm05";
	serverList[5] = "http://61.164.109.162:99/dm06";
	serverList[6] = "http://61.164.109.162:99/dm07";
	serverList[7] = "http://58.215.241.39:99/dm08";
	serverList[8] = "http://61.164.109.162:99/dm09";
	serverList[9] = "http://58.215.241.39:99/dm10";
	serverList[10] = "http://61.164.109.141:99/dm11";
	serverList[11] = "http://58.215.241.39:99/dm12";

	// Increase counter
	$.get("http://eyeofxiangmin.appspot.com/add");
}

function loadPics() {
	for ( var i = 0; i < picURLs.length; i++) {
		$(".container").append('<div class="page"><img class="pagecontent" src="' + serverList[serverID - 1] + picURLs[i] + '"></div>');
	}
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

	$("#subscribe").click(function() {
		subsList = localStorage.subsList99770 ? JSON.parse(localStorage.subsList99770) : [];

    if ($("#subscribe").attr("src") !== "image/sub.png") {
      if (!in_array([comicTitle, menuURL.toLowerCase()].toString(), subsList)) {
        subsList.push([comicTitle, menuURL.toLowerCase()]);
      }

      localStorage.subsList99770 = JSON.stringify(subsList);
      subsNotification(comicTitle, true);
      $("#subscribe").attr("src", "image/sub.png");
    } else {
      for ( var i = 0; i < subsList.length; i++) {
				if (subsList[i][1].toString() === menuURL.toLowerCase()) {
					var a = subsList.slice(0, i);
					var b = subsList.slice(i + 1, subsList.length);
					localStorage.subsList99770 = JSON.stringify(a.concat(b));
					break;
				}
			}

			subsNotification(comicTitle, false);
			$("#subscribe").attr("src", "image/sub_gray.png");
    }
    checkState();
	});

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

function checkState() {
	$.get("http://99770.cc/comic/" + comicID + "/", function(data) {
		rx = /首页<\/a> >> (.*) 集数/;
		comicTitle = rx.exec(data)[1];

		// Check button color
		if (localStorage.subsList99770) {
			subsList = JSON.parse(localStorage.subsList99770);
			if (in_array([comicTitle, menuURL.toLowerCase()].toString(), subsList)) {
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

$(document).ready(function() {
	initialize();
	$.get(targetURL, function(data) {
		findPicURLs(data);
		loadPics();
		bindHandlers();
		checkState();
	});
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
