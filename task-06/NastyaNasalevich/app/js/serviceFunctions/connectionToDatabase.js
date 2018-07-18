/* exported connectionToDatabase */

var connectionToDatabase = (function createConnectionToDatabase () {
    
    var chatURL = 'https://mychat-b0091.firebaseio.com/';
    var lastData;

    function sendFetchToDatabase(method, path, key, body) {
        return fetch(
            chatURL + path + key + '.json',
            {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                method: method,
                body: JSON.stringify(body)
            }
        )  
        .then(function getResponse(response) {
            return response.json();
        }).catch(function err(error) {
            console.log('There has been a problem with your fetch operation: ', error.message);
        });
    }

    function sendXhrRequest(method, path, key, body) {
        return new Promise(function requestXHR (resolve, reject) {
          var xhr = new XMLHttpRequest();
          xhr.open(method, chatURL + path + key + '.json');
          xhr.setRequestHeader('Content-Type', 'application/json');
          xhr.setRequestHeader("Accept", "application/json");
          xhr.onload = function load() {
              console.log(JSON.parse(xhr.response));
              resolve(JSON.parse(xhr.response));
          };
          xhr.onerror = function err() {
            reject(xhr.statusText);
          };
          xhr.send(JSON.stringify(body));
        });
    }

    function ConnectionToDatabase() {}

    function createLongPollingRequest() {
        var xhr;
        if(xhr) {
            xhr.close(); 
        }
        xhr = new XMLHttpRequest();
        return xhr;
    }

    function getLastDataFromLongPolling(responseText) {
        var newLastData;
        var indexOfNewLastData;
        var regexp = /data: /ig;
        var result;
        
        while (result = regexp.exec(responseText)) {
          indexOfNewLastData = result.index; 
        }

        newLastData = responseText.slice(indexOfNewLastData);
        return newLastData;
    }

    function getMessageFromLongPolling(newLastData) {
        var dataArr = newLastData.match(/\{.+\}/g);
        var messageFromResponse = JSON.parse(dataArr).data;
        return messageFromResponse;
    }

    function getChangedListOfUserFromLongPolling(newLastData, responseText) {
        var path = newLastData.split('","');
        var pathArr = path[0].split('/');
        var path1 = pathArr[1];
        var path2 = pathArr[2];
        var data = responseText.match(/\{.+\}/g);
        var userListFromDB = JSON.parse(data[0]).data;
        var changeInUserListFromDB = JSON.parse(data[data.length-1]).data;
        userListFromDB[path1][path2] = changeInUserListFromDB;
        return userListFromDB;
    }

    ConnectionToDatabase.prototype.subscribeToUsersMessagesChanges = function subscribeToUsersMessagesChanges(userId) {
        var xhr = createLongPollingRequest();
        xhr.onreadystatechange = function() { 
            
            if (this.readyState == 3 && this.status == 200 && this.responseText.length > 0) {
                var newLastData = getLastDataFromLongPolling(this.responseText);
                
                if (/data: null/.test(newLastData) || newLastData === lastData) {
                    return;
                }
                
                lastData = newLastData;
                var messageFromResponse = getMessageFromLongPolling(newLastData);

                if (messageFromResponse.sender === 'Operator') {
                  return;
                }  

                var message = createMessageObject(messageFromResponse);
                message.showMessage();
            
                subscribeToUsersMessagesChanges();
            }
        }

        xhr.open('GET', chatURL + 'messages/' + userId + '.json', true);
        xhr.setRequestHeader('Accept', 'text/event-stream');
        xhr.send();
    }

    ConnectionToDatabase.prototype.subscribeToUsersChanges = function subscribeToUsersChanges() {
        var xhr = createLongPollingRequest();
        xhr.onreadystatechange = function() { 
            
            if (this.readyState == 3 && this.status == 200 && this.responseText.length > 0) {
                var updatedUserList;
                var responseText = this.responseText;
                var newLastData = getLastDataFromLongPolling(responseText);
                
                if (/data: null/.test(newLastData) ) {
                    return;
                }

                updatedUserList = getChangedListOfUserFromLongPolling(newLastData, responseText);
                panelOfUsers.updateUserList(updatedUserList);
                subscribeToUsersChanges();
            }
        }
        xhr.open('GET', chatURL + 'users/' + '.json', true);
        xhr.setRequestHeader('Accept', 'text/event-stream');
        xhr.send();
    }

    ConnectionToDatabase.prototype.getListOfUsers = function getListOfUsers() {
        return sendXhrRequest('GET', 'users/', '');
    }

    ConnectionToDatabase.prototype.getMessages = function getMessages(userId) {
        return sendXhrRequest('GET', 'messages/', userId);
    }

    ConnectionToDatabase.prototype.sendMessageToDB = function sendMessageToDB(userId, message) {
        return sendXhrRequest('POST', 'messages/', userId, message);
    }

    ConnectionToDatabase.prototype.setReadStateToDB = function setReadState(userId) {
        return sendXhrRequest('PUT', 'users/' + userId, '/isRead', true);
    }

    return new ConnectionToDatabase();

})();
