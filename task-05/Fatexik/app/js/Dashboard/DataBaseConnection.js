/* exported dataBaseClass */
var dataBaseClass = (function dataBaseConnection() {
    var configObj = {
        url: "https://touchsoft-fatexik.firebaseio.com/"
    };
    var OK_RESPONSE_STATUS = 200;
    var FINAL_STATE_RESPONSE = 4;
    var dataBaseAPI;
    var XHRObj;

    function sendXHRRequest(methodRequest, userId, config, nameConfig, bodyObject) {
        var xhr = new XMLHttpRequest();
        xhr.open(methodRequest, configObj.url.concat("users").concat(userId).concat(config).concat(nameConfig).concat(".json"));
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(JSON.stringify(bodyObject));
        return xhr;
    }

    function XHRObject() {
    }

    XHRObject.prototype.sendMsg = function sendMsg(userId, message) {
        var XHRPromise = new Promise(function sendRequest(resolve) {
            sendXHRRequest("POST", userId, "/messages", "", message).onreadystatechange = function responseReady() {
                if (this.status === OK_RESPONSE_STATUS && this.readyState === FINAL_STATE_RESPONSE) {
                    resolve(true);
                }
            }
        });
        return XHRPromise;
    };
    XHRObject.prototype.getMessages = function getMsg(userId) {
        var arrayMessage;
        var XHRPromise = new Promise(function sendRequest(resolve) {
            sendXHRRequest("GET", userId, "/messages", "").onreadystatechange = function responseReady() {
                if (this.status === OK_RESPONSE_STATUS && this.readyState === FINAL_STATE_RESPONSE) {
                    arrayMessage = JSON.parse(this.response);
                    arrayMessage = Object.keys(arrayMessage).map(function createNewArray(value) {
                        return arrayMessage[value];
                    });
                    resolve(arrayMessage);
                }
            }
        });
        return XHRPromise;
    };


    XHRObject.prototype.setMessageRead = function setMessageRead(userId) {
        var XHRPromise = new Promise(function sendRequest(resolve) {
            sendXHRRequest("PUT", "/".concat(userId), "/unreadMessage", "", false).onreadystatechange = function responseReady() {
                if (this.status === OK_RESPONSE_STATUS && this.readyState === FINAL_STATE_RESPONSE) {
                    resolve(true);
                }
            };
        });
        return XHRPromise;
    };

    XHRObject.prototype.getUserChatConfig = function getConfig(elemId) {
        var chatConfig = {};
        var XHRPromise = new Promise(function sendRequest(resolve) {
            sendXHRRequest("GET", "/".concat(elemId), "/chatConfig", "").onreadystatechange = function responseReady() {
                if (this.status === OK_RESPONSE_STATUS && this.readyState === FINAL_STATE_RESPONSE) {
                    chatConfig = JSON.parse(this.response);
                    resolve(chatConfig);
                }
            };
        });
        return XHRPromise;
    };

    XHRObject.prototype.getListUsers = function getUsers() {
        var arrayClient;
        var twoMinutes = 120000;
        var arrayName;
        var currentTime = new Date().getTime();
        var XHRPromise = new Promise(function sendRequest(resolve) {
            sendXHRRequest("GET", "", "", "").onreadystatechange = function responseReady() {
                if (this.status === OK_RESPONSE_STATUS && this.readyState === FINAL_STATE_RESPONSE) {
                    arrayClient = JSON.parse(this.response);
                    arrayName = Object.keys(arrayClient).map(function createNewArray(value) {
                            return {
                                name: arrayClient[value].chatConfig.userName !== "You" && arrayClient[value].chatConfig.userName !== ""
                                    ? arrayClient[value].chatConfig.userName : "no name",
                                id: value,
                                online: (currentTime - arrayClient[value].activityTime) < twoMinutes,
                                unreadMessage: arrayClient[value].unreadMessage
                            }
                        }
                    );
                    resolve(arrayName);
                }
            }
        });
        return XHRPromise;
    };

    XHRObj = new XHRObject();

    dataBaseAPI = {
        usersList: XHRObj.getListUsers,
        sendMsg: XHRObj.sendMsg,
        getUserMessages: XHRObj.getMessages,
        getUserConfig: XHRObj.getUserChatConfig,
        setMessageRead: XHRObj.setMessageRead
    };

    return dataBaseAPI;

})();