// Generated by CoffeeScript 1.4.0
var bindListener, edgeNumber, edgeUrl, episodeNumber, findEachUrl, findUrl, isValidPath, menuUri, nextUri, pic, prevUri, setHotkeyPanel, setImage, setLikeButton, setNavButton, title,
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

prevUri = nextUri = menuUri = '';

title = episodeNumber = '';

pic = edgeUrl = edgeNumber = '';

isValidPath = function() {
  var re_path;
  re_path = /\/m\d+.*/gi;
  if (window.location.pathname.match(re_path) === null) {
    return false;
  } else {
    return true;
  }
};

findUrl = function() {
  var cid, max, re_cid;
  re_cid = /m(\d+)/;
  cid = parseInt(window.location.pathname.match(re_cid)[1]);
  max = $('select option').length;
  menuUri = window.location.origin + $('a#btnFavorite + a').attr('href');
  if ($('.innr8 a.redzia').length >= 2) {
    nextUri = $('.innr8 a.redzia')[1].href;
  }
  return $.get(menuUri, function(res) {
    var ele, i, imageList, tg, _i, _j, _len, _results;
    tg = $(res).find("[id*='chapter_'] .tg");
    for (i = _i = 0, _len = tg.length; _i < _len; i = ++_i) {
      ele = tg[i];
      if (ele.pathname === location.pathname && i + 1 < tg.length) {
        prevUri = tg[i + 1].href;
        break;
      }
    }
    pic = $(res).find('.innr91 img').attr('src');
    edgeUrl = location.origin + $(res).find('#chapter_1 tr:first-child a').attr('href');
    if (prevUri) {
      $('#eox-prev').click(function() {
        return location.href = prevUri;
      });
      $('#eox-prev').removeClass().addClass('function');
    }
    title = $('.bai_lj a:last-child').prev().text().match(/(\S.*)漫画/)[1];
    episodeNumber = $('.bai_lj a:last-child').text().replace(title, '').match(/(\S+)\s/)[1];
    edgeUrl = location.origin + $('.innr41 li:first-child a').attr('href');
    edgeNumber = $('.innr41 li:first-child').html().match(/title\S*\s*(\S*)">/)[1];
    imageList = (function() {
      var _j, _results;
      _results = [];
      for (i = _j = 0; 0 <= max ? _j <= max : _j >= max; i = 0 <= max ? ++_j : --_j) {
        _results.push(' ');
      }
      return _results;
    })();
    imageList[0] = 'head';
    _results = [];
    for (i = _j = 1; 1 <= max ? _j <= max : _j >= max; i = 1 <= max ? ++_j : --_j) {
      _results.push(findEachUrl(i, cid, imageList));
    }
    return _results;
  });
};

findEachUrl = function(i, cid, imageList) {
  return $.get('http://tel.dm5.com/chapterimagefun.ashx', {
    cid: cid,
    page: i,
    key: $('#dm5_key').val(),
    language: 1
  }, function(res) {
    var likeBundle;
    eval(res);
    imageList[i] = d[0];
    if (__indexOf.call(imageList, ' ') < 0) {
      setImage(imageList);
      setNavButton();
      setHotkeyPanel();
      likeBundle = {
        site: 'dm5',
        menuUrl: menuUri,
        title: title,
        pic: pic,
        episodeUrl: location.href,
        episodeNumber: episodeNumber,
        edgeUrl: edgeUrl,
        edgeNumber: edgeNumber,
        isNew: false
      };
      return setLikeButton(likeBundle);
    }
  });
};

setImage = function(imageList) {
  var ele, _i, _len;
  $('html').html('<body></body>');
  $('body').css('background', "url(" + (chrome.extension.getURL('img/texture.png')) + ") repeat, #FCFAF2");
  imageList.shift();
  for (_i = 0, _len = imageList.length; _i < _len; _i++) {
    ele = imageList[_i];
    $('body').append("      <div class='eox-page'>        <img src=" + ele + ">      </div>    ");
  }
  return $('.eox-page').css('width', window.innerWidth - 120);
};

setNavButton = function() {
  var isResized;
  $('body').append("    <nav>      <ul>        <li id='eox-resize'><img src='" + (chrome.extension.getURL('img/fullscreen.png')) + "' alt='符合螢幕'></li>        <li id='eox-like'><img src='" + (chrome.extension.getURL('img/star.png')) + "' alt='訂閱更新'></li>        <li id='eox-prev'><img src='" + (chrome.extension.getURL('img/backward.png')) + "' alt='上一卷（話）'></li>        <li id='eox-menu'><img src='" + (chrome.extension.getURL('img/list.png')) + "' alt='全集列表'></li>        <li id='eox-next'><img src='" + (chrome.extension.getURL('img/forward.png')) + "' alr='下一卷（話）'></li>      </ul>    </nav>  ");
  isResized = localStorage.isResized != null ? localStorage.isResized : 'false';
  localStorage.isResized = isResized;
  if (isResized === 'true') {
    $('#eox-resize').removeClass().addClass('function');
    $('.eox-page img').css('height', window.innerHeight - 12);
  } else {
    $('#eox-resize').removeClass().addClass('no-function');
    $('.eox-page img').css('height', '');
  }
  $('#eox-resize').click(function() {
    isResized = localStorage.isResized != null ? localStorage.isResized : 'false';
    if (isResized === 'true') {
      $('#eox-resize').removeClass().addClass('no-function');
      $('.eox-page img').css('height', '');
      isResized = 'false';
    } else {
      $('#eox-resize').removeClass().addClass('function');
      $('.eox-page img').css('height', window.innerHeight - 12);
      isResized = 'true';
    }
    return localStorage.isResized = isResized;
  });
  if (prevUri) {
    $('#eox-prev').click(function() {
      return location.href = prevUri;
    });
    $('#eox-prev').removeClass().addClass('function');
  } else {
    $('#eox-prev').removeClass().addClass('no-function');
  }
  if (menuUri) {
    $('#eox-menu').click(function() {
      return location.href = menuUri;
    });
    $('#eox-menu').removeClass().addClass('function');
  } else {
    $('#eox-menu').removeClass().addClass('no-function');
  }
  if (nextUri) {
    $('#eox-next').click(function() {
      return location.href = nextUri;
    });
    return $('#eox-next').removeClass().addClass('function');
  } else {
    return $('#eox-next').removeClass().addClass('no-function');
  }
};

setHotkeyPanel = function() {
  $('body').append("    <div id='eox-panel'>      <h1>快捷鍵列表</h1>      <hr />      <ul>        <li><span>H</span> : 上一卷（話）        <li><span>L</span> : 下一卷（話）        <li><span>→</span> or <span>J</span> : 下一頁        <li><span>←</span> or <span>K</span> : 上一頁        <li><span>F</span> : 符合頁面        <li><span>?</span> : 打開/關閉此列表      </ul>    </div>  ");
  return $('#eox-panel').hide();
};

bindListener = function() {
  $(document).keydown(function(e) {
    switch (e.which) {
      case 37:
      case 75:
        return $(window).scrollTop($('.eox-page').filter(function() {
          return $(this).offset().top < $('html').offset().top * -1;
        }).last().offset().top);
      case 39:
      case 74:
        return $(window).scrollTop($('.eox-page').filter(function() {
          return $(this).offset().top > $('html').offset().top * -1;
        }).first().offset().top);
      case 72:
        return $('#eox-prev').click();
      case 76:
        return $('#eox-next').click();
      case 70:
        return $('#eox-resize').click();
      case 191:
        return $('#eox-panel').fadeToggle("fast");
    }
  });
  return $(window).resize(function() {
    $('.eox-page').css('width', window.innerWidth - 120);
    return $('#eox-resize').click().click();
  });
};

setLikeButton = function(params) {
  chrome.extension.sendMessage({
    action: 'setLikeButton',
    params: params
  }, function(res) {
    if (res.isFunction) {
      return $('#eox-like').removeClass().addClass('function');
    } else {
      return $('#eox-like').removeClass().addClass('no-function');
    }
  });
  return $('#eox-like').click(function() {
    return chrome.extension.sendMessage({
      action: 'clickLikeButton',
      params: params
    }, function(res) {
      if (res.isFunction) {
        return $('#eox-like').removeClass().addClass('function');
      } else {
        return $('#eox-like').removeClass().addClass('no-function');
      }
    });
  });
};

if (isValidPath()) {
  findUrl();
  bindListener();
}
