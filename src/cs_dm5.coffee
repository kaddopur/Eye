prevUri = nextUri = menuUri = ''

isValidPath = ->
  console.log 'isValidPath'
  
  re_path = /\/m\d+.*/gi  
  if window.location.pathname.match(re_path) is null
    false
  else
    console.log 'loading OK'
    true


findUrl = ->
  re_cid = /m(\d+)/

  cid = parseInt(window.location.pathname.match(re_cid)[1])
  max = $('select option').length

  menuUri = window.location.origin + $('a#btnFavorite + a').attr('href')
  if $('.innr8 a.redzia').length >= 2
    nextUri = $('.innr8 a.redzia')[1].href
  $.get menuUri, (res) ->
    prevUri = $(res).find("a[href='#{location.pathname}']").parent().parent().next().find('a').attr('href')
    if prevUri
      prevUri = location.origin + prevUri
      $('#eox-prev').click -> location.href = prevUri
      $('#eox-prev').attr('src', chrome.extension.getURL('img/prev.png'))

  imageList = (' ' for i in [0..max])
  imageList[0] = 'head'
  findEachUrl(i, cid, imageList) for i in [1..max]  


findEachUrl = (i, cid, imageList) ->
  $.get 'http://tel.dm5.com/chapterimagefun.ashx', {cid: cid, page: i, key: $('#dm5_key').val(), language: 1}, (res) ->
    eval(res)
    imageList[i] = d[0]
    if ' ' not in imageList
      setImage(imageList)
      setNavButton()
      setHotkeyPanel()


setImage = (imageList) ->
  $('body').html('')
  $('body').css('background', "url(#{chrome.extension.getURL('img/texture.png')}) repeat, #FCFAF2")
  
  imageList.shift()
  for ele in imageList
    $('body').append("
      <div class='eox-page'>
        <img src=#{ele}>
      </div>
    ")
  $('.eox-page').css('width', window.innerWidth - 120)


setNavButton = ->
  console.log 'setNavButton'

  # initialize
  $('body').append("
    <img id='eox-prev' class='eox-button' src='#{chrome.extension.getURL('img/prev_gray.png')}'>
    <img id='eox-menu' class='eox-button' src='#{chrome.extension.getURL('img/menu_gray.png')}'>
    <img id='eox-next' class='eox-button' src='#{chrome.extension.getURL('img/next_gray.png')}'>
    <img id='eox-resize' class='eox-button' src='#{chrome.extension.getURL('img/resize_gray.png')}'>
  ")

  $('#eox-resize').click ->
    resizeState = if localStorage['isResized']? then localStorage['isResized'] else 'false'
    if resizeState == 'false'
      $('#eox-resize').attr('src', chrome.extension.getURL('img/resize.png'))
      $('.eox-page img').css('height', window.innerHeight - 12)
      localStorage['isResized'] = 'true'
    else if resizeState == 'true'
      $('#eox-resize').attr('src', chrome.extension.getURL('img/resize_gray.png'))
      $('.eox-page img').css('height', '')
      localStorage['isResized'] = 'false'

  if prevUri
    $('#eox-prev').click -> location.href = prevUri
    $('#eox-prev').attr('src', chrome.extension.getURL('img/prev.png'))

  if menuUri
    $('#eox-menu').click -> location.href = menuUri
    $('#eox-menu').attr('src', chrome.extension.getURL('img/menu.png'))

  if nextUri
    $('#eox-next').click -> location.href = nextUri
    $('#eox-next').attr('src', chrome.extension.getURL('img/next.png'))

  # Setting up resize state
  $('#eox-resize').click().click()


setHotkeyPanel = ->
  $('body').append("
    <div id='eox-panel'>
      <h1>快捷鍵列表</h1>
      <hr />
      <ul>
        <li><span>H</span> : 上一卷（話）
        <li><span>L</span> : 下一卷（話）
        <li><span>→</span> or <span>J</span> : 下一頁
        <li><span>←</span> or <span>K</span> : 上一頁
        <li><span>F</span> : 符合頁面
        <li><span>?</span> : 打開/關閉此列表
      </ul>
    </div>
  ")
  $('#eox-panel').hide()


bindListener = ->
  # Binding hotkeys
  $(document).keydown (e) ->
    switch e.which
      when 37, 75 # left arrow, K
        $(window).scrollTop($('img').filter( ->
          return $(this).offset().top < $('html').offset().top * -1
        ).last().offset().top)
      when 39, 74 # right arrow, J
        $(window).scrollTop($('img').filter( ->
          return $(this).offset().top > $('html').offset().top * -1
        ).first().offset().top)
      when 72 # H
        $('#eox-prev').click()
      when 76 # L
        $('#eox-next').click()
      when 70 # F
        $('#eox-resize').click()
      when 191
        $('#eox-panel').fadeToggle("fast")
      
  $(window).resize ->
    $('.eox-page').css('width', window.innerWidth - 120)
    $('#eox-resize').click().click()


if isValidPath()
  findUrl()
  bindListener()
