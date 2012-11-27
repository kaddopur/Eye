// Generated by CoffeeScript 1.4.0
(function() {
  var bindListener, findUrl, isValidPath, setHotkeyPanel, setNavButton;

  isValidPath = function() {
    return true;
  };

  findUrl = function() {
    var c, ch, code, code_info, did, i, img_uri, m, menu_uri, next_id, next_uri, num, p, page, page_info, prev_id, prev_uri, r, sid, target_code, target_id, _i, _j, _len;
    console.log('findUrl');
    page_info = $('script:contains(ch=request)').html();
    r = /var codes="[^;]*;/;
    eval(r.exec(page_info)[0]);
    r = /var itemid=[^;]*;/;
    eval(r.exec(page_info)[0]);
    r = /ch=(\d+)/;
    try {
      ch = r.exec(location.search)[1];
    } catch (e) {
      location.href += '?ch=1';
    }
    prev_id = next_id = target_id = -1;
    for (i = _i = 0, _len = codes.length; _i < _len; i = ++_i) {
      c = codes[i];
      if (c.split(' ')[0] === ch) {
        if (i > 0) {
          prev_id = i - 1;
        }
        if (i < (codes.length - 1)) {
          next_id = i + 1;
        }
        target_id = i;
        target_code = c;
        break;
      }
    }
    $('body').html('');
    $('body').css('background', "url(" + (chrome.extension.getURL('img/texture.png')) + ") repeat, #FCFAF2");
    code_info = target_code.split(' ');
    num = code_info[0];
    sid = code_info[1];
    did = code_info[2];
    page = code_info[3];
    code = code_info[4];
    for (p = _j = 1; 1 <= page ? _j <= page : _j >= page; p = 1 <= page ? ++_j : --_j) {
      img_uri = '';
      if (p < 10) {
        img_uri = '00' + p;
      } else if (p < 100) {
        img_uri = '0' + p;
      } else {
        img_uri = '' + p;
      }
      m = parseInt(((p - 1) / 10) % 10) + (p - 1) % 10 * 3;
      img_uri += '_' + code.substring(m, m + 3);
      $('body').append("      <div class='eox-page'>        <img src='http://img" + sid + ".8comic.com/" + did + "/" + itemid + "/" + num + "/" + img_uri + ".jpg'>      </div>    ");
    }
    $('.eox-page').css('width', window.innerWidth - 120);
    prev_uri = menu_uri = next_uri = '';
    if (prev_id !== -1) {
      prev_uri = location.href + '';
      prev_uri = prev_uri.substring(0, prev_uri.indexOf('=') + 1) + codes[prev_id].split(' ')[0];
    }
    if (next_id !== -1) {
      next_uri = location.href + '';
      next_uri = next_uri.substring(0, next_uri.indexOf('=') + 1) + codes[next_id].split(' ')[0];
    }
    menu_uri = "http://www.8comic.com/html/" + itemid + ".html";
    setNavButton(prev_uri, menu_uri, next_uri);
    return setHotkeyPanel();
  };

  setNavButton = function(prev_uri, menu_uri, next_uri) {
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
    if (prev_uri) {
      $('#eox-prev').click(function() {
        return location.href = prev_uri;
      });
      $('#eox-prev').attr('src', chrome.extension.getURL('img/prev.png'));
    }
    if (menu_uri) {
      $('#eox-menu').click(function() {
        return location.href = menu_uri;
      });
      $('#eox-menu').attr('src', chrome.extension.getURL('img/menu.png'));
    }
    if (next_uri) {
      $('#eox-next').click(function() {
        return location.href = next_uri;
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
