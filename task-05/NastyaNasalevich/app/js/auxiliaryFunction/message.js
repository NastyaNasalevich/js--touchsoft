/* exported Message */

function Message(time, sender, body) {
    this.time = time;
    this.sender = sender;
    this.body = body;
}

 Message.prototype.showMessage = function showMsg() {
    
    var options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
     };
     
    return this.time.toLocaleString('en-US', options) + ' ' + '<br>' + this.sender + ': ' + this.body + '<br>';
}