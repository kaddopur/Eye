var targetURL;
var picURLs;
var completePicNum;
var menuURL;
var prevURL;
var nextURL;
var subsData;

function getQueryString(paramName) {
	paramName = paramName.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]").toLowerCase();
	var reg = "[\\?&]" + paramName + "=([^&#]*)";
	var regex = new RegExp(reg);
	var regResults = regex.exec(window.location.href.toLowerCase());
	if (regResults == null)
		return "";
	else
		return regResults[1];
}

function initialize() {
	// Initialize variable
	targetURL = getQueryString('url');
  
	serverID = targetURL.slice(targetURL.search('s=') + 2);
	picURLs = [];
	completePicNum = 0;
	comicListID = 0;
	comicID = 0;
	comicTitle = "";
	menuURL = "";
	currentEpi = "";
	prevURL = "";
	nextURL = "";
  subsData = [];

	// Increase counter
	$.get("http://eyeofxiangmin.appspot.com/add");
}

function loadPics() {
  $.get(targetURL, function(data){
    // find pictureList
    rx = /<script>([\w\W]*p=parseInt\(p\);)/;
    m = rx.exec(data);
    m[1] = m[1].replace(/request/, 'getQueryString');
    eval(m[1]);
    
    for(var p=1; p<=page; p++){
      var img="";
      if(p<10) img="00"+p;else if(p<100) img="0"+p;else img=p;
      var m=(parseInt((p-1)/10)%10)+(((p-1)%10)*3);
      img+="_"+code.substring(m,m+3);
      picURLs.push("http://img"+sid+".8comic.com/"+did+"/"+itemid+"/"+num+"/"+img+".jpg");
    }
    
    // load pics
    for ( var i = 0; i < picURLs.length; i++) {
      $(".container").append('<div class="page"><img class="pagecontent" src="' + picURLs[i] + '"></div>');
    }
    
    // set comicTitle
    rx = /content="(.*)免費漫畫線上觀看/;
    m = rx.exec(data);
    comicTitle = m[1];
    $("title").text(comicTitle+' '+ch);
    
    // set up progress bar
    $("#total").text(picURLs.length);
    
    // set next button
    if(ch < chs){
      nextURL = targetURL.replace(/ch.*/, 'ch='+nextid);
      $("#next").attr("src", "image/next.png");
    }
    
    // set prev button
    if(ch > 1){
      prevURL = targetURL.replace(/ch.*/, 'ch='+previd);
      $("#prev").attr("src", "image/prev.png");
    }
    
    // set subsData
    subsData = [comicTitle, menuURL];
    
    bindHandlers();
    checkState();
  });	
}

function bindHandlers() {
	$("img.pagecontent").load(function() {
		completePicNum += 1;
		$("#progressbar").progressbar({
			value : completePicNum / picURLs.length * 100
		});
		$("#ok").text(completePicNum);
	});

	$("#progressbar").progressbar({
		complete : function(event, ui) {
			$("#progressbar").css('opacity', 0);
			$("#indicator").css('opacity', 0);
		}
	});
  
  
  
	$("#subscribe").click(function() {
		subsList = localStorage.subsList8COMIC ? JSON.parse(localStorage.subsList8COMIC) : [];
    
    if ($("#subscribe").attr("src") !== "image/sub.png") {
      subsList.push(subsData);
      localStorage.subsList8COMIC = JSON.stringify(subsList);
      subsNotification(comicTitle, true);
      $("#subscribe").attr("src", "image/sub.png");
    } else {
      for ( var i = 0; i < subsList.length; i++) {
				if (subsList[i].toString() === subsData.toString()) {
					var a = subsList.slice(0, i);
					var b = subsList.slice(i + 1, subsList.length);
					localStorage.subsList8COMIC = JSON.stringify(a.concat(b));
					break;
				}
			}

			subsNotification(comicTitle, false);
			$("#subscribe").attr("src", "image/sub_gray.png");
    }
    checkState();
	});
  
	$("#prev").click(function() {
		if (prevURL) {
			chrome.tabs.getCurrent(function(tab) {
				chrome.tabs.update(tab.id, {
					'url' : prevURL
				});
			});
		}
	});

	$("#menu").click(function() {
		chrome.tabs.getCurrent(function(tab) {
			chrome.tabs.update(tab.id, {
				'url' : menuURL
			});
		});
	});

	$("#next").click(function() {
		if (nextURL) {
			chrome.tabs.getCurrent(function(tab) {
				chrome.tabs.update(tab.id, {
					'url' : nextURL
				});
			});
		}
	});
  
}

function checkState() {
	// Check button color
  if (localStorage.subsList8COMIC) {
    subsList = JSON.parse(localStorage.subsList8COMIC);
    
    if (in_array(''+subsData, subsList)) {
      $("#subscribe").attr("src", "image/sub.png");
    } else {
      $("#subscribe").attr("src", "image/sub_gray.png");
    }
  }
  setTimeout(function(){
    if ($("#subscribe").attr("src") === "image/sub.png"){
      checkState();
    }
  }, 3000);
}

function subsNotification(tag, isSub) {
	if (isSub) {
		var notification = window.webkitNotifications.createNotification('icon48.png', // The
		// image.
		tag, // The title.
		'訂閱成功' // The body.
		);
	} else {
		var notification = window.webkitNotifications.createNotification('icon48.png', // The
		// image.
		tag, // The title.
		'已取消訂閱' // The body.
		);
	}

	notification.onclick = function() {
		this.cancel();
	};
	notification.show();
	setTimeout(function() {
		notification.cancel();
	}, 3000);
}


$(document).ready(function() {
	initialize();
	$.get(targetURL, function(data) {
    // set menu button
    rx = /var itemid=(\d*);/;
    m = rx.exec(data);
    menuURL = 'http://www.8comic.com/html/' + m[1] + '.html';
    $("#menu").attr("src", "image/menu.png");
    
    loadPics();
	});
});

function in_array(stringToSearch, arrayToSearch) {
	for (s = 0; s < arrayToSearch.length; s++) {
		thisEntry = arrayToSearch[s].toString();
		if (thisEntry == stringToSearch) {
			return true;
		}
	}
	return false;
}
