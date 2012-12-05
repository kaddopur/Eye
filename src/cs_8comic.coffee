isValidPath = ->
  true


findUrl = ->
  # console.log 'findUrl'

  pic = edgeUrl = edgeNumber = ''
  
  # get codes
  page_info = $('script:contains(ch=request)').html()
  r = /var codes="[^;]*;/
  eval r.exec(page_info)[0]
  
  r = /var itemid=[^;]*;/
  eval r.exec(page_info)[0]

  # decide which chapter to display
  r = /ch=(\d+)/
  try
    ch = r.exec(location.search)[1]
  catch e
    location.href += '?ch=1'

  prev_id = next_id = target_id = -1
  for c, i in codes
    if c.split(' ')[0] == ch
      if i > 0 then prev_id = i-1
      if i < (codes.length - 1) then next_id = i+1
      target_id = i
      target_code = c
      break

  episodeId = $('font#lastchapter').text()
  re_title = /\[(.*)<font/
  title = $('font#lastchapter').parent().html().match(re_title)[1].trim()
  edgeId = $('#lastvol b').text().match(/(\S*)\s*]$/)[1]
  edgeUrl = location.origin + location.pathname + '?ch=' + edgeId

  # get uri of all pictures
  $('body').html('')
  $('body').css('background', "url(#{chrome.extension.getURL('img/texture.png')}) repeat, #FCFAF2")
  
  code_info = target_code.split(' ')
  num = code_info[0]
  sid = code_info[1]
  did = code_info[2]
  page = code_info[3]
  code = code_info[4]

  for p in [1..page]
    img_uri = ''
    if p < 10 then img_uri = '00' + p
    else if p < 100 then img_uri = '0' + p
    else img_uri = '' + p
    
    m = parseInt(((p-1)/10)%10)+(p-1)%10*3
    img_uri += '_' + code.substring(m, m+3)

    $('body').append("
      <div class='eox-page'>
        <img src='http://img#{sid}.8comic.com/#{did}/#{itemid}/#{num}/#{img_uri}.jpg'>
      </div>
    ")
  
  $('.eox-page').css('width', window.innerWidth - 120)

  prev_uri = menu_uri = next_uri = ''
  if prev_id isnt -1
    prev_uri = location.href + ''
    prev_uri = prev_uri.substring(0, prev_uri.indexOf('=')+1) + codes[prev_id].split(' ')[0]

  if next_id isnt -1
    next_uri = location.href + ''
    next_uri = next_uri.substring(0, next_uri.indexOf('=')+1) + codes[next_id].split(' ')[0]

  menu_uri = "http://www.8comic.com/html/#{itemid}.html"

  setNavButton(prev_uri, menu_uri, next_uri)
  setHotkeyPanel()
  $.get menu_uri, (res) ->
    pic = 'http://www.8comic.com' + $(res).find('td[bgcolor=f8f8f8] img').attr('src')
    chapter = $(res).find('.Vol, .Ch')
    edgeNumber = chapter[chapter.length-1].text.trim()
    episodeNumber = $(res).find("#c#{episodeId}").text()

    likeBundle = {
      site: '8comic',
      menuUrl: menu_uri,
      title: title,
      pic: pic,
      episodeUrl: location.href,
      episodeNumber: episodeNumber,
      edgeUrl: edgeUrl,
      edgeNumber: edgeNumber,
      isNew: false
    }
    # console.log likeBundle
    setLikeButton likeBundle
  

setNavButton = (prev_uri, menu_uri, next_uri) ->
  # console.log 'setNavButton'

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

  if prev_uri
    $('#eox-prev').click -> location.href = prev_uri
    $('#eox-prev').removeClass().addClass('function')
  else
    $('#eox-prev').removeClass().addClass('no-function')

  if menu_uri
    $('#eox-menu').click -> location.href = menu_uri
    $('#eox-menu').removeClass().addClass('function')
  else
    $('#eox-menu').removeClass().addClass('no-function')

  if next_uri
    $('#eox-next').click -> location.href = next_uri
    $('#eox-next').removeClass().addClass('function')
  else
    $('#eox-next').removeClass().addClass('no-function')

  if false
    # $('#eox-like').click -> location.href = next_uri
    $('#eox-like').removeClass().addClass('function')
  else
    $('#eox-like').removeClass().addClass('no-function')


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
        <li><span>F</span> : 符合螢幕
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


if isValidPath()
  findUrl()
  bindListener()
