var checkNewest, inEpisodeList, initialize, isDebugging, ls, makeNotification, render, setLoop, updateBadge,
  __indexOf = Array.prototype.indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

/*
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  return render(tab);
});
*/

ls = localStorage;

render = function(tab) {
  var eightComic, host, new99770, old99770, path;
  host = $.url(tab.url).attr('host');
  path = $.url(tab.url).attr('path');
  old99770 = ['99770.cc', 'www.99770.cc', '99mh.com', '99comic.com', 'cococomic.com', '99manga.com'];
  new99770 = ['mh.99770.cc', 'dm.99manga.com'];
  eightComic = ['www.8comic.com'];
  if (__indexOf.call(old99770, host) >= 0) {
    return $.get(tab.url, function(data) {
      if (data.search('PicListUrl') !== -1) {
        return chrome.tabs.update(tab.id, {
          url: 'result_99770.html?url=' + tab.url
        });
      }
    });
  } else if (__indexOf.call(new99770, host) >= 0) {
    return console.log('新版');
  } else if (__indexOf.call(eightComic, host) >= 0) {
    return $.get(tab.url, function(data) {
      if (data.search('itemid') !== -1) {
        return chrome.tabs.update(tab.id, {
          url: 'result_8comic.html?url=' + tab.url
        });
      }
    });
  } else if (host.search(/sfacg.com/) !== -1 && path.search(/AllComic/) !== -1) {
    return chrome.tabs.update(tab.id, {
      url: 'result_sfacg.html?url=' + tab.url
    });
  }
};

checkNewest = function() {
  var episodeList;
  initialize();
  episodeList = JSON.parse(ls.episodeList);
  $.get('http://comic.sfacg.com/', function(data) {
    var m, newLine, newest, rx, subs, subsList, thisLine, update, updateEpisodeCount, updateList, updateRaw, _i, _j, _len, _len2;
    newest = JSON.parse(ls.newestSFACG);
    subsList = JSON.parse(ls.subsListSFACG);
    rx = /<div id="TopList_1">([\w\W]*)<div id="TopList_2"/m;
    m = rx.exec(data);
    updateRaw = m[1];
    rx = /<td height="30" align="center" bgcolor="#FFFFFF"><a href="\/HTML.*<\/a><\/td>/g;
    updateList = updateRaw.match(rx);
    rx = /<a href="(\S*)".*>(.*)<\/a/;
    m = rx.exec(updateList[0]);
    newLine = [m[2], 'http://comic.sfacg.com' + m[1]];
    if (newLine[1] !== newest[1]) {
      updateEpisodeCount = 0;
      for (_i = 0, _len = updateList.length; _i < _len; _i++) {
        update = updateList[_i];
        rx = /<a href="(\S*)".*>(.*)<\/a/;
        m = rx.exec(update);
        thisLine = [m[2], 'http://comic.sfacg.com' + m[1]];
        if (thisLine[1] === newest[1]) break;
        for (_j = 0, _len2 = subsList.length; _j < _len2; _j++) {
          subs = subsList[_j];
          if (thisLine[1] === subs[1] && !inEpisodeList(subs[1])) {
            updateEpisodeCount += 1;
            episodeList.push({
              title: thisLine[0],
              url: thisLine[1]
            });
            break;
          }
        }
      }
      ls.newestSFACG = JSON.stringify(newLine);
      ls.episodeList = JSON.stringify(episodeList);
      return updateBadge('SFACG', updateEpisodeCount);
    }
  });
  $.get('http://99770.cc/comicupdate/', function(data) {
    var m, newLine, newest, rx, subs, subsList, thisLine, update, updateEpisodeCount, updateList, _i, _j, _len, _len2;
    newest = JSON.parse(ls.newest99770);
    subsList = JSON.parse(ls.subsList99770);
    rx = /href="(\S*)" target="_blank" class="lkgn">(.*)<\/a><font color=red>/g;
    m = rx.exec(data);
    newLine = [m[2], 'http://99770.cc' + m[1]];
    updateList = data.match(rx);
    if (newLine[1] !== newest[1]) {
      updateEpisodeCount = 0;
      for (_i = 0, _len = updateList.length; _i < _len; _i++) {
        update = updateList[_i];
        rx = /href="(\S*)" target="_blank" class="lkgn">(.*)<\/a><font color=red>/g;
        m = rx.exec(update);
        thisLine = [m[2], 'http://99770.cc' + m[1]];
        if (thisLine[1] === newest[1]) break;
        for (_j = 0, _len2 = subsList.length; _j < _len2; _j++) {
          subs = subsList[_j];
          if (thisLine[1] === subs[1] && !inEpisodeList(subs[1])) {
            updateEpisodeCount += 1;
            episodeList.push({
              title: thisLine[0],
              url: thisLine[1]
            });
            break;
          }
        }
      }
      ls.newest99770 = JSON.stringify(newLine);
      ls.episodeList = JSON.stringify(episodeList);
      return updateBadge('99770', updateEpisodeCount);
    }
  });
  return $.get('http://www.8comic.com/comic/u-1.html', function(data) {
    var m, newLine, newest, rx, subs, subsList, thisLine, update, updateEpisodeCount, updateList, _i, _j, _len, _len2;
    newest = JSON.parse(ls.newest8COMIC);
    subsList = JSON.parse(ls.subsList8COMIC);
    rx = /<td height="30" nowrap> · <a href='(.*)'.*>\s*(\S*)/g;
    m = rx.exec(data);
    newLine = [m[2], 'http://www.8comic.com' + m[1]];
    updateList = data.match(rx);
    if (newLine[1] !== newest[1]) {
      updateEpisodeCount = 0;
      for (_i = 0, _len = updateList.length; _i < _len; _i++) {
        update = updateList[_i];
        rx = /<td height="30" nowrap> · <a href='(.*)'.*>\s*(\S*)/g;
        m = rx.exec(update);
        thisLine = [m[2], 'http://www.8comic.com' + m[1]];
        if (thisLine[1] === newest[1]) break;
        for (_j = 0, _len2 = subsList.length; _j < _len2; _j++) {
          subs = subsList[_j];
          if (thisLine[1] === subs[1] && !inEpisodeList(subs[1])) {
            updateEpisodeCount += 1;
            episodeList.push({
              title: thisLine[0],
              url: thisLine[1]
            });
            break;
          }
        }
      }
      ls.newest8COMIC = JSON.stringify(newLine);
      ls.episodeList = JSON.stringify(episodeList);
      return updateBadge('8comic', updateEpisodeCount);
    }
  });
};

inEpisodeList = function(targetURL) {
  var epi, episodeList, newEpisodeList, _i, _len;
  episodeList = JSON.parse(ls.episodeList);
  newEpisodeList = [];
  for (_i = 0, _len = episodeList.length; _i < _len; _i++) {
    epi = episodeList[_i];
    if (epi.url === targetURL) return true;
  }
  return false;
};

initialize = function() {
  if (ls.newestSFACG == null) ls.newestSFACG = JSON.stringify([]);
  if (ls.subsListSFACG == null) ls.subsListSFACG = JSON.stringify([]);
  if (ls.newest99770 == null) ls.newest99770 = JSON.stringify([]);
  if (ls.subsList99770 == null) ls.subsList99770 = JSON.stringify([]);
  if (ls.newest8COMIC == null) ls.newest8COMIC = JSON.stringify([]);
  if (ls.subsList8COMIC == null) ls.subsList8COMIC = JSON.stringify([]);
  if (ls.episodeList == null) return ls.episodeList = JSON.stringify([]);
};

updateBadge = function(from, count) {
  var badgeText, episodeList;
  episodeList = JSON.parse(ls.episodeList);
  if (ls.isNotified == null) ls.isNotified = '需要';
  if (ls.isNotified === '需要' && count > 0) makeNotification(from, count);
  badgeText = episodeList.length > 0 ? '' + episodeList.length : '';
  return chrome.browserAction.setBadgeText({
    text: badgeText
  });
};

makeNotification = function(from, count) {
  var notification;
  notification = window.webkitNotifications.createNotification('icon48.png', "" + from, "共有" + count + "則漫畫更新");
  notification.show();
  return setTimeout((function() {
    return notification.cancel();
  }), 10000);
};

isDebugging = false;

if (ls.frequency == null) ls.frequency = 10;

checkNewest();

setTimeout((function() {
  return setLoop();
}), ls.frequency * 1000 * (isDebugging ? 1 : 60));

setLoop = function() {
  checkNewest();
  return setTimeout((function() {
    return setLoop();
  }), ls.frequency * 1000 * (isDebugging ? 1 : 60));
};
