chrome.tabs.onUpdated.addListener (tabId, changeInfo, tab) -> render(tab)
# chrome.management.onInstalled.addListener (info) -> localStorage.clear()

ls = localStorage

render = (tab) ->
  host = $.url(tab.url).attr('host')
  path = $.url(tab.url).attr('path')
  
  old99770 = ['99770.cc', 'www.99770.cc', '99mh.com', '99comic.com', 'cococomic.com', '99manga.com']
  new99770 = ['mh.99770.cc', 'dm.99manga.com']
  
  if host in old99770
    $.get(tab.url, (data) ->
      if data.search('PicListUrl') != -1
        chrome.tabs.update(tab.id, {url: 'result_99770.html?url=' + tab.url})
    )
  else if host in new99770
    console.log '新版'
  else if host.search(/sfacg.com/) != -1 and path.search(/AllComic/) != -1
    chrome.tabs.update(tab.id, {url: 'result_sfacg.html?url=' + tab.url})


checkNewest = ->
	initialize()
	episodeList = JSON.parse(ls.episodeList)

  # sfacg
	$.get('http://comic.sfacg.com/', (data) ->
		# Read LocalStorage
		newest = JSON.parse(ls.newestSFACG)
		subsList = JSON.parse(ls.subsListSFACG)

		rx = /<div id="TopList_1">([\w\W]*)<div id="TopList_2"/m
		m = rx.exec(data)
		updateRaw = m[1]
		
		rx = /<td height="30" align="center" bgcolor="#FFFFFF"><a href="\/HTML.*<\/a><\/td>/g
		updateList = updateRaw.match(rx)
    
		rx = /<a href="(\S*)".*>(.*)<\/a/
		m = rx.exec(updateList[0])
		newLine = [m[2], 'http://comic.sfacg.com' + m[1]]

		unless newLine.toString() == newest.toString()
			updateEpisodeCount = 0
			
			for update in updateList
				rx = /<a href="(\S*)".*>(.*)<\/a/
				m = rx.exec(update)
				thisLine = [m[2], 'http://comic.sfacg.com' + m[1]]

				# continue if thisLine in not in subsList
				for subs in subsList
					if thisLine[1] == subs[1] and not inEpisodeList(subs[1])
						updateEpisodeCount += 1
						episodeList.push {title: thisLine[0], url: thisLine[1]}
						break
			
			# Write back to Local Storage
			ls.newestSFACG = JSON.stringify(newLine)
			ls.episodeList = JSON.stringify(episodeList)
			updateBadge('SFACG', updateEpisodeCount)
	)

	# 99770
	$.get('http://99770.cc/comicupdate/', (data) ->
		# Read LocalStorage
		newest = JSON.parse(ls.newest99770)
		subsList = JSON.parse(ls.subsList99770)

		rx = /href="(\S*)" target="_blank" class="lkgn">(.*)<\/a><font color=red>/g
		m = rx.exec(data)
		newLine = [m[2], 'http://99770.cc' + m[1]]
		updateList = data.match(rx)
		
		unless newLine.toString() == newest.toString()
			updateEpisodeCount = 0

			for update in updateList
				rx = /href="(\S*)" target="_blank" class="lkgn">(.*)<\/a><font color=red>/g
				m = rx.exec(update)
				thisLine = [m[2], 'http://99770.cc' + m[1]]
				
				# continue if thisLine in not in subsList
				for subs in subsList
					if thisLine[1] == subs[1] and not inEpisodeList(subs[1])
						updateEpisodeCount += 1
						episodeList.push {title: thisLine[0], url: thisLine[1]}
						break
			
			# Write back to Local Storage
			ls.newest99770 = JSON.stringify(newLine)
			ls.episodeList = JSON.stringify(episodeList)
			updateBadge('99770', updateEpisodeCount)
	)


inEpisodeList = (targetURL) ->
	episodeList = JSON.parse(ls.episodeList)
	newEpisodeList = []
	for epi in episodeList
		if epi.url == targetURL
			return true
	return false

initialize = ->
	ls.newestSFACG = JSON.stringify [] unless ls.newestSFACG?
	ls.subsListSFACG = JSON.stringify [] unless ls.subsListSFACG?

	ls.newest99770 = JSON.stringify ["GAUS", "http://99770.cc/comic/11844/"] unless ls.newest99770?
	ls.subsList99770 = JSON.stringify [] unless ls.subsList99770?

	ls.episodeList = JSON.stringify [] unless ls.episodeList?
	

updateBadge = (from, count) ->
	episodeList = JSON.parse(ls.episodeList)

	# if there is a possibly change
	ls.isNotified = '需要' unless ls.isNotified?
	makeNotification(from, count) if ls.isNotified == '需要' and count > 0
  
	badgeText = if episodeList.length > 0 then ''+episodeList.length else ''
	chrome.browserAction.setBadgeText {text: badgeText}


makeNotification = (from, count) ->
	notification = window.webkitNotifications.createNotification(
		'icon48.png',
		"#{from}",
		"共有#{count}則漫畫更新")

	notification.show()
	setTimeout (-> notification.cancel()), 10000


# checkNewest interval
isDebugging = false
ls.frequency = 10 unless ls.frequency?
checkNewest()
setTimeout (-> setLoop()), ls.frequency * 1000 * if isDebugging then 1 else 60
setLoop = ->
	checkNewest()
	setTimeout (-> setLoop()), ls.frequency * 1000 * if isDebugging then 1 else 60

