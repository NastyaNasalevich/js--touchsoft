var chatArea = null;
var messageArea = null;
var textArea = null;
var inputText = null;
var historyChat = [];
var styles = document.createElement('style');
var buttonSend = document.createElement('button');
var div = document.createElement('div');
var buttonMinimized = document.createElement('button');
var title = document.createElement('h1');
document.body.appendChild(styles);
styles.innerHTML = '\n.chatMax {\n width: 300px;\n height: 300px;\n border: 3px solid silver;\n position: fixed;\n right: 0px;\n bottom: 0px;\n background-color: salmon;\n}\n' +
    '.titleMax {\n position: fixed;\n right: 260px;\n bottom: 280px;\n font-size: 1.3em;\n color: dimgray;\n}\n' +
    '.buttonMinimizedMax {\n  position: fixed;\n  right: 10px;\n  bottom: 278px;\n}\n' +
    '.chatMin {\n  width: 300px;\n  height: 30px;\n  border: 3px solid silver;\n  position: fixed;\n  right: 0px;\n  bottom: 0px;\n  background-color: coral;\n}\n' +
    '.titleMin {\n position: fixed;\n right: 260px;\n bottom: 9px;\n font-size: 1.3em;\n color: dimgray;\n}\n' +
    '.buttonMinimizedMin {\n  position: fixed;\n  right: 10px;\n  bottom: 8px;\n}\n' +
    '.messageArea {\n width: 290px;\n height: 220px;\n position: fixed;\n right: 10px;\n bottom: 55px;\n background-color: white;\n overflow: auto;\n overflow-y: scroll;\nMax-height = 200px\n}\n' +
    '.textArea {\n width: 290px;\n height: 40px; \n  position: fixed;\n  right: 10px;\n  bottom: 10px;\n}\n' +
    '.inputText {\n width: 240px;\n height: 30px; \n  position: fixed;\n  right: 55px;\n  bottom: 10px;\n}\n' +
    '.buttonSend {\n width: 40px;\n height: 36px; \n  position: fixed;\n  right: 10px;\n  bottom: 10px;\n}\n' +
    '.hidden {\n display: none;\n}\n';
div.id = 'chat';
title.id = 'title';
title.innerHTML = 'Chat';
div.appendChild(title);
document.body.appendChild(div);
buttonMinimized.id = 'buttonMinimized';
buttonMinimized.type = 'focus';
buttonMinimized.innerHTML = '-';
div.appendChild(buttonMinimized);

function chatMax() {
    var textElement = null;
    var i = 0;
    localStorage.setItem('view', 'max');
    div.classList.remove('chatMin');
    buttonMinimized.classList.remove('buttonMinimizedMin');
    title.classList.remove('titleMin');
    div.classList.add('chatMax');
    buttonMinimized.classList.add('buttonMinimizedMax');
    title.classList.add('titleMax');
    chatArea = document.createElement('div');
    chatArea.id = 'chatArea';
    div.appendChild(chatArea);
    messageArea = document.createElement('div');
    messageArea.id = 'messageArea';
    messageArea.classList.add('messageArea');
    chatArea.appendChild(messageArea);
    textArea = document.createElement('div');
    textArea.id = 'textArea';
    textArea.classList.add('textArea');
    chatArea.appendChild(textArea);
    inputText = document.createElement('textarea');
    inputText.id = 'textArea';
    inputText.placeholder = "Type a message...";
    inputText.classList.add('inputText');
    textArea.appendChild(inputText);
    buttonSend.id = 'buttonSend';
    buttonSend.type = 'focus';
    buttonSend.innerHTML = 'Send';
    buttonSend.classList.add('buttonSend');
    textArea.appendChild(buttonSend);
    if (localStorage.getItem('history')) {
        historyChat = localStorage.getItem('history').split('^&*$#%,');
        historyChat[historyChat.length - 1] = historyChat[historyChat.length - 1].split('^&*$#%')[0];
        for (i; i < historyChat.length; i += 1) {
            textElement = document.createElement('p');
            textElement.innerHTML = historyChat[i];
            messageArea.appendChild(textElement);
            messageArea.scrollTop = messageArea.scrollHeight;
            historyChat[i] = historyChat[i].concat('^&*$#%');
        }
    }
}

function chatMin() {
    localStorage.setItem('view', 'min');
    if (chatArea) {
        div.removeChild(chatArea);
        div.classList.remove('chatMax');
        buttonMinimized.classList.remove('buttonMinimizedMax');
        title.classList.remove('titleMax');
    }
    div.classList.add('chatMin');
    buttonMinimized.classList.add('buttonMinimizedMin');
    title.classList.add('titleMin');
}

function createChat() {
    if (localStorage.getItem('view') === 'max') {
        chatMax();
    } else {
        chatMin();
    }
}

createChat();

function saveHistoryChat() {
    localStorage.setItem('history', historyChat);
}

function answerFromBot(messageText) {
    var now = new Date();
    var message = now.toLocaleTimeString().concat(' Bot: Ответ на "', messageText.toUpperCase(), '"');
    var textElement = document.createElement('p');
    textElement.innerHTML = message;
    messageArea.appendChild(textElement);
    messageArea.scrollTop = messageArea.scrollHeight;
    historyChat.push(message.concat('^&*$#%'));
    saveHistoryChat();
}

function printMessage(messageText) {
    var now = new Date();
    var message = now.toLocaleTimeString().concat(' Вы: ', messageText);
    var textElement = document.createElement('p');
    textElement.innerHTML = message;
    messageArea.appendChild(textElement);
    messageArea.scrollTop = messageArea.scrollHeight;
    historyChat.push(message.concat('^&*$#%'));
    saveHistoryChat();
    setTimeout(function setTimeoutBotMessage() {
        answerFromBot(messageText)
    }, 15000);
}

function changeViewChat() {
    if (div.classList[0] === "chatMax") {
        chatMin();
    } else {
        chatMax()
    }
}

buttonMinimized.addEventListener('click', changeViewChat());

buttonSend.addEventListener('click', function printSendMessage() {
    printMessage(inputText.value);
    inputText.value = '';
});