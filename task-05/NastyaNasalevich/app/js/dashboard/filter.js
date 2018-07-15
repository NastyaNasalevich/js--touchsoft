/* exported filter */

var filter = (function createFilter() {

    function Filter() {}

    Filter.prototype.filterUsers = function filterUsers(value, usersArray) {
        var filterValue = value.toLowerCase();
    
        if (filterValue === '') {
            return;
        }
    
        usersArray.forEach(function hideAllUsers(userContainer) {
            userContainer.hidden = false;
        });
    
        usersArray.forEach(function hideExcessUsers(userContainer) {
          if (userContainer.getElementsByClassName('user-name-element')[0]
              .innerHTML.toLowerCase()
              .lastIndexOf(filterValue) === -1
          ) {
            userContainer.hidden = true;
          }
        });
    }

    return new Filter();

})();