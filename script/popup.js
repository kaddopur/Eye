var episodeList = localStorage.episodeList ? JSON.parse(localStorage.episodeList) : [];

var loadEpisode = function() {
	for ( var i = 0; i < episodeList.length; i++) {
		$('.container').append('<div class="episode"><div class="title">' + episodeList[i].title + '</div><img src="image/arrow_gray.png" id="go' + i + '"></div></div>');
		setPicture(i, episodeList[i].url);
	}
};

var setPicture = function(i, targetURL) {
  var target_id = '#go' + i;

  $(target_id).attr('src', 'image/arrow.png');
  $(target_id).click(function() {
    chrome.tabs.create({
      'url' : targetURL
    });
    
    // refresh episode list
    var a = episodeList.slice(0, i);
    var b = episodeList.slice(i + 1, episodeList.length);
    localStorage.episodeList = JSON.stringify(a.concat(b));
    episodeList = JSON.parse(localStorage.episodeList);

    // refresh badge
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
};

$(document).ready(function() {
	if (episodeList.length === 0) {
		chrome.browserAction.setBadgeText({
			text : ''
		});
		$('.container').html('<div class="episode"><div class="title">目前沒有漫畫更新</div><img src="image/noepi.png" id="noepi"></div></div>');
		$('#noepi').click(function(){
			chrome.tabs.create({
				'url' : "http://comic.sfacg.com/"
			});
		});
	} else {
		chrome.browserAction.setBadgeText({
			text : '' + episodeList.length
		});
		loadEpisode();
	}
});
