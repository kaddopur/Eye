var clearAll, deleteSubs, loadList, ls, refreshData;

ls = localStorage;

clearAll = function() {
  ls.episodeList = JSON.stringify([]);
  return chrome.browserAction.setBadgeText({
    text: ''
  });
};

refreshData = function() {
  var _this = this;
  if (ls.frequency == null) ls.frequency = 10;
  if (ls.isNotified == null) ls.isNotified = '需要';
  options.frequency.value = ls.frequency;
  options.frequency.onchange = function() {
    return ls.frequency = options.frequency.value;
  };
  options.isNotified.value = ls.isNotified;
  return options.isNotified.onchange = function() {
    return ls.isNotified = options.isNotified.value;
  };
};

deleteSubs = function(from, index) {
  var i, newSubsList, subs, subsList, _len;
  switch (from) {
    case 'SFACG':
      if (ls.subsListSFACG == null) ls.subsListSFACG = JSON.stringify([]);
      subsList = JSON.parse(ls.subsListSFACG);
      break;
    case '99770':
      if (ls.subsList99770 == null) ls.subsList99770 = JSON.stringify([]);
      subsList = JSON.parse(ls.subsList99770);
  }
  newSubsList = [];
  for (i = 0, _len = subsList.length; i < _len; i++) {
    subs = subsList[i];
    if (i !== index) newSubsList.push(subs);
  }
  switch (from) {
    case 'SFACG':
      ls.subsListSFACG = JSON.stringify(newSubsList);
      break;
    case '99770':
      ls.subsList99770 = JSON.stringify(newSubsList);
  }
  return loadList();
};

loadList = function() {
  var i, node, subs, subsList, _len, _len2, _results;
  $('#subsDisplay').html('');
  if (ls.subsListSFACG == null) ls.subsListSFACG = JSON.stringify([]);
  subsList = JSON.parse(ls.subsListSFACG);
  for (i = 0, _len = subsList.length; i < _len; i++) {
    subs = subsList[i];
    node = "<tr><td>" + subs[0] + "</td>";
    node += "<td><span onClick='window.open(\"" + subs[1] + "\")' class='label label-warning'>前往</span></td>";
    node += "<td><button class='close' onClick='deleteSubs(\"SFACG\", " + i + ")'>&times;</button></td></tr>";
    $('#subsDisplay').append(node);
  }
  if (ls.subsList99770 == null) ls.subsList99770 = JSON.stringify([]);
  subsList = JSON.parse(ls.subsList99770);
  _results = [];
  for (i = 0, _len2 = subsList.length; i < _len2; i++) {
    subs = subsList[i];
    node = "<tr><td>" + subs[0] + "</td>";
    node += "<td><span onClick='window.open(\"" + subs[1] + "\")' class='label label-success'>前往</span></td>";
    node += "<td><button class='close' onClick='deleteSubs(\"99770\", " + i + ")'>&times;</button></td></tr>";
    _results.push($('#subsDisplay').append(node));
  }
  return _results;
};

$(document).ready(function() {
  refreshData();
  return loadList();
});
