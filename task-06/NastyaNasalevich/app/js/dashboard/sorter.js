/* exported sorter */

var sorter = (function createSorter() {

    function Sorter() {}

    Sorter.prototype.sortByUserName = function sortByUserName(userElement, userList) {
        var lastElement = true;
        var newUserElementName = userElement.querySelector('.user-name-element').innerHTML;
        var i;
    
        for (i = 0; i < userList.childNodes.length; i++) {
            if (newUserElementName <= userList.childNodes[i].querySelector('.user-name-element').innerHTML) {
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
        var newUserElementStatus = userElement.querySelector('.user-status-element').innerHTML;
    
        if (newUserElementStatus === 'online') {
            userList.insertBefore(userElement, userList.firstChild);
        } else {
            userList.appendChild(userElement);
        }

    }
    
    Sorter.prototype.sortByChatState = function sortByChatState(userElement, userList) {
        var newUserElementChatState = userElement.querySelector('.chat-state-element').innerHTML;

        if(newUserElementChatState === '[ ]') {
            userList.insertBefore(userElement, userList.firstChild);
        } else {
            userList.appendChild(userElement);
        }
        
    }

    return new Sorter();

})();