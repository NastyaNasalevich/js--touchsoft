var chatArea = null;
var messageArea = null;
var textArea = null;
var inputText = null;
var title = null;
var botName = 'Bot';
var chatUrl = 'https://chat-92875.firebaseio.com';
var position = null;
var cssClass = null;
var allowMinimize = null;
var allowDrag = null;
var showDataTime = null;
var requireName = null;
var requests = null;
var username = null;
var isCreated = null;
var styles = document.createElement('style');
var buttonSend = document.createElement('button');
var div = document.createElement('div');
var buttonMinimized = document.createElement('button');
var buttonSendUsername = document.createElement('button');
var inputUsername = document.createElement('input');
var titleChat = document.createElement('h1');
var userId = localStorage.getItem('id');
document.body.appendChild(styles);
styles.innerHTML = '\n.chatMax {\n width: 300px;\n height: 300px;\n border: 3px solid silver;\n position: fixed;\n right: 0px;\n bottom: 0px;\n background-color: salmon;\n}\n' +
    '.titleMax {\n position: absolute;\n bottom: 274px;\n font-size: 1.3em;\n color: dimgray;\n}\n' +
    '.buttonMinimizedMax {\n  position: absolute;\n  right: 4px;\n  bottom: 274px;\n}\n' +
    '.chatMin {\n  width: 300px;\n  height: 40px;\n  border: 3px solid silver;\n  position: fixed;\n  right: 0px;\n  bottom: 0px;\n  background-color: coral;\n}\n' +
    '.titleMin {\n position: absolute;\n bottom: 15px;\n font-size: 1.3em;\n color: dimgray;\n}\n' +
    '.buttonMinimizedMin {\n  position: absolute;\n  right: 4px;\n  bottom: 13px;\n}\n' +
    '.messageArea {\n width: 290px;\n height: 220px;\n position: absolute;\n right: 5px;\n bottom: 50px;\n background-color: white;\n overflow: auto;\n overflow-y: scroll;\nMax-height = 200px\n}\n' +
    '.textArea {\n width: 290px;\n height: 40px; \n position: absolute;\n right: -5px;\n  bottom: -2px;\n}\n' +
    '.inputText {\n width: 240px;\n height: 30px; \n position: absolute;\n right: 55px;\n  bottom: 10px;\n}\n' +
    '.buttonSend {\n width: 40px;\n height: 36px; \n position: absolute;\n right: 10px;\n  bottom: 10px;\n}\n' +
    '.hidden {\n display: none;\n}\n' +
    '.inputUsername{\n position: absolute;\n right: 62px;\n  bottom: 6px;\n width: 228px;\n}\n' +
    '.buttonSendUsername{\n position: absolute;\n right: 5px;\n  bottom: 8px;\n width: 45px;\n height: 20px;\n}\n';
div.id = 'chat';
titleChat.id = 'titleChat';
buttonSendUsername.id = 'buttonSendUsername';
buttonSendUsername.classList.add('buttonSendUsername');
buttonSendUsername.innerHTML = 'send';
inputUsername.id = 'inputUsername';
inputUsername.classList.add('inputUsername');
div.appendChild(titleChat);
document.body.appendChild(div);
buttonMinimized.id = 'buttonMinimized';
buttonMinimized.type = 'focus';
buttonMinimized.innerHTML = '-';
div.appendChild(buttonMinimized);

function moveWindowChat() {

    function moveAt(event, shiftX, shiftY) {
        div.style.left = event.clientX - shiftX + 'px';
        div.style.top = event.clientY - shiftY + 'px';
    }

    div.addEventListener('mousedown', function moveChat(e) {
        var target = e.target;
        var shiftX = e.clientX - div.getBoundingClientRect().left;
        var shiftY = e.clientY - div.getBoundingClientRect().top;
        if (target.id !== 'buttonMinimized' && target.id !== 'buttonSend' && target.id !== 'buttonSendUsername') {

            div.style.zIndex = 1000;

            window.onmousemove = function mousemove(event) {
                moveAt(event, shiftX, shiftY);
            };

            div.onmouseup = function mouseup() {
                window.onmousemove = null;
                div.onmouseup = null;
            };
        }
    })
}

function setTitle() {
    if (title) {
        titleChat.innerHTML = title;
    } else {
        titleChat.innerHTML = 'Chat';
    }
}

function saveHistoryChat(text) {
    var xhttp = new XMLHttpRequest();
    var url = chatUrl + '/bd/' + userId + '/messages.json';
    if (requests === 'XHR') {
        xhttp.open('POST', url, true);
        xhttp.setRequestHeader('Content-Type', 'application/json');
        xhttp.send(JSON.stringify([
            {
                message: text
            }
        ]));
    } else {
        fetch(url, {
            method: 'POST',
            body: JSON.stringify([
                {
                    message: text
                }
            ]),
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            }
        })
    }
}

function setSettingChat(view, name) {
    var xhttp = new XMLHttpRequest();
    var url = chatUrl + '/bd/' + userId + '/settings.json';
    if (requests === 'XHR') {
        xhttp.open('PUT', url, true);
        xhttp.setRequestHeader('Content-Type', 'application/json');
        xhttp.send(JSON.stringify([
            {
                view: view,
                username: name
            }
        ]));
    } else {
        fetch(url, {
            method: 'PUT',
            body: JSON.stringify([
                {
                    view: view,
                    username: name
                }
            ]),
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            }
        })
    }
}

function printHistoryChat(data) {
    var textElement = null;
    var keys = Object.keys(data);
    var i = 0;
    for (i; i < keys.length; i++) {
        textElement = document.createElement('p');
        textElement.innerHTML = data[keys[i]][0].message;
        messageArea.appendChild(textElement);
        messageArea.scrollTop = messageArea.scrollHeight;
    }
}

function getHistoryChat() {
    var xhttp = new XMLHttpRequest();
    var url = chatUrl + '/bd/' + userId + '/messages.json';
    if (requests === 'XHR') {
        xhttp.onreadystatechange = function checkStatus() {
            if (this.readyState === 4 && this.status === 200) {
                printHistoryChat(JSON.parse(this.responseText));
            }
        };
        xhttp.open("GET", url, true);
        xhttp.send();
    } else {
        fetch(url, {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            }
        })
            .then(function responseInJSON(response) {
                return response.json();
            })
            .then(function responsePrint(response) {
                printHistoryChat(response);
            });
    }
}

function getTime() {
    var now = new Date();
    if (showDataTime) {
        return now.toLocaleTimeString().concat(' ');
    }
    return ' ';
}

function getUsername() {
    if (username) {
        return username.concat(': ')
    }
    return 'Вы: ';
}

function getBotName() {
    if (botName) {
        return botName.concat(': Ответ на "');
    }
    return 'Bot: Ответ на "';
}

function answerFromBot(messageText) {
    var time = getTime();
    var botAnswers = getBotName();
    var message = time.concat(botAnswers, messageText.toUpperCase(), '"');
    var textElement = document.createElement('p');
    textElement.innerHTML = message;
    messageArea.appendChild(textElement);
    messageArea.scrollTop = messageArea.scrollHeight;
    saveHistoryChat(message);
}

function printMessage(messageText) {
    var time = getTime();
    var name = getUsername();
    var message = time.concat(name, messageText);
    var textElement = document.createElement('p');
    textElement.innerHTML = message;
    messageArea.appendChild(textElement);
    messageArea.scrollTop = messageArea.scrollHeight;
    saveHistoryChat(message);
    setTimeout(function setTimeoutBotMessage() {
        answerFromBot(messageText)
    }, 15000);
}

function createChatMax() {
    div.id = 'chatMax';
    if (!allowMinimize) {
        div.removeChild(buttonMinimized);
    }
    setSettingChat('max', username);
    div.classList.remove('chatMin');
    buttonMinimized.classList.remove('buttonMinimizedMin');
    titleChat.classList.remove('titleMin');
    div.classList.add('chatMax');
    if (cssClass) {
        div.classList.add(cssClass);
    }
    buttonMinimized.classList.add('buttonMinimizedMax');
    setTitle();
    titleChat.classList.add('titleMax');
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
    getHistoryChat();
}

function createChatMin() {
    div.id = 'chatMin';
    setTitle();
    if (requireName && !username) {
        div.removeChild(buttonMinimized);
        div.appendChild(inputUsername);
        div.appendChild(buttonSendUsername);
    }
    if (cssClass) {
        div.classList.add(cssClass);
    }
    if (chatArea) {
        div.removeChild(chatArea);
        div.classList.remove('chatMax');
        buttonMinimized.classList.remove('buttonMinimizedMax');
        titleChat.classList.remove('titleMax');
    }
    div.classList.add('chatMin');
    buttonMinimized.classList.add('buttonMinimizedMin');
    titleChat.classList.add('titleMin');
    setSettingChat('min', username);
}

function getSettingChat() {
    var xhttp = new XMLHttpRequest();
    var url = chatUrl + '/bd/' + userId + '/settings.json';
    var view = null;
    var responseData = null;
    if (requests === 'XHR') {
        xhttp.onreadystatechange = function checkStatus() {
            if (this.readyState === 4 && this.status === 200) {
                responseData = JSON.parse(this.responseText);
                view = responseData[0].view;
                if (responseData[0].username) {
                    username = responseData[0].username;
                }
                if (view === 'max') {
                    createChatMax();
                } else {
                    createChatMin();
                }
            }
        };
        xhttp.open("GET", url, true);
        xhttp.send();
    } else {
        fetch(url, {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            }
        })
            .then(function responseInJSON(response) {
                return response.json();
            })
            .then(function startViewChat(data) {
                view = data[0].view;
                if (data[0].username) {
                    username = data[0].username;
                }
                if (view === 'max') {
                    createChatMax();
                } else {
                    createChatMin();
                }
            });
    }
}

function viewChat() {
    if (div.id === "chatMax") {
        createChatMin();
    } else {
        createChatMax();
    }
}

function createChat() {
    var now = new Date();
    isCreated = true;
    if (position === 'left') {
        div.style.left = '0px';
    }
    if (allowDrag) {
        moveWindowChat();
    }
    if (localStorage.getItem('id') === null) {
        userId = now;
        localStorage.setItem('id', userId);
        createChatMin();
    } else {
        getSettingChat();
    }
}

function ChatConfig(chatConfiguration) {
    title = chatConfiguration.title;
    botName = chatConfiguration.botName;
    chatUrl = chatConfiguration.chatUrl;
    cssClass = chatConfiguration.cssClass;
    position = chatConfiguration.position;
    allowMinimize = chatConfiguration.allowMinimize;
    allowDrag = chatConfiguration.allowDrag;
    showDataTime = chatConfiguration.showDataTime;
    requireName = chatConfiguration.requireName;
    requests = chatConfiguration.requests;
    createChat();
}

div.addEventListener('click', function delegation(event) {
    var target = event.target;
    if (target.id === 'buttonMinimized') {
        viewChat();
    } else if (target.id === 'buttonSend') {
        printMessage(inputText.value);
        inputText.value = '';
    } else if (target.id === 'buttonSendUsername') {
        username = inputUsername.value;
        setSettingChat('min', username);
        div.removeChild(inputUsername);
        div.removeChild(buttonSendUsername);
        div.appendChild(buttonMinimized);
    }
});

(function startWork() {
    if (!isCreated) {
        createChat();
    } else {
        ChatConfig();
    }
})();