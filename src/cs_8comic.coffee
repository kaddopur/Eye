setPicture = ->
  console.log 'setPicture'
  
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

  # get uri of all pictures
  $('body').html('')
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
  console.log window


setSubButton = ->
  console.log 'setSubButton'

  # initialize
  $('body').append("<img id='eox-sub' class='eox-button' src='#{chrome.extension.getURL('img/sub_gray.png')}'>")


setNavButton = (prev_uri, menu_uri, next_uri) ->
  console.log 'setNavButton'

  # initialize
  $('body').append("
    <img id='eox-prev' class='eox-button' src='#{chrome.extension.getURL('img/prev_gray.png')}'>
    <img id='eox-menu' class='eox-button' src='#{chrome.extension.getURL('img/menu_gray.png')}'>
    <img id='eox-next' class='eox-button' src='#{chrome.extension.getURL('img/next_gray.png')}'>
  ")

  if prev_uri
    $('#eox-prev').click -> location.href = prev_uri
    $('#eox-prev').attr('src', chrome.extension.getURL('img/prev.png'))

  if menu_uri
    $('#eox-menu').click -> location.href = menu_uri
    $('#eox-menu').attr('src', chrome.extension.getURL('img/menu.png'))

  if next_uri
    $('#eox-next').click -> location.href = next_uri
    $('#eox-next').attr('src', chrome.extension.getURL('img/next.png'))


setPicture()
#setSubButton()

$(window).resize ->
    $('.eox-page').css('width', window.innerWidth - 120)

