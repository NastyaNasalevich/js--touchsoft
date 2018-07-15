/* global config */
/* global panelOfUsers */

(function routing() {

    function Router(routes) {
        this.routes = routes;
        this.init();
    }
    
    Router.prototype = {
        init: function init() {
            var arr = this.routes;
            
            window.addEventListener('hashchange', function f() {
                this.selectPath(this, arr);
            }.bind(this));
    
            this.selectPath(this, arr);
        },
        selectPath: function selectPath(options, arr){
            if (window.location.hash) {
                arr.forEach(function check(element) {
                    if(element.isActiveRoute(window.location.hash)) {
                        options.renderView(element.htmlName);
                    }
                });
            }
        },
        renderView: function renderView(htmlName) {
                fetch(
                    'https://rawgit.com/NastyaNasalevich/Templates-for-chat/master/' + htmlName
                ).then(function getResponse(response) {
                    return response.text();
                }).then(function getHTML(res) {
                    document.getElementById('main-body').innerHTML = res;
                }).then(function startCode() {
                    if (document.getElementById('config-resultScript')) {
                        config.createPage();
                    }
                    else if (document.getElementById('dashboard-users-list')) {
                        panelOfUsers.initPanelOfUsersElements();
                        panelOfUsers.createUserList();
                        setInterval(panelOfUsers.updateUserList, 5000);
                    }
                });
        }
    
    };
    
    function Route(name, htmlName) {
        this.name = name;
        this.htmlName = htmlName;
    }
    
    Route.prototype.isActiveRoute = function isActiveRoute(hashedPath) {
        return hashedPath.substr(1) === this.name;
    }
    
    return new Router([
        new Route('configurator', 'config.html'),            
        new Route('dashboard', 'dashboard.html'),
        new Route('about', 'about.html'),       
    ]);

})();