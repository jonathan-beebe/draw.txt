
// Let's define a console if none exist so those pesky debug statements don't
// cause errors when Firebug is not open.
if (!console) {
    var console = { log:function() {} };
}

function openCallback(input) {
  console.log('openCallback: ', input);
}

function saveCallback() {
  console.log('saveCallback');
  var txt = controller.getTextForSaving();
  console.log('save text = ', txt);
  return txt;
}


// Init our application when the dom is ready.
window.addEvent('domready', function() {

  controller = new Controller('#canvas', '#grid', '#toolbar');

  var config = new FileDialogsConfig();
  config.width = 45;
  config.height = 16;
  config.padding = 5;
  config.open.image = "images/folder_page_white.png";
  config.open.handler = "openCallback";
  config.save.image = "images/page_save.png";
  config.save.handler = "saveCallback";
  
  new FileDialogs("openClosePlaceholder", config);

});
