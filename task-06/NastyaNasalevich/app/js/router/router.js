/* global config */
/* global panelOfUsers */

(function routing() {

    function Router(routes) {
        this.routes = routes;
        this.init();
    }

    Router.prototype = {
        init: function init() {
            
            window.addEventListener('hashchange', function f() {
                this.selectPath(this);
            }.bind(this));
    
            this.selectPath(this);
        },
        selectPath: function selectPath(options){
            if (window.location.hash) {
                options.routes.forEach(function check(element) {
                    if(element.isActiveRoute(window.location.hash)) {
                        options.renderView(element.htmlName);
                    }
                });
            }
        },
        renderView: function renderView(htmlName) {
            
            fetch(
                'https://cdn.rawgit.com/NastyaNasalevich/Templates-for-chat/f4705f89/' + htmlName
            ).then(function getResponse(response) {
                return response.text();
            }).then(function getHTML(res) {
                document.querySelector('#main-body').innerHTML = res;
            }).then(function startCode() {
                if (document.querySelector('#config-resultScript')) {
                    config.createPage();
                }
                else if (document.querySelector('#dashboard-users-list')) {
                    panelOfUsers.initPanelOfUsersElements();
                    panelOfUsers.createUserList();
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