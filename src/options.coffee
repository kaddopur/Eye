bindListener = ->
  $('#mysubmit').click checkValue
  $('#reset').click stopSync

checkValue = (e) ->
  e.preventDefault()
  account = $('#account').val()
  password = $('#password').val()
  retype = $('#retype').val()

  haveData = account isnt '' and password isnt '' and retype isnt ''
  samePassword = password is retype

  if haveData and samePassword
    # console.log 'start sync'
    if not localStorage.timestamp?
      t = new Date()
      timestamp = localStorage.timestamp = ''+Math.round(t.getTime() / 1000)

    bundle = {
      account: account,
      password: password,
      userlist: localStorage.userList,
      timestamp: localStorage.timestamp
    }

    $.post 'http://xzysite.appspot.com/bookmark', bundle, (response) ->
      # console.log response
      switch response.status
        when 'updated'
          startSync(account, password)
        when 'overwrite'
          startSync(account, password)
          localStorage.userList = response.userlist
          localStorage.timestamp = response.timestamp
        when 'error'
          wrongPassword()
          stopSync()
      # console.log 'processed'
  else if not haveData
    # console.log 'please fill data'
  else if not samePassword
    # console.log 'passwords are not the same'
    notSamePassword()
    stopSync()

wrongPassword = ->
  $('.success').removeClass('success')
  $('.error').removeClass('error')
  $('.help-inline').hide()
  $('#password').parent().parent().addClass('error')
  $('#password').next().show()

notSamePassword = ->
  $('.success').removeClass('success')
  $('.error').removeClass('error')
  $('.help-inline').hide()
  $('#retype').parent().parent().addClass('error')
  $('#retype').next().show()

startSync = (account, password) ->
  localStorage.account = account
  localStorage.password = password
  localStorage.isSync = 'true'
  $('#account').addClass('uneditable-input')
  $('#password').addClass('uneditable-input')
  $('#retype').addClass('uneditable-input')
  $('.success').removeClass('success')
  $('.error').removeClass('error')
  $('.help-inline').hide()
  $('#account').parent().parent().addClass('success')
  $('#account').next().show()

stopSync = ->
  localStorage.account = ''
  localStorage.password = ''
  localStorage.isSync = 'false'
  $('.uneditable-input').removeClass('uneditable-input')

checkSync = ->
  $('.help-inline').hide()
  if localStorage.isSync is 'true'
    $('#account').val(localStorage.account).addClass('uneditable-input')
    $('#password').val(localStorage.password).addClass('uneditable-input')
    $('#retype').val(localStorage.password).addClass('uneditable-input')
    $('#account').parent().parent().addClass('success')
    $('#account').next().show()

$ ->
  bindListener()
  checkSync()
