unreadList = if localStorage.unreadList? then JSON.parse localStorage.unreadList else []
localStorage.unreadList = JSON.stringify unreadList


refreshBadge = ->
  unreadList = if localStorage.unreadList? then JSON.parse localStorage.unreadList else []
  badgeText = if unreadList.length isnt 0 then '' + unreadList.length else '' 
  chrome.browserAction.setBadgeText {text: badgeText}
  
  if unreadList.length is 0
    tempHtml = "
      <header>
        <h1>目前沒有漫畫更新</h1>
      </header>
      <section>
        <ul>
          <li><a href='http://www.8comic.com/comic/' target='_blank'>8Comic</a>
        </ul>
      </section>"
    
    $('.container').html(tempHtml)
  else
    loadEpisode()


loadEpisode = ->
  $('.container').html('')
  tempDm5List = (ele for ele in unreadList when ele.site is 'dm5')
  temp8comicList = (ele for ele in unreadList when ele.site is '8comic')

  console.log tempDm5List, temp8comicList

  if tempDm5List.length isnt 0
    $('.container').append("
      <section id='dm5' class='column'>
        <h1>dm5</h1>
        <ul></ul>
      </section>")
    for ele, i in tempDm5List
      $('#dm5 ul').append("
        <li id='dm5-#{i}'>
          <span class='info'>
            <span class='title'>#{ele.title}</span>
            <span class='number'>#{ele.episodeNumber}</span>
          </span>
          <span class='dismiss'></span>
        </li>")
      bind("#dm5-#{i}", ele)

  if temp8comicList.length isnt 0
    $('.container').append("
      <section id='eightComic' class='column'>
        <h1>8Comic</h1>
        <ul></ul>
      </section>")
    for ele, i in temp8comicList
      $('#eightComic ul').append("
        <li id='eightComic-#{i}''>
          <span class='info'>
            <span class='title'>#{ele.title}</span>
            <span class='number'>#{ele.episodeNumber}</span>
          </span>
          <span class='dismiss'></span>
        </li>")
      bind("#eightComic-#{i}", ele)

  $('.dismiss').css('background', "url(#{chrome.extension.getURL('img/remove.png')}) no-repeat center center")
  $('.dismiss').css('background-size', "12px 12px")


bind = (target, params) ->
  $(target).click ->
    chrome.tabs.create {url: params.episodeUrl}

  $(target).find('.dismiss').click ->
    console.log 'params', params
    unreadList = if localStorage.unreadList? then JSON.parse localStorage.unreadList else []
    unreadList = (ele for ele in unreadList when ele.menuUrl isnt params.menuUrl)
    localStorage.unreadList = JSON.stringify unreadList
    $(target).remove()
    refreshBadge()


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
  $('body').css('background', "url(#{chrome.extension.getURL('img/texture.png')}) repeat, #FCFAF2")
  refreshBadge()
