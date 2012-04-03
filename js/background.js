﻿function render(tab) {
	if (correctDomain(tab.url)) {
		$.get(tab.url, function(data) {
			if (data.search('PicListUrl') != -1) {
				chrome.tabs.update(tab.id, {
					'url' : 'result.html?url=' + tab.url
				});
			}
		});
	}
}

function correctDomain(targetUrl) {
	var flagBasic = false;
	var flagDomain = false;

	if (targetUrl != '' && targetUrl.search('result.html') == -1) {
		flagBasic = true;
	}

	var domainList = ["http://1mh.com/", "http://99mh.com/", "http://dm.99manga.com/", "http://mh.99770.cc/", "http://www.99comic.com/", "http://www.cococomic.com/",
			"http://www.99mh.com/", "http://www.99manga.com/"];

	for ( var i = 0; i < domainList.length; i++) {
		flagDomain = flagDomain || targetUrl.search(domainList[i]) != -1;
	}

	return flagBasic && flagDomain;
}

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
	render(tab);

});

//var hey = 1;
function checkNewest() {
	$.get("http://mh.99770.cc/comicupdate/", function(data) {
		rx = /href="(\S*)" target="_blank" class="lkgn">(.*)<\/a><font color=red><b>(\S*)<\/b><\/font>(\S*)<span/g;
		m = rx.exec(data);
		newestLine = m[2] + ' ' + m[3] + ' ' + m[4];
		lineList = data.match(rx);

	
		//if(hey == 1){ localStorage.newest = "东京ESP 24 集(卷)"; hey += 1; }
		

		var episodeList = localStorage.episodeList ? JSON.parse(localStorage.episodeList) : [];
		if (newestLine != localStorage.newest) {
			var updateEpisode = [];
			for ( var i = 0; i < lineList.length; i++) {
				rx = /href="(\S*)" target="_blank" class="lkgn">(.*)<\/a><font color=red><b>(\S*)<\/b><\/font>(\S*)<span/;
				m = rx.exec(lineList[i]);
				thisLine = m[2] + ' ' + m[3] + ' ' + m[4];
				comicTitle = m[2];
				targetPage = m[1];
				console.log(comicTitle, targetPage);

				// it's cool below
				if (thisLine == localStorage.newest) {
					break;
				}

				// continue if it's not in subscription
				if (!in_array(comicTitle, JSON.parse(localStorage.subs))) {
					console.log("not my favorite: " + comicTitle);
					continue;
				} else {
					console.log("update: " + comicTitle);
				}

				updateEpisode.push(thisLine);
				episodeList.push({
					title : thisLine,
					url : targetPage
				});
			}
			// if there is a possibly change
			if (localStorage.isNotified === "需要" || !localStorage.isNotified) {
				if (updateEpisode.length > 0) {
					makeNotification(updateEpisode);
				}
			}
			localStorage.newest = newestLine;
			localStorage.episodeList = JSON.stringify(episodeList);
			if (episodeList.length === 0) {
				chrome.browserAction.setBadgeText({
					text : ''
				});
			} else {
				chrome.browserAction.setBadgeText({
					text : '' + episodeList.length
				});
			}
		} else {
			console.log(localStorage.newest + ' | ' + new Date());
		}
	});
}

function makeNotification(episodes) {
	var notification = window.webkitNotifications.createNotification('icon48.png', // The
																					// image.
	'鄉民之眼', // The title.
	'共有' + episodes.length + '則漫畫更新' // The body.
	);

	notification.show();
	setTimeout(function() {
		notification.cancel();
	}, 10000);
}

// checkNewest interval
checkNewest();
setTimeout(function() {
	setLoop();
}, (localStorage.frequency ? localStorage.frequency : 10) * 60000);

function setLoop() {
	checkNewest();
	setTimeout(function() {
		setLoop();
	}, (localStorage.frequency ? localStorage.frequency : 10) * 60000);
}

function in_array(stringToSearch, arrayToSearch) {
	for (s = 0; s < arrayToSearch.length; s++) {
		thisEntry = arrayToSearch[s].toString();
		if (thisEntry == stringToSearch) {
			return true;
		}
	}
	return false;
}