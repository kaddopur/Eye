onLikeButton =  (request, sender, sendResponse) ->
  console.log 'onMessage', request
  userList = JSON.parse localStorage.userList
  
  switch request.action
    when 'setLikeButton'
      console.log 'setLikeButton'
      for ele in userList
        if ele.menuUrl is request.params.menuUrl
          ele.episodeUrl = request.params.episodeUrl
          ele.episodeNumber = request.params.episodeNumber
          ele.isNew = false

          newCount = (ele for ele in userList when ele.isNew).length
          badgeText = if newCount isnt 0 then '' + newCount else '' 
          chrome.browserAction.setBadgeText {text: badgeText}
          
          localStorage.userList = JSON.stringify userList
          sync()
          sendResponse {isFunction: true}
          return
      sendResponse {isFunction: false}
    when 'clickLikeButton'
      console.log 'clickLikeButton'
      for ele, i in userList
        # already in userList, so remove it
        if ele.menuUrl is request.params.menuUrl
          userList = (e for e, j in userList when i isnt j)
          localStorage.userList = JSON.stringify userList
          sync()
          sendResponse {isFunction: false}
          return
    
      # not in userList, so add to userList
      userList.push(request.params)
      localStorage.userList = JSON.stringify userList
      sync()
      sendResponse {isFunction: true}


chrome.extension.onMessage.addListener onLikeButton


onInit = ->
  console.log 'onInit'
  localStorage.timestamp = '0'
  localStorage.userList = localStorage.userList || '[]'
  sync()
  chrome.tabs.create {url: chrome.extension.getURL('options.html')}
  startRequest {scheduleRequest: true}


startRequest = (params) ->
  console.log 'startRequest'
  scheduleRequest() if params? and params.scheduleRequest

  userList = JSON.parse localStorage.userList || []
  for targetComic in userList
    switch targetComic.site
      when 'dm5' then checkUpdateDm5(targetComic)
      when '8comic' then checkUpdate8comic(targetComic)
      when 'sfacg' then checkUpdateSfacg(targetComic)
      when '99770' then checkUpdate99770(targetComic)
      else console.log targetComic


checkUpdate99770 = (targetComic) ->
  $.get targetComic.menuUrl, (response) ->
    edge = $(response).find(".cVol a[href*='http']").first()
    r = /\d*[^\d]*$/
    edgeNumber = r.exec(edge.text())[0]
    edgeUrl = edge.attr('href')

    newBundle = {
      edgeNumber: edgeNumber,
      edgeUrl: edgeUrl,
      menuUrl: targetComic.menuUrl,
      site: targetComic.site,
      title: targetComic.title
    }
    checkList newBundle


checkUpdateSfacg = (targetComic) ->
  $.get targetComic.menuUrl, (response) ->
    edge = $(response).find('.serialise_list').last().find('li').first()
    edgeNumber = edge.text()
    edgeUrl = edge.find('a').attr('href')
    title = $(response).find('b.F14PX').text()

    newBundle = {
      edgeNumber: edgeNumber,
      edgeUrl: edgeUrl,
      menuUrl: targetComic.menuUrl,
      site: targetComic.site,
      title: targetComic.title
    }
    checkList newBundle


checkUpdate8comic = (targetComic) ->
  $.get targetComic.menuUrl, (response) ->
    cell = $(response).find('a.Ch, a.Vol').last()
    edgeNumber = cell.text().trim()

    callback = cell.attr('onclick')
    re_callback = /'(.*)',(.*)\)/
    params = callback.match(re_callback)
    edgeUrl = cview(params[1], params[2])

    newBundle = {
      edgeNumber: edgeNumber,
      edgeUrl: edgeUrl,
      menuUrl: targetComic.menuUrl,
      site: targetComic.site,
      title: targetComic.title
    }
    checkList newBundle


checkUpdateDm5 = (targetComic) ->
  $.get targetComic.menuUrl, (response) ->
    r = /DM5_COMIC_MID=(\d+)/
    mid = r.exec(response)[1]
    $.get "http://tel.dm5.com/template-#{mid}/?language=1", (response) ->
      edgeNumber = $(response).find('#chapter_1 tr a').first().text().match(/( - )(\S*)/)[2]
      edgeUrl = 'http://tel.dm5.com' + $(response).find('#chapter_1 tr a').first().attr('href')
      newBundle = {
        edgeNumber: edgeNumber,
        edgeUrl: edgeUrl,
        menuUrl: targetComic.menuUrl,
        site: targetComic.site,
        title: targetComic.title
      }
      checkList newBundle


scheduleRequest = ->
  console.log 'scheduleRequest'
  delay = 30
  console.log "Scheduling for: #{delay} min" 
  chrome.alarms.create('refresh', {periodInMinutes: delay})


checkList = (params) ->
  userList = JSON.parse localStorage.userList || []

  for ele, i in userList
    isSubscriber = ele.menuUrl is params.menuUrl
    isNew = ele.edgeUrl isnt params.edgeUrl
    if isSubscriber and isNew
      console.log 'just updated'
      ele.isNew = isNew
      ele.edgeUrl = params.edgeUrl
      ele.edgeNumber = params.edgeNumber

      localStorage.userList = JSON.stringify userList
      sync()
      break
    else if isSubscriber
      console.log 'already updated'
    # else
    #   console.log 'not matched'

  newCount = (ele for ele in userList when ele.isNew).length
  badgeText = if newCount isnt 0 then '' + newCount else '' 
  chrome.browserAction.setBadgeText {text: badgeText}


onAlarm = (alarm) ->
  console.log 'Got alarm'
  startRequest {scheduleRequest: true} if alarm? and alarm.name is 'refresh'


cview = (url, catid) ->
  baseurl = ''
  catid = parseInt(catid)
  switch catid
    when 4, 6, 12, 22
      baseurl = 'http://www.8comic.com/show/cool-'
    when 1, 17, 19, 21
      baseurl = 'http://www.8comic.com/show/cool-'
    when 2, 5, 7, 9
      baseurl = 'http://www.8comic.com/show/cool-'
    when 10, 11, 13, 14
      baseurl = 'http://www.8comic.com/show/best-manga-'
    when 3, 8, 15, 16, 18, 20
      baseurl = 'http://www.8comic.com/show/best-manga-'
  
  url = url.replace('.html','').replace('-','.html?ch=')
  baseurl + url


sync = ->
  if localStorage.isSync is 'true'
    if localStorage.timestamp isnt '0'
      t = new Date()
      timestamp = localStorage.timestamp = ''+Math.round(t.getTime() / 1000)

    bundle = {
      account: localStorage.account,
      password: localStorage.password,
      userlist: localStorage.userList,
      timestamp: localStorage.timestamp
    }

    $.post 'http://xzysite.appspot.com/bookmark', bundle, (response) ->
      console.log response
      if response.status is 'overwrite'
        localStorage.userList = response.userlist
        localStorage.timestamp = response.timestamp


chrome.runtime.onInstalled.addListener onInit
chrome.alarms.onAlarm.addListener onAlarm
