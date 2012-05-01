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


deleteSubs = (from, index) ->
  switch from
    when 'SFACG'
      ls.subsListSFACG = JSON.stringify [] unless ls.subsListSFACG?
      subsList = JSON.parse(ls.subsListSFACG)
    when '99770'
      ls.subsList99770 = JSON.stringify [] unless ls.subsList99770?
      subsList = JSON.parse(ls.subsList99770)
  
  newSubsList = []
  for subs, i in subsList
    newSubsList.push subs unless i == index
  
  switch from
    when 'SFACG' then ls.subsListSFACG = JSON.stringify(newSubsList)
    when '99770' then ls.subsList99770 = JSON.stringify(newSubsList)
    
  loadList()


loadList = ->
  $('#subsDisplay').html('')
  
  ls.subsListSFACG = JSON.stringify [] unless ls.subsListSFACG?
  subsList = JSON.parse(ls.subsListSFACG)
  for subs, i in subsList
    node = "<tr><td>#{subs[0]}</td>"
    node += "<td><span onClick='window.open(\"#{subs[1]}\")' class='label label-warning'>前往</span></td>"
    node += "<td><button class='close' onClick='deleteSubs(\"SFACG\", #{i})'>&times;</button></td></tr>"
    $('#subsDisplay').append(node)
    
  
  ls.subsList99770 = JSON.stringify [] unless ls.subsList99770?
  subsList = JSON.parse(ls.subsList99770)
  for subs, i in subsList
    node = "<tr><td>#{subs[0]}</td>"
    node += "<td><span onClick='window.open(\"#{subs[1]}\")' class='label label-success'>前往</span></td>"
    node += "<td><button class='close' onClick='deleteSubs(\"99770\", #{i})'>&times;</button></td></tr>"
    $('#subsDisplay').append(node)

$(document).ready ->
  refreshData()
  loadList()

