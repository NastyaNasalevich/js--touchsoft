/* exported removeChildren */

function removeChildren(list) {

    while (list.lastChild) {
        list.removeChild(list.lastChild);
    }

}