/* exported chatConfig */
var chatConfig = (function chatConfig() {
    var configValue = {
        chatTitle: "Chat",
        botName: "Bot",
        chatUrl: "https://touchsoft-fatexik.firebaseio.com/",
        chatClass: "../CSS/styles.css",
        chatPosition: false,
        allowMinimize: false,
        drag: false,
        requireName: false,
        showTime: false,
        network: "XHR"
    };

    var chatConfigApi;

    function update() {
        var codeArea = document.getElementById("generate_code");
        codeArea.innerText = "<script type=\"text/javascript\" src=\"../JS/Chat.js\"></script>\n" +
            "<script type=\"text/javascript\">" +
            "setConfig({\n" +
            "    title: \"" + configValue.chatTitle + "\",\n" +
            "    name: \"" + configValue.botName + "\",\n" +
            "    url: \"" + configValue.chatUrl + "\",\n" +
            "    CSS: \"" + configValue.chatClass + "\",\n" +
            "    positionLeft:" + configValue.chatPosition + ",\n" +
            "    allowMinimize:" + configValue.allowMinimize + ",\n" +
            "    drag: " + configValue.drag + ",\n" +
            "    requireName: " + configValue.requireName + ",\n" +
            "    showTime: " + configValue.showTime + ",\n" +
            "    network: \"" + configValue.network + "\",\n" +
            "    userName: \"\",\n" +
            "    collapsed: true\n" +
            "}</script>";
        return this;
    }

    function setFunctional() {
        var chatTitleElem = document.getElementById("chatTitle");
        var botName = document.getElementById("botName");
        var chatUrl = document.getElementById("chatUrl");
        var chatClass = document.getElementById("chatClass");
        var chatPositionSelect = document.getElementById("chatPositionSelect");
        var allowMinimize = document.getElementById("allowMinimize");
        var allowDrag = document.getElementById("allowDrag");
        var requireName = document.getElementById("requireName");
        var showTime = document.getElementById("showTime");
        var XHR = document.getElementById("networkRadioXHR");
        var fetch = document.getElementById("networkRadioFetch");
        XHR.addEventListener("change", function setListener() {
            configValue.network = XHR.value;
            update();
        });
        fetch.addEventListener("change", function setListener() {
            configValue.network = fetch.value;
            update();
        });
        chatTitleElem.addEventListener("change", function setListener() {
            configValue.chatTitle = chatTitleElem.value;
            update();
        });
        botName.addEventListener("change", function setListener() {
            configValue.botName = botName.value;
            update();
        });
        chatUrl.addEventListener("change", function setListener() {
            configValue.chatUrl = chatUrl.value;
            update();
        });
        chatClass.addEventListener("change", function setListener() {
            configValue.chatClass = chatClass.value;
            update();
        });
        chatPositionSelect.addEventListener("change", function setListener() {
            var position = chatPositionSelect.value;
            if (position === "Left") {
                configValue.chatPosition = true;
            }
            else {
                configValue.chatPosition = false;
            }
            update();
        });
        allowMinimize.addEventListener("change", function setListener() {
            configValue.allowMinimize = allowMinimize.checked;
            update();
        });
        allowDrag.addEventListener("change", function setListener() {
            configValue.drag = allowDrag.checked;
            update();
        });
        requireName.addEventListener("change", function setListener() {
            configValue.requireName = requireName.checked;
            update();
        });
        showTime.addEventListener("change", function setListener() {
            configValue.showTime = showTime.checked;
            update();
        });
        return this;
    }

    function createConfig() {
        var newElem = document.createElement("div");
        newElem.id = "createdElem";
        newElem.innerHTML = '@@import config.html';
        return newElem;
    }

    chatConfigApi = {
        setFunctionalConfig: setFunctional,
        updateConfig: update,
        createConfig: createConfig
    };

    return chatConfigApi;
})();