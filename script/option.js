var refreshData, ﻿clearAll, deleteSubs;
var subsList;

﻿clearAll = function() {
  localStorage.episodeList = JSON.stringify([]);
  return chrome.browserAction.setBadgeText({
    text: ''
  });
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

//window.addEventListener('load', refreshData);

loadList = function(){
  subsList = localStorage.subsListSFACG? JSON.parse(localStorage.subsListSFACG): [];
  
  $('#subsDisplay').html('');
  for(var i=0; i<subsList.length; i++){
    var node = '<tr><td>'+subsList[i][0]+'</td>';
    node += '<td> <span onClick="window.open(\''+subsList[i][1]+'\')" class="label">前往</span></td>'
    node += '<td><button class="close" onClick="deleteSubs('+i+')">&times;</button></td></tr>'
    $('#subsDisplay').append(node);
  }
}

deleteSubs = function(index){
  subsList = localStorage.subsListSFACG? JSON.parse(localStorage.subsListSFACG): [];
  var a = subsList.slice(0, index);
  var b = subsList.slice(index+1);
  localStorage.subsListSFACG = JSON.stringify(a.concat(b));
  loadList();
}

$(document).ready(function(){
  refreshData();
  loadList();
});
