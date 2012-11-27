ls = localStorage

episodeList = if ls.episodeList? then JSON.parse(ls.episodeList) else []
ls.episodeList = JSON.stringify episodeList


refreshBadge = ->
  episodeList = if ls.episodeList? then JSON.parse(ls.episodeList) else []
  badgeText = if episodeList.length != 0 then ''+episodeList.length else '' 
  chrome.browserAction.setBadgeText {text: badgeText}
  
  if episodeList.length == 0
    tempHtml = "<div class='episode'><div class='title title-noepi'>目前沒有漫畫更新</div></div><div class='episode'>"
	#tempHtml += "<span class='label label-success'>99770</span>"
	#tempHtml += "<span class='label label-warning'>SFACG</span>"
    tempHtml += "<span class='label label-info'>8Comic</span></div>"
    
    $('.container').html(tempHtml)
	#$('.label-warning').click -> chrome.tabs.create {url: 'http://comic.sfacg.com/'}
	#$('.label-success').click -> chrome.tabs.create {url: 'http://99770.cc/'}
    $('.label-info').click -> chrome.tabs.create {url: 'http://www.8comic.com/comic/'}
  else
    $('.container').html('')
    loadEpisode()


loadEpisode = ->
  for epi, i in episodeList
    $('.container').append("<div class='episode'><div class='title'>#{epi.title}</div><img src='image/arrow_gray.png' id='go#{i}'></div></div>")
    setPicture(i, epi.url)


setPicture = (i, targetURL) ->
  target_id = "#go#{i}"

  $(target_id).attr('src', 'image/arrow.png')
  $(target_id).click =>
    chrome.tabs.create {url: targetURL}
    $(target_id).parent().remove()

    # refresh episode list
    newEpisodeList = []
    for epi in episodeList
      if epi.url != targetURL
        newEpisodeList.push epi
    ls.episodeList = JSON.stringify newEpisodeList
    refreshBadge()

    
$(document).ready ->
  refreshBadge()
