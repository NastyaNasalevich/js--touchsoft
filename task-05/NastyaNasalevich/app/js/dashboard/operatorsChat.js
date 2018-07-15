/* exported operatorsChat */
/* global sendRequestToDatabase */
/* global Message */

var operatorsChat = (function createOperatorsChat() {

    function sendMessage(userId) {
        var textArea = document.getElementById('dashboard-chat-textarea');
        var text = textArea.value;
        var message = new Message(new Date(), 'Operator', text);
        document.getElementById('dashboard-history-panel').innerHTML += '<br>' + message.showMessage();
        sendRequestToDatabase('POST', 'messages/', userId, message);
        textArea.value = '';
     }

    function OperatorsChat() {}
    
    OperatorsChat.prototype.openChat = function openChat(userId) {
        document.getElementById('dashboard-work-place').hidden = false;
        document.getElementById('dashboard-picture').hidden = true;
        sendRequestToDatabase('PUT', 'users/' + userId, '/isRead', true);
        operatorsChat.addHistoryToPage(userId);
    
        document.getElementById('dashboard-chat-textarea').addEventListener('click', function f() {
            sendRequestToDatabase('PUT', 'users/' + userId, '/isRead', true);
        });
    
        document.getElementById('dashboard-chat-button').addEventListener('click', function f() {
            sendMessage(userId);
        });
    }
    
     OperatorsChat.prototype.addHistoryToPage = function addHistoryToPage(userId) {
        sendRequestToDatabase('GET', 'messages/', userId).then(
            function displayMessages(body) {
                var message;
                document.getElementById('dashboard-history-panel').innerHTML = '';
                if (body) {
                    Object.keys(body).forEach(function addEachMessage(key) {
                        message = new Message(new Date(body[key].time), body[key].sender, body[key].body);
                        document.getElementById('dashboard-history-panel').innerHTML += '<br>' + message.showMessage();
                    });
                }
            }
        );    
    }

    return new OperatorsChat();

})();