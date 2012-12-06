findUrl = ->
  targetScriptUrl = location.origin + $('script:last-child').attr('src')
  $.get targetScriptUrl, (response) ->
    eval(response)
    
    menuUrl = $("[href*='HTML']").attr('href') || ''
    nextUrl = if nextVolume.indexOf('http') is 0 then nextVolume else ''
    prevUrl = if preVolume.indexOf('http') is 0 then preVolume else ''

    navBundle = {
      menuUrl: menuUrl,
      nextUrl: nextUrl,
      prevUrl: prevUrl
    }
    setImage picAy 
    setNavButton navBundle
    setHotkeyPanel()

    $.get menuUrl, (response) ->
      episodeUrl = location.href
      episodeNumber = $(response).find("a[href='#{episodeUrl}']").text()
      edge = $(response).find('.serialise_list:last li:first-child')
      edgeNumber = edge.text()
      edgeUrl = edge.find('a').attr('href')
      pic = $(response).find('.comic_cover img').attr('src')

      likeBundle = {
        edgeNumber: edgeNumber,
        edgeUrl: edgeUrl,
        episodeNumber: episodeNumber,
        episodeUrl: episodeUrl,
        isNew: false
        menuUrl: menuUrl,
        pic: pic,
        site: 'sfacg',
        title: comicName,
      }
      
      setLikeButton likeBundle


setImage = (imageList) ->
  $('html').html('<body></body>')
  $('body').css('background', "url(#{chrome.extension.getURL('img/texture.png')}) repeat, #FCFAF2")
  $('body').css('overflow', 'auto')
  
  for ele in imageList
    $('body').append("
      <div class='eox-page'>
        <img src=#{ele}>
      </div>
    ")
  $('.eox-page').css('width', window.innerWidth - 120)


setNavButton = (params)->
  # console.log 'setNavButton'

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

  if params.prevUrl
    $('#eox-prev').click -> location.href = params.prevUrl
    $('#eox-prev').removeClass().addClass('function')
  else
    $('#eox-prev').removeClass().addClass('no-function')

  if params.menuUrl
    $('#eox-menu').click -> location.href = params.menuUrl
    $('#eox-menu').removeClass().addClass('function')
  else
    $('#eox-menu').removeClass().addClass('no-function')

  if params.nextUrl
    $('#eox-next').click -> location.href = params.nextUrl
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
        $(window).scrollTop($('.eox-page').filter( ->
          return $(this).offset().top < $('html').offset().top * -1
        ).last().offset().top)
      when 39, 74 # right arrow, J
        $(window).scrollTop($('.eox-page').filter( ->
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
    # console.log res
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


$ ->
  # console.log 'Hello SFACG'
  findUrl()
  bindListener()
