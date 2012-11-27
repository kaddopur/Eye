// Generated by CoffeeScript 1.4.0
(function() {
  var bindListener, findEachUrl, findUrl, isValidPath, menuUri, nextUri, prevUri, setHotkeyPanel, setImage, setNavButton,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  prevUri = nextUri = menuUri = '';

  isValidPath = function() {
    var re_path;
    console.log('isValidPath');
    re_path = /\/m\d*.*/gi;
    if (window.location.pathname.match(re_path) === null) {
      return false;
    } else {
      console.log('loading OK');
      return true;
    }
  };

  findUrl = function() {
    var cid, i, imageList, max, re_cid, re_path, _i, _results;
    re_path = /\/m\d*.*/gi;
    re_cid = /m(\d*)/;
    if (window.location.pathname.match(re_path) === null) {
      return;
    }
    console.log('loading OK');
    cid = parseInt(window.location.pathname.match(re_cid)[1]);
    max = $('select option').length;
    menuUri = window.location.origin + $('a#btnFavorite + a').attr('href');
    if ($('.innr8 a.redzia').length >= 2) {
      nextUri = $('.innr8 a.redzia')[1].href;
    }
    $.get(menuUri, function(res) {
      prevUri = $(res).find("a[href='" + location.pathname + "']").parent().parent().next().find('a').attr('href');
      if (prevUri) {
        prevUri = location.origin + prevUri;
        $('#eox-prev').click(function() {
          return location.href = prevUri;
        });
        return $('#eox-prev').attr('src', chrome.extension.getURL('img/prev.png'));
      }
    });
    imageList = (function() {
      var _i, _results;
      _results = [];
      for (i = _i = 0; 0 <= max ? _i <= max : _i >= max; i = 0 <= max ? ++_i : --_i) {
        _results.push(' ');
      }
      return _results;
    })();
    imageList[0] = 'head';
    _results = [];
    for (i = _i = 1; 1 <= max ? _i <= max : _i >= max; i = 1 <= max ? ++_i : --_i) {
      _results.push(findEachUrl(i, cid, imageList));
    }
    return _results;
  };

  findEachUrl = function(i, cid, imageList) {
    return $.get('http://tel.dm5.com/chapterimagefun.ashx', {
      cid: cid,
      page: i,
      key: $('#dm5_key').val(),
      language: 1
    }, function(res) {
      eval(res);
      imageList[i] = d[0];
      if (__indexOf.call(imageList, ' ') < 0) {
        setImage(imageList);
        setNavButton();
        return setHotkeyPanel();
      }
    });
  };

  setImage = function(imageList) {
    var ele, _i, _len;
    $('body').html('');
    $('body').css('background', "url(" + (chrome.extension.getURL('img/texture.png')) + ") repeat, #FCFAF2");
    imageList.shift();
    for (_i = 0, _len = imageList.length; _i < _len; _i++) {
      ele = imageList[_i];
      $('body').append("      <div class='eox-page'>        <img src=" + ele + ">      </div>    ");
    }
    return $('.eox-page').css('width', window.innerWidth - 120);
  };

  setNavButton = function() {
    console.log('setNavButton');
    $('body').append("    <img id='eox-prev' class='eox-button' src='" + (chrome.extension.getURL('img/prev_gray.png')) + "'>    <img id='eox-menu' class='eox-button' src='" + (chrome.extension.getURL('img/menu_gray.png')) + "'>    <img id='eox-next' class='eox-button' src='" + (chrome.extension.getURL('img/next_gray.png')) + "'>    <img id='eox-resize' class='eox-button' src='" + (chrome.extension.getURL('img/resize_gray.png')) + "'>  ");
    $('#eox-resize').click(function() {
      var resizeState;
      resizeState = localStorage['isResized'] != null ? localStorage['isResized'] : 'false';
      if (resizeState === 'false') {
        $('#eox-resize').attr('src', chrome.extension.getURL('img/resize.png'));
        $('.eox-page img').css('height', window.innerHeight - 12);
        return localStorage['isResized'] = 'true';
      } else if (resizeState === 'true') {
        $('#eox-resize').attr('src', chrome.extension.getURL('img/resize_gray.png'));
        $('.eox-page img').css('height', '');
        return localStorage['isResized'] = 'false';
      }
    });
    if (prevUri) {
      $('#eox-prev').click(function() {
        return location.href = prevUri;
      });
      $('#eox-prev').attr('src', chrome.extension.getURL('img/prev.png'));
    }
    if (menuUri) {
      $('#eox-menu').click(function() {
        return location.href = menuUri;
      });
      $('#eox-menu').attr('src', chrome.extension.getURL('img/menu.png'));
    }
    if (nextUri) {
      $('#eox-next').click(function() {
        return location.href = nextUri;
      });
      $('#eox-next').attr('src', chrome.extension.getURL('img/next.png'));
    }
    return $('#eox-resize').click().click();
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
          return $(window).scrollTop($('img').filter(function() {
            return $(this).offset().top < $('html').offset().top * -1;
          }).last().offset().top);
        case 39:
        case 74:
          return $(window).scrollTop($('img').filter(function() {
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

  if (isValidPath()) {
    findUrl();
    bindListener();
  }

}).call(this);
