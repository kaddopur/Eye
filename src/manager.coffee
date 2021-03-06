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
  
  # for dm5
  $.get 'http://tel.dm5.com/manhua-new/', (res) ->
    dm5Url = 'http://tel.dm5.com'
    for target in $(res).find('.innr3 .red_lj')
      menuUrl = dm5Url + $(target).find('a:first-child').attr('href')
      title = $(target).find('a:first-child').attr('title').trim()
      edgeUrl = dm5Url + $(target).find('a:last-child').attr('href')
      edgeNumber = $(target).find('a:last-child').text().trim()
      newBundle = {
        edgeNumber: edgeNumber,
        edgeUrl: edgeUrl,
        menuUrl: menuUrl,
        site: 'dm5',
        title: title
      }
      checkList newBundle

  # for 8Comic
  $.get 'http://www.8comic.com/comic/u-1.html', (res) ->
    baComicUrl = 'http://www.8comic.com'
    for target in $(res).find('td[height=30][nowrap] a')
      menuUrl = baComicUrl + $(target).attr('href');
      find8comicOtherData(menuUrl)

  # for SFACG
  $.get 'http://comic.sfacg.com/WeeklyUpdate/', (response) ->
    for target in $(response).find('#Day0 .gray_frame a, #Day1 .gray_frame a')
      menuUrl = $(target).attr('href')
      findSfacgOtherData menuUrl + '/'


findSfacgOtherData = (menuUrl) ->
  $.get menuUrl, (response) ->
    episodeUrl = location.href
    episodeNumber = $(response).find("a[href='#{episodeUrl}']").text()
    edge = $(response).find('.serialise_list:last li:first-child')
    edgeNumber = edge.text()
    edgeUrl = edge.find('a').attr('href')
    title = $(response).find('b.F14PX').text()

    newBundle = {
      edgeNumber: edgeNumber,
      edgeUrl: edgeUrl,
      menuUrl: menuUrl,
      site: 'sfacg',
      title: title
    }
    checkList newBundle


find8comicOtherData = (menuUrl) ->
  $.get menuUrl, (res) ->
    title = $(res).find('#Comic font')[0].firstChild.data.trim()
    
    chapter = $(res).find('.Vol, .Ch')
    edgeNumber = chapter[chapter.length-1].text.trim()
    
    callback = $(chapter[chapter.length-1]).attr('onclick')
    re_callback = /'(.*)',(.*)\)/
    params = callback.match(re_callback)
    edgeUrl = cview(params[1], params[2])

    newBundle = {
      edgeNumber: edgeNumber,
      edgeUrl: edgeUrl,
      menuUrl: menuUrl,
      site: '8comic',
      title: title
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
    else
      console.log 'not matched'

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
