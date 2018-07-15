/* exported aboutMe */
var aboutMe = (function about() {
    function createElem() {
        var newElem = document.createElement("div");
        newElem.id = "createdElem";
        newElem.innerHTML = '@@import about.html';
        return newElem;
    }
    return {
        createAbout : createElem
    }
})();