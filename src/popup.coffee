userList = if localStorage.userList? then JSON.parse localStorage.userList else []
localStorage.userList = JSON.stringify userList
console.log userList

refreshBadge = ->
  newCount = (ele for ele in userList when ele.isNew).length
  badgeText = if newCount isnt 0 then '' + newCount else '' 
  chrome.browserAction.setBadgeText {text: badgeText}

  unreadList = (ele for ele in userList when ele.isNew) || []
  
  tempHtml = "
    <section id='site' class='clearfix'>
      <ul>
        <li><div id='eightComicLink'>8Comic.com 無限動漫</div>
        <li><div id='dm5Link'>Dm5 动漫屋</div>
      </ul>
    </section>"
  
  $('.container').html(tempHtml)
  $('#eightComicLink').click -> chrome.tabs.create {url: 'http://www.8comic.com/comic/'}
  $('#dm5Link').click -> chrome.tabs.create {url: 'http://tel.dm5.com/'}
  loadEpisode()


loadEpisode = ->
  userDm5List = (ele for ele in userList when ele.site is 'dm5') || []
  user8comicList = (ele for ele in userList when ele.site is '8comic') || []

  if user8comicList?
    $('.container').append("
      <section id='eightComic' class='column'>
        <ul></ul>
      </section>")
    for ele, i in user8comicList
      $('#eightComic ul').append("
        <li id='eightComic-#{i}'>
          <div class='new'>NEW</div>
          <div class='cover'>
            <img src='#{ele.pic}'>
          </div>
          <div class='info'>
            <div class='title'>#{ele.title}</div>
            <div class='episode'>看到 #{ele.episodeNumber}</div>
            <div class='edge'>更新到 #{ele.edgeNumber}</div>
          </div>
          <input type='button' value='續看'>
        </li>")
      $("#eightComic-#{i} .new").css('display', 'none') unless ele.isNew
      bind("#eightComic-#{i}", ele)

  if userDm5List?
    $('.container').append("
      <section id='dm5' class='column'>
        <ul></ul>
      </section>")
    for ele, i in userDm5List
      $('#dm5 ul').append("
        <li id='dm5-#{i}'>
          <div class='new'>NEW</div>
          <div class='cover'>
            <img src='#{ele.pic}'>
          </div>
          <div class='info'>
            <div class='title'>#{ele.title}</div>
            <div class='episode'>看到 #{ele.episodeNumber}</div>
            <div class='edge'>更新到 #{ele.edgeNumber}</div>
          </div>
          <input type='button' value='續看'>
        </li>")
      $("#dm5-#{i} .new").css('display', 'none') unless ele.isNew
      bind("#dm5-#{i}", ele)


bind = (target, params) ->
  $("#{target} input").click ->
    chrome.tabs.create {url: params.episodeUrl}

    
$(document).ready ->
  $('body').css('background', "url(#{chrome.extension.getURL('img/texture.png')}) repeat, #FCFAF2")
  refreshBadge()
