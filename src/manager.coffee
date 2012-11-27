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
      title = $(target).find('a:first-child').attr('title')
      episodeUrl = dm5Url + $(target).find('a:last-child').attr('href')
      episodeNumber = $(target).find('a:last-child').text()
      checkUserSubscription 'site': 'dm5', 'menuUrl': menuUrl, 'title': title, 'episodeUrl': episodeUrl, 'episodeNumber': episodeNumber

  # for 8comic
  # $.get 'http://www.8comic.com/comic/u-1.html', (res) ->
  #   baComicUrl = 'http://www.8comic.com'
  #   for target in $(res).find('td[height=30][nowrap] a')
  #     menuUrl = baComicUrl + $(target).attr('href');
  #     content = $(target).text()
  #     re = /\[.*(\W*).*]/
  #     console.log content.match(re)

  #     console.log menuUrl, content

scheduleRequest = ->
  console.log 'scheduleRequest'
  delay = 1
  console.log "Scheduling for: #{delay} min" 
  chrome.alarms.create('refresh', {periodInMinutes: delay})

checkUserSubscription = (params) ->
  console.log 'checkUserSubscription'
  # console.log params
  switch params.site
    when 'dm5'
      localStorage.userDm5List = checkList(localStorage.userDm5List, params)
    when '8comic'
      localStorage.user8comicList = checkList(localStorage.user8comicList, params)
    else
      console.log 'check nothing'

checkList = (ls_userList, params) ->
  localStorage.unreadList = JSON.stringify([]) if not localStorage.unreadList?
  ls_userList = JSON.stringify([]) if not ls_userList?
  unreadList = JSON.parse(localStorage.unreadList)
  userList = JSON.parse(ls_userList)
  
  for ele, i in userList
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

chrome.runtime.onInstalled.addListener onInit
chrome.alarms.onAlarm.addListener onAlarm
