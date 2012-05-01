var episodeList, loadEpisode, ls, refreshBadge, setPicture;

ls = localStorage;

episodeList = ls.episodeList != null ? JSON.parse(ls.episodeList) : [];

ls.episodeList = JSON.stringify(episodeList);

refreshBadge = function() {
  var badgeText;
  episodeList = ls.episodeList != null ? JSON.parse(ls.episodeList) : [];
  badgeText = episodeList.length !== 0 ? '' + episodeList.length : '';
  chrome.browserAction.setBadgeText({
    text: badgeText
  });
  if (episodeList.length === 0) {
    $('.container').html("<div class='episode'><div class='title'>目前沒有漫畫更新</div><span class='label label-warning'>SFACG</span> <span class='label label-success'>99770</span></div>");
    $('.label-warning').click(function() {
      return chrome.tabs.create({
        url: 'http://comic.sfacg.com/'
      });
    });
    return $('.label-success').click(function() {
      return chrome.tabs.create({
        url: 'http://99770.cc/'
      });
    });
  } else {
    $('.container').html('');
    return loadEpisode();
  }
};

loadEpisode = function() {
  var epi, i, _len, _results;
  _results = [];
  for (i = 0, _len = episodeList.length; i < _len; i++) {
    epi = episodeList[i];
    $('.container').append("<div class='episode'><div class='title'>" + epi.title + "</div><img src='image/arrow_gray.png' id='go" + i + "'></div></div>");
    _results.push(setPicture(i, epi.url));
  }
  return _results;
};

setPicture = function(i, targetURL) {
  var target_id,
    _this = this;
  target_id = "#go" + i;
  $(target_id).attr('src', 'image/arrow.png');
  return $(target_id).click(function() {
    var epi, newEpisodeList, _i, _len;
    chrome.tabs.create({
      url: targetURL
    });
    $(target_id).parent().remove();
    newEpisodeList = [];
    for (_i = 0, _len = episodeList.length; _i < _len; _i++) {
      epi = episodeList[_i];
      if (epi.url !== targetURL) newEpisodeList.push(epi);
    }
    ls.episodeList = JSON.stringify(newEpisodeList);
    return refreshBadge();
  });
};

$(document).ready(function() {
  return refreshBadge();
});
