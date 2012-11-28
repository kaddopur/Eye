// Generated by CoffeeScript 1.4.0
var bind, loadEpisode, refreshBadge, setPicture, unreadList;

unreadList = localStorage.unreadList != null ? JSON.parse(localStorage.unreadList) : [];

localStorage.unreadList = JSON.stringify(unreadList);

refreshBadge = function() {
  var badgeText, tempHtml;
  unreadList = localStorage.unreadList != null ? JSON.parse(localStorage.unreadList) : [];
  badgeText = unreadList.length !== 0 ? '' + unreadList.length : '';
  chrome.browserAction.setBadgeText({
    text: badgeText
  });
  if (unreadList.length === 0) {
    tempHtml = "      <header>        <h1>目前沒有漫畫更新</h1>      </header>      <section>        <ul>          <li><a href='http://www.8comic.com/comic/' target='_blank'>8Comic</a>        </ul>      </section>";
    return $('.container').html(tempHtml);
  } else {
    return loadEpisode();
  }
};

loadEpisode = function() {
  var ele, i, temp8comicList, tempDm5List, _i, _j, _len, _len1;
  $('.container').html('');
  tempDm5List = (function() {
    var _i, _len, _results;
    _results = [];
    for (_i = 0, _len = unreadList.length; _i < _len; _i++) {
      ele = unreadList[_i];
      if (ele.site === 'dm5') {
        _results.push(ele);
      }
    }
    return _results;
  })();
  temp8comicList = (function() {
    var _i, _len, _results;
    _results = [];
    for (_i = 0, _len = unreadList.length; _i < _len; _i++) {
      ele = unreadList[_i];
      if (ele.site === '8comic') {
        _results.push(ele);
      }
    }
    return _results;
  })();
  console.log(tempDm5List, temp8comicList);
  if (tempDm5List.length !== 0) {
    $('.container').append("      <section id='dm5' class='column'>        <h1>dm5</h1>        <ul></ul>      </section>");
    for (i = _i = 0, _len = tempDm5List.length; _i < _len; i = ++_i) {
      ele = tempDm5List[i];
      $('#dm5 ul').append("        <li id='dm5-" + i + "'>          <span class='info'>            <span class='title'>" + ele.title + "</span>            <span class='number'>" + ele.episodeNumber + "</span>          </span>          <span class='dismiss'></span>        </li>");
      bind("#dm5-" + i, ele);
    }
  }
  if (temp8comicList.length !== 0) {
    $('.container').append("      <section id='eightComic' class='column'>        <h1>8Comic</h1>        <ul></ul>      </section>");
    for (i = _j = 0, _len1 = temp8comicList.length; _j < _len1; i = ++_j) {
      ele = temp8comicList[i];
      $('#eightComic ul').append("        <li id='eightComic-" + i + "''>          <span class='info'>            <span class='title'>" + ele.title + "</span>            <span class='number'>" + ele.episodeNumber + "</span>          </span>          <span class='dismiss'></span>        </li>");
      bind("#eightComic-" + i, ele);
    }
  }
  $('.dismiss').css('background', "url(" + (chrome.extension.getURL('img/remove.png')) + ") no-repeat center center");
  return $('.dismiss').css('background-size', "12px 12px");
};

bind = function(target, params) {
  $(target).click(function() {
    return chrome.tabs.create({
      url: params.episodeUrl
    });
  });
  return $(target).find('.dismiss').click(function() {
    var ele;
    console.log('params', params);
    unreadList = localStorage.unreadList != null ? JSON.parse(localStorage.unreadList) : [];
    unreadList = (function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = unreadList.length; _i < _len; _i++) {
        ele = unreadList[_i];
        if (ele.menuUrl !== params.menuUrl) {
          _results.push(ele);
        }
      }
      return _results;
    })();
    localStorage.unreadList = JSON.stringify(unreadList);
    $(target).remove();
    return refreshBadge();
  });
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
      if (epi.url !== targetURL) {
        newEpisodeList.push(epi);
      }
    }
    ls.episodeList = JSON.stringify(newEpisodeList);
    return refreshBadge();
  });
};

$(document).ready(function() {
  $('body').css('background', "url(" + (chrome.extension.getURL('img/texture.png')) + ") repeat, #FCFAF2");
  return refreshBadge();
});
