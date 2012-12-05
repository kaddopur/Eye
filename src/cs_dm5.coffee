prevUri = nextUri = menuUri = ''
title = episodeNumber = ''
pic = edgeUrl = edgeNumber = ''

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
    # tg: target episode list
    tg = $(res).find("[id*='chapter_'] .tg")
    for ele, i in tg
      if ele.pathname is location.pathname and i+1 < tg.length
        console.log ele, i, tg.length, location, tg
        prevUri = tg[i+1].href
        break
    console.log 'prevUri', prevUri
    pic = $(res).find('.innr91 img').attr('src')
    edgeUrl = location.origin + $(res).find('#chapter_1 tr:first-child a').attr('href')
    if prevUri
      $('#eox-prev').click -> location.href = prevUri
      $('#eox-prev').removeClass().addClass('function')

    title = $('.bai_lj a:last-child').prev().text().match(/(\S.*)漫画/)[1]
    episodeNumber = $('.bai_lj a:last-child').text().replace(title, '').match(/(\S+)\s/)[1]
    edgeUrl = location.origin + $('.innr41 li:first-child a').attr('href')
    edgeNumber = $('.innr41 li:first-child').html().match(/title\S*\s*(\S*)">/)[1]
    
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
      }
      setLikeButton likeBundle



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
    <nav>
      <ul>
        <li id='eox-resize'><img src='#{chrome.extension.getURL('img/fullscreen.png')}' alt='符合螢幕'></li>
        <li id='eox-like'><img src='#{chrome.extension.getURL('img/star.png')}' alt='訂閱更新'></li>
        <li id='eox-prev'><img src='#{chrome.extension.getURL('img/backward.png')}' alt='上一卷（話）'></li>
        <li id='eox-menu'><img src='#{chrome.extension.getURL('img/list.png')}' alt='全集列表'></li>
        <li id='eox-next'><img src='#{chrome.extension.getURL('img/forward.png')}' alr='下一卷（話）'></li>
      </ul>
    </nav>
  ")

  isResized = if localStorage.isResized? then localStorage.isResized else 'false'
  localStorage.isResized = isResized

  if isResized == 'true'
    $('#eox-resize').removeClass().addClass('function')
    $('.eox-page img').css('height', window.innerHeight - 12)
  else
    $('#eox-resize').removeClass().addClass('no-function')
    $('.eox-page img').css('height', '')

  $('#eox-resize').click ->
    isResized = if localStorage.isResized? then localStorage.isResized else 'false'
    if isResized == 'true'
      $('#eox-resize').removeClass().addClass('no-function')
      $('.eox-page img').css('height', '')
      isResized = 'false'
    else
      $('#eox-resize').removeClass().addClass('function')
      $('.eox-page img').css('height', window.innerHeight - 12)
      isResized = 'true'
    localStorage.isResized = isResized

  if prevUri
    $('#eox-prev').click -> location.href = prevUri
    $('#eox-prev').removeClass().addClass('function')
  else
    $('#eox-prev').removeClass().addClass('no-function')

  if menuUri
    $('#eox-menu').click -> location.href = menuUri
    $('#eox-menu').removeClass().addClass('function')
  else
    $('#eox-menu').removeClass().addClass('no-function')

  if nextUri
    $('#eox-next').click -> location.href = nextUri
    $('#eox-next').removeClass().addClass('function')
  else
    $('#eox-next').removeClass().addClass('no-function')


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


setLikeButton = (params) ->
  # console.log 'setLikeButton', params
  chrome.extension.sendMessage {action: 'setLikeButton', params: params}, (res) ->
    console.log res
    if res.isFunction
      $('#eox-like').removeClass().addClass('function')
    else
      $('#eox-like').removeClass().addClass('no-function')

  $('#eox-like').click ->
    # console.log 'clickLikeButton'
    chrome.extension.sendMessage {action: 'clickLikeButton', params: params}, (res) ->
      if res.isFunction
        $('#eox-like').removeClass().addClass('function')
      else
        $('#eox-like').removeClass().addClass('no-function')


if isValidPath()
  findUrl()
  bindListener()
