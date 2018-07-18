/* exported panelOfUsers */
/* global filter */
/* global sorter */
/* global operatorsChat */
/* global removeChildren */
/* global connectionToDatabase */

var panelOfUsers = (function createpanelOfUsers() {
    var userList;
    var sorterTag;
    var filterTag;
    var usersObject;
    var ONLINE_TIME = 600000;

    function selectUser() { 
        var target = event.target.parentNode;
        operatorsChat.openChat(target.id);
        document.querySelector('#active').innerHTML = 'Active:   ' + target.querySelector('.user-name-element').innerHTML;
        target.querySelector('.user-name-element').classList.add('read-state');
        connectionToDatabase.setReadStateToDB(target.id);
    };
    
    function addUser(userBody, userId) {

        var userElement = document.createElement('div');
        var userNameElement = document.createElement('div');
        var userStatusElement = document.createElement('div');
        var chatStateElement = document.createElement('div');
        userNameElement.classList.add('user-name-element');
        userStatusElement.classList.add('user-status-element');
        chatStateElement.classList.add('chat-state-element');
        
        userElement.id = userId;
        userNameElement.innerHTML = userBody.userName ? userBody.userName : 'Anonymous';
    
        if (userBody.isChatHidden) {
            chatStateElement.innerHTML = ' - ';
        } else {
            chatStateElement.innerHTML = '[ ]';
        }
    
        if (!userBody.isRead) {
            userNameElement.classList.add('unread-state');
        }
        
        if (new Date() - new Date(userBody.lastMessageDate) <= ONLINE_TIME) {
            userStatusElement.innerHTML = 'online';
        }
    
        userElement.appendChild(chatStateElement);
        userElement.appendChild(userStatusElement);
        userElement.appendChild(userNameElement);
        
        if (sorterTag.value === 'User Name') {
            sorter.sortByUserName(userElement, userList);
        } else if (sorterTag.value === 'Online') {
            sorter.sortByOnline(userElement, userList);
        } else if (sorterTag.value === 'Chat state') {
            sorter.sortByChatState(userElement, userList);
        } else  {
            userList.appendChild(userElement);
        }
    }
    
    function PanelOfUsers() {}

    PanelOfUsers.prototype.initPanelOfUsersElements = function initPanelOfUsersElements() {
        var closeButton = document.querySelector('#dashboard-close');
        sorterTag = document.querySelector('#dashboard-sorter');
        userList = document.querySelector('#dashboard-users-list');
        filterTag = document.querySelector('#dashboard-filter');

        sorterTag.addEventListener('change', function createSortedUserList() {
            removeChildren(userList);
            Object.keys(usersObject).forEach(function appendEachUser(key) {
                addUser(usersObject[key], key);
            });
        });

        filterTag.addEventListener('keyup', function useFilter() {
            filter.filterUsers(document.querySelector('#dashboard-filter').value, userList.childNodes);
        }); 

        closeButton.addEventListener('click', function hideOperatorPanel() {
            document.querySelector('#dashboard-work-place').hidden = true;
            document.querySelector('#dashboard-picture').hidden = false;
        });

        userList.addEventListener('click', selectUser);
    }

    PanelOfUsers.prototype.createUserList = function createUserList() {
        var savedThis = this;
        connectionToDatabase.getListOfUsers().then(function addUsers(body) {
            usersObject = body;
            Object.keys(body).forEach(function appendEachUser(key) {
                addUser(body[key], key);
            });
        }).then(connectionToDatabase.subscribeToUsersChanges);
    }
    
    PanelOfUsers.prototype.updateUserList = function updateUserList(userListFromDB) {
        usersObject = userListFromDB;
        removeChildren(userList);
        Object.keys(userListFromDB).forEach(function addChanges(key) {
            addUser(userListFromDB[key], key);
        });
        filter.filterUsers(document.querySelector('#dashboard-filter').value, userList.childNodes);
    }

    return new PanelOfUsers();

})();