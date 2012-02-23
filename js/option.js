var refreshData, ﻿clearAll;

﻿clearAll = function() {
  if (confirm("確定要清空更新列表中所有漫畫？")) {
    localStorage.episodeList = JSON.stringify([]);
    return chrome.browserAction.setBadgeText({
      text: ''
    });
  }
};

refreshData = function() {
  var _ref, _ref2;
  options.frequency.value = (_ref = localStorage.frequency) != null ? _ref : 10;
  options.isNotified.value = (_ref2 = localStorage.isNotified) != null ? _ref2 : "需要";
  options.frequency.onchange = function() {
    return localStorage.frequency = options.frequency.value;
  };
  return options.isNotified.onchange = function() {
    return localStorage.isNotified = options.isNotified.value;
  };
};

window.addEventListener('load', refreshData);
