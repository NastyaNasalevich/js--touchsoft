/* exported filter */

var filter = (function createFilter() {

    function Filter() {}

    Filter.prototype.filterUsers = function filterUsers(value, usersArray) {
        var filterValue = value.toLowerCase();
    
        usersArray.forEach(function hideAllUsers(userContainer) {
            userContainer.hidden = false;
        });
    
        usersArray.forEach(function hideExcessUsers(userContainer) {
          if (userContainer.querySelector('.user-name-element')
              .innerHTML.toLowerCase()
              .lastIndexOf(filterValue) === -1
          ) {
            userContainer.hidden = true;
          }
        });
    }

    return new Filter();

})();