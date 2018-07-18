/* exported Message */

function Message(time, sender, body, isUser) {
    this.time = time;
    this.sender = sender;
    this.body = body;
    this.isUser = isUser;
}

Message.prototype.showMessage = function showMessage() {
    var options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
    };
    return this.time.toLocaleString('en-US', options) + ' ' + '<br>' + this.sender + ': ' + this.body + '<br>';
}

function createMessageObject(messageFromDB) {
    
    return new Message(new Date(messageFromDB.time), messageFromDB.sender, messageFromDB.body,messageFromDB.isUser);
}