window.addEventListener('load', function() {
  // Initialize the option controls.
  options.frequency.value = localStorage.frequency? localStorage.frequency: 10;
  options.isNotified.value = localStorage.isNotified? localStorage.isNotified: "需要";

  // Set the display activation and frequency.
  options.frequency.onchange = function() {
    localStorage.frequency = options.frequency.value;
  };
  
  options.isNotified.onchange = function() {
    localStorage.isNotified = options.isNotified.value;
  };
});

var clearAll = function(){
  if(confirm("確定要清空更新列表中所有漫畫？")){
    localStorage.episodeList = JSON.stringify([]);
    chrome.browserAction.setBadgeText({text: ''});
  }
};