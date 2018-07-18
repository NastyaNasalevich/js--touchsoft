/* global connectionToDatabase */
/* global Message */

var chat = (function createUserChat(){
    var main = null;
    var chatName = null;
    var sendButton = null;
    var isChatHidden = false;
    var textarea = null;
    var stateButton = null;
    var historyPanel = null;
    var userName;
    var requireNameButton = null;
    var requireNameInput = null;
    var PATH_TO_STYLES = '../../app/style/chat.css';
        
    var config = {
        title: 'New',
        botName: 'Operator',
        chatURL: 'https://mychat-b0091.firebaseio.com/',
        cssClass: 'new',
        position: 'right',
        allowMinimize: 'true',
        allowDrag: 'true',
        showDateTime: 'true',
        requireName: 'false',
        requests: 'xhr'
    };
    
    function parseConfigFromScript() {
        var pattern = /'/g;
        var script = document.currentScript.getAttribute('src');
        var setupObject = {};
        var arr = script.slice(script.indexOf('?') + 2).split('&');
        arr.forEach(function createConfigObj(e) {
            var parts = e.split('=');
            setupObject[parts[0]] = parts[1].replace(pattern, '');
        });
        return setupObject;
    }
    
    function setConfig() {
        config = Object.assign({}, parseConfigFromScript());
    }

    var lastData;
    function subscribe() {
        if(xhr && xhr.close) {
            xhr.close(); 
        }
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() { 
            
            if (this.readyState == 3 && this.status == 200 && this.responseText.length > 0) {

              var responseText = this.responseText;
              console.log(responseText);

              var c;
              var regexp = /data: /ig;
              var result;
              while (result = regexp.exec(responseText)) {c = result.index; }
              newLastData = responseText.slice(c);
              console.log(newLastData);
              console.log(lastData);

              if (/data: null/.test(newLastData) || newLastData === lastData) {
                  return;
              }
              lastData = newLastData;
              var data = responseText.match(/\{.+\}/g);
              var aaa = JSON.parse(data[data.length-1]).data;
              console.log(aaa);

              if (aaa.sender !== 'Operator') {
                  return;
              }

              var message = new Message(new Date(aaa.time), aaa.sender, aaa.body, aaa.isUser);
              historyPanel.innerHTML += '<br>' + showMessage(message);
            
            subscribe();
          }
        }
        xhr.open('GET', config.chatURL + 'messages/' + localStorage.getItem('userId') + '.json', true);
        xhr.setRequestHeader('Accept', 'text/event-stream');
        xhr.send();
    }

    subscribe();
    
    function sendXhrRequest(method, path, key, body) {
        return new Promise(function requestXHR (resolve, reject) {
          var xhr = new XMLHttpRequest();
          xhr.open(method, config.chatURL + path + localStorage.getItem('userId') + '/' + key + '.json');
          xhr.setRequestHeader('Content-Type', 'application/json');
          xhr.onload = function load() {
              resolve(JSON.parse(xhr.response));
          };
          xhr.onerror = function err() {
            reject(xhr.statusText);
          };
          xhr.send(JSON.stringify(body));
        });
    }
    
    function sendFetchRequest(method, path, key, body) {
        return fetch(
            config.chatURL + path + localStorage.getItem('userId') + '/' + key + '.json',
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
    
    function sendRequestToDatabase(method, path, key, body) {
        var response;
      
        if (config.requests === 'xhr') {
          response = sendXhrRequest(method, path, key, body);
        } else if (config.requests === 'fetch') {
          response = sendFetchRequest(method, path, key, body);
        }
      
        return response;
    }
    
    function createStyle() {
        var styles = document.createElement('link');
        styles.rel = "stylesheet";
        styles.type = "text/css";
        styles.href = PATH_TO_STYLES;
        document.head.appendChild(styles);
    }
    
    function moveAt(e) {
        main.style.left = e.pageX - chatName.offsetWidth / 2 + 'px';
        main.style.top = e.pageY - chatName.offsetHeight / 2 + 'px';
    }
    
    function dragChat(e) {
        moveAt(e);
        document.addEventListener('mousemove', moveAt);
        
        function finishDrag () {
            document.removeEventListener('mousemove', moveAt);
            document.removeEventListener('mouseup', finishDrag);
        }
    
        chatName.addEventListener('mouseup', finishDrag);
    }
    
    function createChatName() {
        chatName = document.createElement('div');
        chatName.classList.add('chatName');
        chatName.innerHTML = config.title;
    
        if (JSON.parse(config.allowDrag)) {
            chatName.addEventListener('mousedown', dragChat);
        }
    
        return chatName;
    }
    
    function createTextInput() {
       textarea = document.createElement('textarea');
       textarea.classList.add('textArea');
       textarea.placeholder = 'Message...';
    }

    function showMessage(message) {
        var options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
        };
        var senderForChat = message.isUser ? 'You' : config.botName;
        var displayedMessage = '';
        
        if (JSON.parse(config.showDateTime)) {
            displayedMessage += message.time.toLocaleString('en-US', options) + '<br>';
        }
    
        displayedMessage += senderForChat + ': ' + message.body + '<br>';
        return displayedMessage;
    }
    
     function addMessage(text) {
        var message = new Message(new Date(), userName, text, true);
        historyPanel.innerHTML += '<br>' + showMessage(message);
        sendRequestToDatabase('POST', 'messages/', '', message);
        sendRequestToDatabase('PUT', 'users/', 'isRead', false);
        sendRequestToDatabase('PUT', 'users/', 'lastMessageDate', message.time);
     }
     
    function sendMessage() {
        addMessage(textarea.value);
        textarea.value = '';
     }
    
    function createSendButton() {
       sendButton = document.createElement('button');
       sendButton.classList.add('sendButton');
       sendButton.innerHTML = 'Send';
    
       sendButton.addEventListener('click', sendMessage);
    }
    
    function getChatState() {
        sendRequestToDatabase('GET', 'users/', 'isChatHidden').then(
            function setState(body) {
                isChatHidden = body;
            }
        );
     }
     
     function setChatState() {
        sendRequestToDatabase('PUT', 'users/', 'isChatHidden', isChatHidden);
     }
    
     function initStateButton() {
        if (!isChatHidden) {
            stateButton.innerHTML = '-';
        } else {
            stateButton.innerHTML = '[]'; 
        }
    }
    
    function changeChatState() {
        isChatHidden = !isChatHidden;
        setChatState();
        
        if (historyPanel) {
            historyPanel.style.display = isChatHidden ? 'none' : 'block';
            textarea.style.display = isChatHidden ? 'none' : 'block';
            sendButton.style.display = isChatHidden ? 'none' : 'block'; 
            main.style.height = isChatHidden ? '30px' : '365px';
        } else {
            main.style.height = isChatHidden ? '30px' : '365px';
        }
        
        initStateButton();
     }
    
    function createStateButton() {
       stateButton = document.createElement('button');
       stateButton.classList.add('stateButton');
       getChatState();
       
       setTimeout(function f(){
        initStateButton();
       }, 2000);
    
       stateButton.addEventListener('click', changeChatState);
    
       return stateButton;
    }
    
    function createHistory() {
       historyPanel = document.createElement('div');
       historyPanel.classList.add('historyPanel');
    }
    
    function initChatPosition() {
        var chatPosition;
    
        if (config.position === 'left') {
            chatPosition = 'chatPositionLeft';
        } else {
            chatPosition = 'chatPositionRight';
        }
    
        return chatPosition;
    }
    
    function addHistoryToPage() {
        sendRequestToDatabase('GET', 'messages/', '').then(
            function displayMessages(body) {
                var message;
                if (!body) {
                    return;
                }
                Object.keys(body).forEach(function addEachMessage(key) {
                    message = new Message(new Date(body[key].time), body[key].sender, body[key].body, body[key].isUser);
                    historyPanel.innerHTML += '<br>' + showMessage(message);
                });
            }
        );    
    }
    
    function createUserID() {
        if (localStorage.getItem('userId') === null) {
          localStorage.setItem('userId', 'user' + Date.now() + Math.round(Math.random()*100));
        }
    }
    
    function createFullChat() {
        console.log(localStorage.getItem('userId'));
        createHistory();
        createTextInput();
        createSendButton();
        getChatState();
    
        setTimeout(function create() {
            historyPanel.style.display = isChatHidden ? 'none' : 'block';
            textarea.style.display = isChatHidden ? 'none' : 'block';
            sendButton.style.display = isChatHidden ? 'none' : 'block';
            main.style.height = isChatHidden ? '30px' : '365px';
        
            addHistoryToPage();
        }, 1000);
    
        main.appendChild(historyPanel);
        main.appendChild(textarea);
        main.appendChild(sendButton);
    }
    
    function createDivForNameRequest() {
        var requireNameWrapper = document.createElement('div');
        var requireNameTitle = document.createElement('h4');
        requireNameInput = document.createElement('input');
        requireNameButton = document.createElement('button');
    
        requireNameTitle.innerText = 'Enter your name';
        requireNameTitle.classList.add('nameRequestTitle');
        requireNameInput.classList.add('nameRequestInput');
        requireNameButton.classList.add('nameRequestButton');
        requireNameButton.innerHTML = 'Submit';
    
        requireNameWrapper.appendChild(requireNameTitle);
        requireNameWrapper.appendChild(requireNameInput);
        requireNameWrapper.appendChild(requireNameButton);
    
        requireNameButton.addEventListener('click', function setUserName() {
            userName = requireNameInput.value;
            sendRequestToDatabase('PUT', 'users/', 'userName', userName);
            createFullChat();
            main.removeChild(requireNameWrapper);
        });
    
        return requireNameWrapper;
    }
    
    function createChat() {
        createUserID();
        createStyle();
        sendRequestToDatabase('GET', 'users/', 'userName').then(
            function setUserName(body) {
              userName = body;
            }
          );
    
        main = document.createElement('div');
        main.id = 'chat';
        main.classList.add(config.cssClass);
        main.classList.add(initChatPosition());
            
        if (JSON.parse(config.allowMinimize)) {
            main.appendChild(createStateButton());
        }

        main.appendChild(createChatName());
        document.body.appendChild(main);
        
        setTimeout(function check(){
            var nameRequest;
            if (!JSON.parse(config.requireName)) {
                createFullChat();
            } else if (userName !== null) {
                createFullChat();
            } else {
                nameRequest = createDivForNameRequest();
                main.appendChild(nameRequest);
            }
        }, 1000)
     }
    
    // localStorage.clear();
    
    setConfig();
    createChat();

    function Chat() {}

    return new Chat();
    
})();