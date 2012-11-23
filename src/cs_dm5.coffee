checkPath = ->
  re_path = /\/m\d*.*/gi
  re_cid = /m(\d*)/

  if window.location.pathname.match(re_path) is null
  	return
  console.log 'loading OK'

  cid = parseInt(window.location.pathname.match(re_cid)[1])
  max = $('select option').length

  imageList = []
  cursor = 1


  for i in [1..max]
    $.get 'http://tel.dm5.com/chapterimagefun.ashx', {cid: cid, page: i, key: $('#dm5_key').val(), language: 1}, (res) ->
      eval(res)
      imageList.push(d[0])
      if imageList.length >= max
      	imageList.sort(urlSort)
      	setImage(imageList)

urlSort = (a, b) ->
  re_page = /\/(\d*)_/
  aIndex = parseInt(a.match(re_page)[1])
  bIndex = parseInt(b.match(re_page)[1])
  return aIndex - bIndex

setImage = (imageList) ->
  $('body').html('')
  $('body').css('background-image', 'none')

  for url in imageList
    $('body').append("
	  <div class='eox-page'>
		<img src=#{url}>
	  </div>")
  $('.eox-page').css('width', window.innerWidth - 120)

checkPath()

