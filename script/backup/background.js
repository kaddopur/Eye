chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  render(tab);
});

chrome.management.onInstalled.addListener(function(info) {
  localStorage.clear();
});

function render(tab){
  var host = $.url(tab.url).attr('host');
  var path = $.url(tab.url).attr('path');
  
  if(host === '99770.cc' || host === 'www.99770.cc'){ // 舊版
    $.get(tab.url, function(data) {
			if (data.search('PicListUrl') != -1) {
				chrome.tabs.update(tab.id, {
					'url' : 'result.html?url=' + tab.url
				});
			}
		});
  } else if(host === 'mh.99770.cc'){
    console.log('新版');
  } else if(host.search(/sfacg.com/) != -1 && path.search(/AllComic/) != -1){
    chrome.tabs.update(tab.id, {
      'url' : 'result_sfacg.html?url=' + tab.url
    });
  } else if(host === 'www.8comic.com'){
    console.log('8comic');
  }
}

function checkNewest() {
  $.get("http://comic.sfacg.com/", function(data){
    var rx = /<div id="TopList_1">([\w\W]*)<div id="TopList_2"/m;
    var m = rx.exec(data);
    var updateRaw = m[1];
    
    rx = /<td height="30" align="center" bgcolor="#FFFFFF"><a href="\/HTML.*<\/a><\/td>/g;
    updateList = updateRaw.match(rx);
    
    rx = /<a href="(\S*)".*>(.*)<\/a/;
    m = rx.exec(updateList[0]);
    var newLine = [m[2], "http://comic.sfacg.com" + m[1]];
    
    var newest = localStorage.newest? JSON.parse(localStorage.newest): [];
    var episodeList = localStorage.episodeList? JSON.parse(localStorage.episodeList) : [];
    var subsList = localStorage.subsListSFACG? JSON.parse(localStorage.subsListSFACG) : [];
    var updateEpisode = [];
    
    if(newLine !== newest){
      for(i=0; i<updateList.length; i++){
        rx = /<a href="(\S*)".*>(.*)<\/a/;
        m = rx.exec(updateList[i]);
        var thisLine = [m[2], "http://comic.sfacg.com" + m[1]];
        
        
        // update is done! 
        if (thisLine.toString() === newest.toString()) {
          break;
				}
        
        // continue if thisLine is not in subsList
        console.log('this: '+ thisLine.toString());
        if(!in_array(thisLine.toString(), subsList)){
          continue;
        }
        
        console.log('ready to push' + thisLine);
        updateEpisode.push(thisLine);
        episodeList.push({
					title : thisLine[0],
					url : thisLine[1]
				});
      }
      localStorage.newest = JSON.stringify(newLine);
      localStorage.episodeList = JSON.stringify(episodeList);
    }
    
    // if there is a possibly change
    if (localStorage.isNotified === "需要" || !localStorage.isNotified) {
      if (updateEpisode.length > 0) {
        makeNotification(updateEpisode);
      }
    }
    if (episodeList.length === 0) {
				chrome.browserAction.setBadgeText({
					text : ''
				});
    } else {
      chrome.browserAction.setBadgeText({
        text : '' + episodeList.length
      });
    }
    
    
    
  });
}
/*
	$.get("http://99770.cc/comicupdate/", function(data) {
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
*/
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
