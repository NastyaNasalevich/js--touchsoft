/* eslint no-use-before-define: ["error", { "functions": false }] */
/* global dataBaseClass */
/* exported dashboardUpdateList */
var dashboardUpdateList = (function dashboardController(dataBaseApi) {
    var updateUserList;
    var updateListApi;
    var messager;
    var userId;
    var timerId;
    var updateListId;
    var TIME_UPDATE = 2000;
    var TIME_UPDATE_LIST = 2000;

    function UpdateUserList() {
    }

    function closeChat() {
        var workPlace = document.getElementById("workPlace");
        var adminChat = document.getElementById("adminChatContent");
        var workContentImg = document.createElement("div");
        workContentImg.className = "workContentImg";
        workContentImg.id = "workContentImg";
        workPlace.replaceChild(workContentImg, adminChat);
        clearInterval(timerId);
    }

    function setListenerClose() {
        var closeElem = document.getElementById("close");
        closeElem.addEventListener("click", closeChat);
    }


    function createAdminChat() {
        var workPlace = document.getElementById("workPlace");
        var adminChat = document.createElement("div");
        var workContentImg = document.getElementById("workContentImg");
        adminChat.className = "adminChatContent";
        adminChat.id = "adminChatContent";
        adminChat.innerHTML =
            "            <div class=\"adminChat\">\n" +
            "                <div class=\"close\" id=\"close\">X</div>\n" +
            "                <div class =\"chatName\">CHAT</div>\n" +
            "                <textarea class=\"chatHistory\" id=\"chatHistory\"></textarea>\n" +
            "                <textarea class=\"messagePlace\" id=\"messagePlace\"></textarea>\n" +
            "                <input type=\"button\" class=\"sendMessageButton\" id=\"sendMessageButton\" value=\"Send Message\">\n" +
            "            </div>\n" +
            "            <div class=\"adminConfigPlace\"></div>";
        workPlace.replaceChild(adminChat, workContentImg);
        setListenerClose();
    }

    function checkTime(time) {
        var currentTime = time;
        if (currentTime < 10) {
            currentTime = "0".concat(time);
        }
        return currentTime;
    }


    function Messager() {
        this.sendMessage = function sendMessage() {
            var userConfig;
            var message;
            var messageArea = document.getElementById("messagePlace");
            var messageHistory = document.getElementById("chatHistory");
            var date = new Date();
            var minute = checkTime(date.getMinutes());
            var hour = checkTime(date.getHours());
            dataBaseApi.setMessageRead(userId);
            dataBaseApi.getUserConfig(userId).then(function getConfig(value) {
                    userConfig = value;
                    if (userConfig.showTime) {
                        message = "\n".concat([hour, minute].join(":").concat(" ".concat("ADMIN").concat(" ").concat(messageArea.value)));
                    }
                    else {
                        message = "\n".concat(" ".concat("ADMIN").concat(" ").concat(messageArea.value));
                    }
                    messageHistory.value += message;
                    messageArea.value = "";
                    dataBaseApi.sendMsg("/".concat(userId), message);
                }
            )
        }
    }


    function objectNameComparator(a, b) {
        if (a.name > b.name) {
            return 1;
        }
        if (a.name < b.name) {
            return -1;
        }
        return 0;
    }


    function sortBubble(data) {
        var tmp;
        var counter;
        var i;
        var j;
        for (i = data.length - 1; i > 0; i--) {
            counter = 0;
            for (j = 0; j < i; j++) {
                if (!data[j].online) {
                    tmp = data[j];
                    data[j] = data[j + 1];
                    data[j + 1] = tmp;
                    counter++;
                }
            }
            if (counter === 0) {
                break;
            }
        }
        return data;
    }


    function addUserInList(user) {
        var usersList = document.getElementById("usersList");
        var clientSearch = document.getElementById("clientSearch");
        var userBlock = document.createElement("div");
        var searchLength = clientSearch.value.length;
        if (clientSearch.value === user.name.substring(0, searchLength)) {
            userBlock.className = "clientBlock";
            userBlock.id = user.id;
            userBlock.innerText = user.name;
            if (user.online) {
                userBlock.style.backgroundColor = "green";
            }
            if (user.unreadMessage) {
                userBlock.innerText += "✉";
            }
            usersList.appendChild(userBlock);
            userBlock.addEventListener("click", openClient);
        }
    }


    function updateList() {
        var lists = document.getElementsByClassName("clientBlock");
        var sort = document.getElementById("clientSort").value;
        var length = lists.length;
        var i;
        dataBaseApi.usersList().then(
            function getUserArray(value) {
                if (sort === "online") {
                    sortBubble(value);
                } else {
                    value.sort(objectNameComparator);
                }
                for (i = 0; i < length; i++) {
                    lists[0].remove();
                }
                Object.keys(value).forEach(function addUser(x) {
                    addUserInList(value[x])
                })
            }
        )
    }

    function updateChat(elemId, isUpdate) {
        var chatHistory = document.getElementById("chatHistory");
        var clientSearch = document.getElementById("clientSearch");
        var sendMessageButton = document.getElementById("sendMessageButton");
        dataBaseApi.getUserMessages("/".concat(elemId)).then(function setUserMessage(value) {
            chatHistory.value = value.join(" ");
        });
        if (isUpdate) {
            sendMessageButton.removeEventListener("click", messager.sendMessage);
        }
        messager = new Messager();
        sendMessageButton.addEventListener("click", messager.sendMessage);
        clientSearch.addEventListener("change", updateList);
    }


    function openClient() {
        var eventClick = arguments[0];
        var isUpdate = true;
        userId = eventClick.target.id;
        clearInterval(timerId);
        dataBaseApi.setMessageRead(userId);
        if (!document.getElementById("adminChatContent")) {
            createAdminChat();
            isUpdate = false;
        }
        updateChat(userId, isUpdate);
        timerId = setInterval(function update() {
            updateChat(userId, true)
        }, TIME_UPDATE);
    }


    UpdateUserList.prototype.createList = function createList() {
        dataBaseApi.usersList().then(
            function getUserArray(value) {
                sortBubble(value);
                Object.keys(value).forEach(function addUser(x) {
                    addUserInList(value[x])
                });
                updateListId = setInterval(updateList, TIME_UPDATE_LIST);
            }
        )
    };

    UpdateUserList.prototype.closeAllConnection = function closeConnection() {
        clearInterval(timerId);
        clearInterval(updateListId);
    };

    UpdateUserList.prototype.createDashboard = function createDashboard() {
        var newElem = document.createElement("div");
        newElem.id = "createdElem";
        newElem.innerHTML = '<div class="rootChatManager"><span><div class="filterUser"><input type="search" id="clientSearch"><select name="sort" class="clientSort" id="clientSort"><option disabled="disabled">Sort By</option><option selected="selected" value="online">Online</option><option value="userName">Имя</option></select><div class="usersList" id="usersList"></div></div><div class="workPlace" id="workPlace"><div class="workContentImg" id="workContentImg"></div></div></span></div>';
        return newElem;
    };

    updateUserList = new UpdateUserList();

    updateListApi = {
        updateUserList: updateUserList.createList,
        closeConnection: updateUserList.closeAllConnection,
        createDashboard: updateUserList.createDashboard
    };
    return updateListApi;
})(dataBaseClass);