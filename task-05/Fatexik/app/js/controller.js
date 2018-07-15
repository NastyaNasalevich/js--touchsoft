/* global dashboardUpdateList chatConfig chatConfig aboutMe */
function handlerUrl(url, oldUrl) {
    var workSpace = document.getElementById("workSpace");
    var newElem;
    var oldElem;
    if (url.includes("dashboard")) {
        oldElem = document.getElementById("createdElem");
        newElem = dashboardUpdateList.createDashboard();
        workSpace.replaceChild(newElem, oldElem);
        dashboardUpdateList.updateUserList();
    }
    if (url.includes("configFile")) {
        oldElem = document.getElementById("createdElem");
        newElem = chatConfig.createConfig();
        workSpace.replaceChild(newElem, oldElem);
        chatConfig.setFunctionalConfig().updateConfig();
        if (oldUrl.includes("dashboard")) {
            dashboardUpdateList.closeConnection();
        }
    }
    if (url.includes("aboutMe")) {
        oldElem = document.getElementById("createdElem");
        newElem = aboutMe.createAbout();
        workSpace.replaceChild(newElem, oldElem);
        if (oldUrl.includes("dashboard")) {
            dashboardUpdateList.closeConnection();
        }
    }
}

window.addEventListener("hashchange", function hashChange(ev) {
    handlerUrl(ev.newURL, ev.oldURL);
});
window.onload = function onload() {
    handlerUrl(window.location.href);
    document.getElementById("dashboard").addEventListener("click", function update(ev) {
        var url = ev.target.getAttribute("href");
        ev.preventDefault();
        window.location.hash = url;
    });
    document.getElementById("config").addEventListener("click", function update(ev2) {
        var url = ev2.target.getAttribute("href");
        ev2.preventDefault();
        window.location.hash = url;
    });

    document.getElementById("aboutMe").addEventListener("click", function update(ev3) {
        var url = ev3.target.getAttribute("href");
        ev3.preventDefault();
        window.location.hash = url;
    })
};
