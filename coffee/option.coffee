ls = localStorage

clearAll = ->
  ls.episodeList = JSON.stringify []
  chrome.browserAction.setBadgeText {text: ''}


refreshData = ->
  ls.frequency = 10 unless ls.frequency?
  ls.isNotified = '需要' unless ls.isNotified?

  options.frequency.value = ls.frequency
  options.frequency.onchange = => ls.frequency = options.frequency.value

  options.isNotified.value = ls.isNotified
  options.isNotified.onchange = => ls.isNotified = options.isNotified.value


deleteSubs = (index) ->
  ls.subsListSFACG = JSON.stringify [] unless ls.subsListSFACG?
  subsList = JSON.parse ls.subsListSFACG
  
  newSubsList = []
  for subs, i in subsList
    newSubsList.push subs unless i == index
  ls.subsListSFACG = JSON.stringify newSubsList
  console.log ls.subsListSFACG
  loadList()


loadList = ->
  ls.subsListSFACG = JSON.stringify [] unless ls.subsListSFACG?
  subsList = JSON.parse ls.subsListSFACG
  
  $('#subsDisplay').html('')
  for subs, i in subsList
    node = "<tr><td>#{subs[0]}</td>"
    node += "<td><span onClick='window.open(\"#{subs[1]}\")' class='label'>前往</span></td>"
    node += "<td><button class='close' onClick='deleteSubs(#{i})'>&times;</button></td></tr>"
    $('#subsDisplay').append(node)


$(document).ready ->
  refreshData()
  loadList()

