prevUri = nextUri = menuUri = ''

checkPath = ->
  re_path = /\/m\d*.*/gi
  re_cid = /m(\d*)/

  if window.location.pathname.match(re_path) is null
  	return
  console.log 'loading OK'

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
  findUrl(i, cid, imageList) for i in [1..max]
	  

findUrl = (i, cid, imageList) ->
  $.get 'http://tel.dm5.com/chapterimagefun.ashx', {cid: cid, page: i, key: $('#dm5_key').val(), language: 1}, (res) ->
    eval(res)
    imageList[i] = d[0]
    if ' ' not in imageList
      setImage(imageList)
      setNavButton(prevUri, menuUri, nextUri)


setImage = (imageList) ->
  $('body').html('')
  $('body').css('background', "url(#{chrome.extension.getURL('img/texture.png')}) repeat, #FCFAF2")
  
  imageList.shift()
  for ele in imageList
    $('body').append("
	  <div class='eox-page'>
		<img src=#{ele}>
	  </div>")
  $('.eox-page').css('width', window.innerWidth - 120)
  


setNavButton = (prev_uri, menu_uri, next_uri) ->
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
      $('.eox-page img').css('height', window.innerHeight-12)
      localStorage['isResized'] = 'true'
    else if resizeState == 'true'
      $('#eox-resize').attr('src', chrome.extension.getURL('img/resize_gray.png'))
      $('.eox-page img').css('height', '')
      localStorage['isResized'] = 'false'

  if prev_uri
    $('#eox-prev').click -> location.href = prev_uri
    $('#eox-prev').attr('src', chrome.extension.getURL('img/prev.png'))

  if menu_uri
    $('#eox-menu').click -> location.href = menu_uri
    $('#eox-menu').attr('src', chrome.extension.getURL('img/menu.png'))

  if next_uri
    $('#eox-next').click -> location.href = next_uri
    $('#eox-next').attr('src', chrome.extension.getURL('img/next.png'))

  # Setting up resize state
  $('#eox-resize').click().click()



checkPath()

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

	  
$(window).resize ->
  $('.eox-page').css('width', window.innerWidth - 120)
  $('#eox-resize').click().click()

