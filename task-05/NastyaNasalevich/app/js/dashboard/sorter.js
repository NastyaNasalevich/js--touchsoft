/* exported sorter */

var sorter = (function createSorter() {

    function Sorter() {}

    Sorter.prototype.sortByUserName = function sortByUserName(userElement, userList) {
        var lastElement = true;
        var newUserElementName = userElement.getElementsByClassName('user-name-element')[0].innerHTML;
        var i;
    
        for (i = 0; i < userList.childNodes.length; i++) {
            if (newUserElementName <= userList.childNodes[i].getElementsByClassName('user-name-element')[0].innerHTML) {
                userList.insertBefore(userElement, userList.childNodes[i]);
                lastElement = false;
                break;
            }
        }
    
       if(lastElement) {
            userList.appendChild(userElement);
       }
    }
    
    Sorter.prototype.sortByOnline = function sortByOnline(userElement, userList) {
        var lastElement = true;
        var newUserElementStatus = userElement.getElementsByClassName('user-status-element')[0].innerHTML;
        var i;
    
        for (i = 0; i < userList.childNodes.length; i++) {
            if (newUserElementStatus === 'online') {
                userList.insertBefore(userElement, userList.childNodes[i]);
                lastElement = false;
                break;
            }
        }
    
        if (lastElement) {
            userList.appendChild(userElement);
        }
    }
    
    Sorter.prototype.sortByChatState = function sortByChatState(userElement, userList) {
        var lastElement = true;
        var newUserElementChatState = userElement.getElementsByClassName('chat-state-element')[0].innerHTML;
        var i;
    
        for(i = 0; i < userList.childNodes.length; i++) {
            if(newUserElementChatState === '[ ]') {
                userList.insertBefore(userElement, userList.childNodes[i]);
                lastElement = false;
                break;
            }
        }
    
        if(lastElement) {
            userList.appendChild(userElement);
        }
    }

    return new Sorter();

})();