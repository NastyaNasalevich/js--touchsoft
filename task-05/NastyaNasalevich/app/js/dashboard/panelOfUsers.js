/* exported panelOfUsers */
/* global filter */
/* global sorter */
/* global operatorsChat */
/* global removeChildren */
/* global sendRequestToDatabase */


var panelOfUsers = (function createpanelOfUsers() {
    var userList;
    var sorterTag;
    var filterTag;
    var selectUserId;
    
    function addUser(userBody, userId) {

        var userElement = document.createElement('div');
        var userNameElement = document.createElement('div');
        var userStatusElement = document.createElement('div');
        var chatStateElement = document.createElement('div');
        userNameElement.classList.add('user-name-element');
        userStatusElement.classList.add('user-status-element');
        chatStateElement.classList.add('chat-state-element');
    
        userNameElement.innerHTML = userBody.userName ? userBody.userName : 'Anonymous';
    
        if (userBody.isChatHidden) {
            chatStateElement.innerHTML = ' - ';
        } else {
            chatStateElement.innerHTML = '[ ]';
        }
    
        if (!userBody.isRead) {
            userNameElement.classList.add('unread-state');
        }
        
        if (new Date() - new Date(userBody.lastMessageDate) <= 600000) {
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
    
        userElement.addEventListener('click', function readMessages() { 
            selectUserId = userId;
            operatorsChat.openChat(userId);
            document.getElementById('active').innerHTML = 'Active:   ' + userNameElement.innerHTML;
            userNameElement.classList.add('read-state');
        });
    }
    
    function PanelOfUsers() {}

    PanelOfUsers.prototype.initPanelOfUsersElements = function initPanelOfUsersElements() {
        var closeButton = document.getElementById('dashboard-close');
        sorterTag = document.getElementById('dashboard-sorter');
        userList = document.getElementById('dashboard-users-list');
        filterTag = document.getElementById('dashboard-filter');

        sorterTag.addEventListener('change', function createSortedUserList() {
            removeChildren(userList);
            panelOfUsers.createUserList();
        });

        filterTag.addEventListener('keyup', function useFilter() {
            filter.filterUsers(document.getElementById('dashboard-filter').value, userList.childNodes);
        }); 

        closeButton.addEventListener('click', function hideOperatorPanel() {
            document.getElementById('dashboard-work-place').hidden = true;
            document.getElementById('dashboard-picture').hidden = false;
        
        });
    }

    PanelOfUsers.prototype.createUserList = function createUserList() {
        sendRequestToDatabase('GET', 'users/', '').then(function addUsers(body) {
            Object.keys(body).forEach(function appendEachUser(key) {
              addUser(body[key], key);
            });
        });
    }

    PanelOfUsers.prototype.updateUserList = function updateUserList() {
        sendRequestToDatabase('GET', 'users/', '').then(function updateChanges(body) {
            removeChildren(userList);
            Object.keys(body).forEach(function addChanges(key) {
                addUser(body[key], key);
                if (selectUserId) { 
                    operatorsChat.addHistoryToPage(selectUserId);
                }
            });
        })
        .then(function setFilter() {
            filter.filterUsers(document.getElementById('dashboard-filter').value, userList.childNodes);
        });
    }

    return new PanelOfUsers();

})();