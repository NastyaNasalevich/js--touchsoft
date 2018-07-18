/* eslint-disable no-undef */

var userList;

QUnit.module('Check Users List');

QUnit.test('Creating of users list', function test(assert) {
  var done = assert.async();
  var listOfUsers;
  userList = document.getElementById('dashboard-users-list');
  panelOfUsers.initPanelOfUsersElements();
  panelOfUsers.createUserList();
  setTimeout(function f() {
    listOfUsers = userList.childNodes;
    assert.ok(listOfUsers.length !== 0, 'Users List was created!');
    done();
  }, 1500);
});


QUnit.module('Check user list');

QUnit.test('Check unread state', function test(assert) {
  var done = assert.async();
  sendRequestToDatabase('GET', 'users/', '').then(function f(body) {
    var usersKeys = Object.keys(body);
    var firstUserKey = usersKeys[0];
    return sendRequestToDatabase('PUT', 'users/' + firstUserKey, '/isRead', false);
  })
  .then(function f() {
    removeChildren(userList);
    panelOfUsers.createUserList();
  });

  setTimeout(function f() {
    var isNotRead = false;

     if(userList.childNodes[0].querySelector('.user-name-element').className === 'user-name-element unread-state') {
         isNotRead = true;
     }
     
     assert.ok( isNotRead === true, 'Message was read!');
    done();
  }, 2000);
});

QUnit.test('Check user status', function test(assert) {
  var done = assert.async();
    sendRequestToDatabase('GET', 'users/', '').then(function f(body) {
      var userStateInner = '';
      var usersKeys = Object.keys(body);
      var firstUserKey = usersKeys[0];
      var chatState = userList.childNodes[0].querySelector('.user-status-element');
      
      if (new Date() - new Date(body[firstUserKey].lastMessageDate) <= panelOfUsers.ONLINE_TIME) {
        userStateInner = 'online';
      }
      
      assert.equal(userStateInner, chatState.innerHTML, 'User status is true!');
      done();
    });
});

QUnit.test('Sort by user name', function test(assert) {
  var done = assert.async();
  var sorterTag = document.getElementById('dashboard-sorter');
  sorterTag.value = "User Name";
  panelOfUsers.createUserList();
  setTimeout(function f() {
      var sortUsers= [];
      var arrFromBD = [];
      var sortArr = sortUsers.sort();
      var i;
      var k;
      var j;

      for (i= 0; i < userList.childNodes.length; i++) {
           sortUsers[i] = userList.childNodes[i].querySelector('.user-name-element').innerHTML;
      }

      for (k = 0; k < sortUsers.length; k++){
          arrFromBD[k] = sortUsers[k];
      }
      
      for (j = 0; j < sortArr.length; j++) {
          assert.ok(sortArr[j] === arrFromBD[j], 'Users was sorted!');
      }

      done();
  }, 2000);
});

QUnit.module('Check working place');

QUnit.test('Check format of the message', function test(assert) {
  var options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
 };
  var message = new Message(new Date(), 'YOU', 'Test message');
  var testMessage = (new Date()).toLocaleString('en-US', options) + ' <br>' + 'YOU: ' + 'Test message' + '<br>';
  assert.equal(testMessage, message.showMessage(), 'Format is suitable!');
});

QUnit.test('Open working place', function test(assert) {
  var done = assert.async();
  setTimeout(function f() {
    document.getElementById('dashboard-picture').hidden = false;
    document.getElementById('dashboard-work-place').hidden = true;
    userList.childNodes[0].click();
    assert.ok(document.getElementById('dashboard-picture').hidden === true, 'Picture was closed!');
    assert.ok(document.getElementById('dashboard-work-place').hidden === false, 'Working place was opened!');
    done();
  }, 1000);
});

QUnit.test('Check the adding messages to the history panel', function test(assert) {
  var done = assert.async();
  setTimeout(function addMessageToPanel() {
    var prevHistory = document.getElementById('dashboard-history-panel').innerHTML;
    document.getElementById('dashboard-chat-textarea').value = 'Test message';
    document.getElementById('dashboard-chat-button').click();
    assert.notStrictEqual(prevHistory, document.getElementById('dashboard-history-panel').innerHTML, 'The messages were added to the history panel!');
    done();
  }, 1100); 
});

QUnit.module('Connections to the Database');

QUnit.test('Check request sending', function test(assert) {
  var prevData;
  var done = assert.async();
  sendRequestToDatabase('GET', 'messages/', '')
        .then(function sendGetRequest(body) {
          prevData = body;
        });
  sendRequestToDatabase('POST', 'messages/', '', new Message(new Date(), 'YOU', 'New message'))
    .then(function sendPostRequest() {
      sendRequestToDatabase('GET', 'messages/', '')
        .then(function sendGetRequest(body) {
          assert.notStrictEqual(body, prevData, 'Fetch request are working!');
          done();
        });
    });
});