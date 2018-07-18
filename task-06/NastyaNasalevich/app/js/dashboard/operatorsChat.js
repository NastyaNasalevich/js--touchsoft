/* exported operatorsChat */
/* global connectionToDatabase */
/* global Message */

var operatorsChat = (function createOperatorsChat() {
    var userId;

    function sendMessage() {
        var textArea = document.querySelector('#dashboard-chat-textarea');
        var text = textArea.value;
        var message = new Message(new Date(), 'Operator', text);
        document.querySelector('#dashboard-history-panel').innerHTML += '<br>' + message.showMessage();
        connectionToDatabase.sendMessageToDB(userId, message);
        textArea.value = '';
     }

    function OperatorsChat() {}
    
    OperatorsChat.prototype.openChat = function openChat(id) {
        userId = id;
        document.querySelector('#dashboard-work-place').hidden = false;
        document.querySelector('#dashboard-picture').hidden = true;
        operatorsChat.addHistoryToPage();
    
        document.querySelector('#dashboard-chat-textarea').addEventListener('click', function f() {
            connectionToDatabase.setReadStateToDB(userId);
        });

        document.querySelector('#dashboard-chat-button').removeEventListener('click', sendMessage);
        document.querySelector('#dashboard-chat-button').addEventListener('click', sendMessage);
    }
    
    OperatorsChat.prototype.addHistoryToPage = function addHistoryToPage() {
        connectionToDatabase.getMessages(userId).then(
            function displayMessages(body) {
                var message;
                document.querySelector('#dashboard-history-panel').innerHTML = '';
                if (body) {
                    Object.keys(body).forEach(function addEachMessage(key) {
                        message = createMessageObject(body[key]);
                        document.querySelector('#dashboard-history-panel').innerHTML += '<br>' + message.showMessage();
                    });
                }
            }
        ).then(function subscribe() {
            connectionToDatabase.subscribeToUsersMessagesChanges(userId);
        });    
    }

    return new OperatorsChat();

})();

