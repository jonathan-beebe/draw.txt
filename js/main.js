
// Let's define a console if none exists so those pesky debug statements don't
// cause errors when Firebug is not open.
if (!console) {
  var console = { log:function() {} };
}


// Init our application when the dom is ready.
window.addEvent('domready', function() {

  controller = new Controller('#canvas', '#grid', '#toolbar');

});
