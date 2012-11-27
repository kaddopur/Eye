onInit = ->
  console.log 'onInit'
  localStorage.userDm5List = '[]' if not localStorage.userDm5List?
  localStorage.user8comicList = '[]' if not localStorage.user8comicList?
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
      episodeUrl = dm5Url + $(target).find('a:last-child').attr('href')
      episodeNumber = $(target).find('a:last-child').text().trim()
      checkUserSubscription 'site': 'dm5', 'menuUrl': menuUrl, 'title': title, 'episodeUrl': episodeUrl, 'episodeNumber': episodeNumber

  # for 8comic
  $.get 'http://www.8comic.com/comic/u-1.html', (res) ->
    baComicUrl = 'http://www.8comic.com'
    for target in $(res).find('td[height=30][nowrap] a')
      menuUrl = baComicUrl + $(target).attr('href');
      find8comicOtherData(menuUrl)

find8comicOtherData = (menuUrl) ->
  $.get menuUrl, (res) ->
    title = $(res).find('#Comic font')[0].firstChild.data.trim()
    
    chapter = $(res).find('.Vol, .Ch')
    episodeNumber = chapter[chapter.length-1].text.trim()
    
    callback = $(chapter[chapter.length-1]).attr('onclick')
    re_callback = /'(.*)',(.*)\)/
    params = callback.match(re_callback)
    episodeUrl = cview(params[1], params[2])

    checkUserSubscription 'site': '8comic', 'menuUrl': menuUrl, 'title': title, 'episodeUrl': episodeUrl, 'episodeNumber': episodeNumber

scheduleRequest = ->
  console.log 'scheduleRequest'
  delay = 15
  console.log "Scheduling for: #{delay} min" 
  chrome.alarms.create('refresh', {periodInMinutes: delay})

checkUserSubscription = (params) ->
  console.log 'checkUserSubscription'
  # console.log params
  switch params.site
    when 'dm5'
      console.log 'check dm5'
      localStorage.userDm5List = checkList(localStorage.userDm5List, params)
    when '8comic'
      console.log 'check 8comic'
      localStorage.user8comicList = checkList(localStorage.user8comicList, params)
    else
      console.log 'check nothing'

checkList = (ls_userList, params) ->
  localStorage.unreadList = JSON.stringify([]) if not localStorage.unreadList?
  ls_userList = JSON.stringify([]) if not ls_userList?
  unreadList = JSON.parse(localStorage.unreadList)
  userList = JSON.parse(ls_userList)
  
  for ele, i in userList
    console.log ele, params
    isSubscriber = ele.menuUrl is params.menuUrl
    isNew = ele.episodeUrl isnt params.episodeUrl
    if isSubscriber and isNew
      console.log 'just updated'
      unreadList.push params
      localStorage.unreadList = JSON.stringify(unreadList)
      userList[i] = params
    else if isSubscriber
      console.log 'already updated'
    else
      console.log 'not matched'
  JSON.stringify(userList)

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

chrome.runtime.onInstalled.addListener onInit
chrome.alarms.onAlarm.addListener onAlarm


