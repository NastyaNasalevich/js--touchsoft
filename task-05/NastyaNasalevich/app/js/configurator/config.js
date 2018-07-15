/* exported config */

var config = (function config() {

  var elementsId = [
    'config-title', 'config-botName', 'config-url', 'config-cssClass', 'config-position', 'config-allowMinimize', 
    'config-allowDrag', 'config-requireName', 'config-showDate', 'config-xhr', 'config-fetch', 'config-resultScript'
  ];
  
  var chatSetup = {};
  
  function getRequestValue(){
    var requestType;
  
    if(chatSetup['config-xhr'].checked) {
      requestType = "XHR'";
    } else {
      requestType = "fetch'";
    }
    
    return requestType;
  }
  
  function createChatScript(){
    chatSetup['config-resultScript'].innerHTML = "&ltscript src='https://rawgit.com/NastyaNasalevich/js--touchsoft/task-02/NastyaNasalevich/my.js?" +  
    "'title='" + chatSetup['config-title'].value  +
    "'&botName='" + chatSetup['config-botName'].value + 
    "'&chatUrl='" + chatSetup['config-url'].value +
    "'&cssClass='" + chatSetup['config-cssClass'].value + 
    "'&position='" + chatSetup['config-position'].value + 
    "'&allowMinimize='" + chatSetup['config-allowMinimize'].checked + 
    "'&allowDrag='" + chatSetup['config-allowDrag'].checked + 
    "'&showDateTime='" + chatSetup['config-showDate'].checked + 
    "'&requireName='" + chatSetup['config-requireName'].checked + 
    "'&requests='" + getRequestValue() +
    "&gt&lt/script&gt";
   }
  
   function Config() {}
  
   Config.prototype.createPage = function createPage(){
    elementsId.forEach(function changeScript(e) {
      chatSetup[e] = document.getElementById(e);
      chatSetup[e].addEventListener('input', createChatScript)
    });
    createChatScript();
  };
  
  return new Config();

})();