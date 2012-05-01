(function() {
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

  deleteSubs = function(index) {
    var i, newSubsList, subs, subsList, _len;
    if (ls.subsListSFACG == null) ls.subsListSFACG = JSON.stringify([]);
    subsList = JSON.parse(ls.subsListSFACG);
    newSubsList = [];
    for (i = 0, _len = subsList.length; i < _len; i++) {
      subs = subsList[i];
      if (i !== index) newSubsList.push(subs);
    }
    ls.subsListSFACG = JSON.stringify(newSubsList);
    console.log(ls.subsListSFACG);
    return loadList();
  };

  loadList = function() {
    var i, node, subs, subsList, _len, _results;
    if (ls.subsListSFACG == null) ls.subsListSFACG = JSON.stringify([]);
    subsList = JSON.parse(ls.subsListSFACG);
    $('#subsDisplay').html('');
    _results = [];
    for (i = 0, _len = subsList.length; i < _len; i++) {
      subs = subsList[i];
      node = "<tr><td>" + subs[0] + "</td>";
      node += "<td><span onClick='window.open(\"" + subs[1] + "\")' class='label'>前往</span></td>";
      node += "<td><button class='close' onClick='deleteSubs(" + i + ")'>&times;</button></td></tr>";
      _results.push($('#subsDisplay').append(node));
    }
    return _results;
  };

  $(document).ready(function() {
    refreshData();
    return loadList();
  });

}).call(this);
