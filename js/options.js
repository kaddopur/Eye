// Generated by CoffeeScript 1.4.0
var bindListener, checkSync, checkValue, notSamePassword, startSync, stopSync, wrongPassword;

bindListener = function() {
  $('#mysubmit').click(checkValue);
  return $('#reset').click(stopSync);
};

checkValue = function(e) {
  var account, bundle, haveData, password, retype, samePassword, t, timestamp;
  e.preventDefault();
  account = $('#account').val();
  password = $('#password').val();
  retype = $('#retype').val();
  haveData = account !== '' && password !== '' && retype !== '';
  samePassword = password === retype;
  if (haveData && samePassword) {
    if (!(localStorage.timestamp != null)) {
      t = new Date();
      timestamp = localStorage.timestamp = '' + Math.round(t.getTime() / 1000);
    }
    bundle = {
      account: account,
      password: password,
      userlist: localStorage.userList,
      timestamp: localStorage.timestamp
    };
    return $.post('http://xzysite.appspot.com/bookmark', bundle, function(response) {
      switch (response.status) {
        case 'updated':
          return startSync(account, password);
        case 'overwrite':
          startSync(account, password);
          localStorage.userList = response.userlist;
          return localStorage.timestamp = response.timestamp;
        case 'error':
          wrongPassword();
          return stopSync();
      }
    });
  } else if (!haveData) {
    return console.log('please fill data');
  } else if (!samePassword) {
    console.log('passwords are not the same');
    notSamePassword();
    return stopSync();
  }
};

wrongPassword = function() {
  $('.success').removeClass('success');
  $('.error').removeClass('error');
  $('.help-inline').hide();
  $('#password').parent().parent().addClass('error');
  return $('#password').next().show();
};

notSamePassword = function() {
  $('.success').removeClass('success');
  $('.error').removeClass('error');
  $('.help-inline').hide();
  $('#retype').parent().parent().addClass('error');
  return $('#retype').next().show();
};

startSync = function(account, password) {
  localStorage.account = account;
  localStorage.password = password;
  localStorage.isSync = 'true';
  $('#account').addClass('uneditable-input');
  $('#password').addClass('uneditable-input');
  $('#retype').addClass('uneditable-input');
  $('.success').removeClass('success');
  $('.error').removeClass('error');
  $('.help-inline').hide();
  $('#account').parent().parent().addClass('success');
  return $('#account').next().show();
};

stopSync = function() {
  localStorage.account = '';
  localStorage.password = '';
  localStorage.isSync = 'false';
  localStorage.timestamp = '0';
  return $('.uneditable-input').removeClass('uneditable-input');
};

checkSync = function() {
  $('.help-inline').hide();
  if (localStorage.isSync === 'true') {
    $('#account').val(localStorage.account).addClass('uneditable-input');
    $('#password').val(localStorage.password).addClass('uneditable-input');
    $('#retype').val(localStorage.password).addClass('uneditable-input');
    $('#account').parent().parent().addClass('success');
    return $('#account').next().show();
  }
};

$(function() {
  bindListener();
  return checkSync();
});
