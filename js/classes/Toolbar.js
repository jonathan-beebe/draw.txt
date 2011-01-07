Toolbar = new Class({

  // Our toolbar element
  elem: null,

  // Constructor
  initialize: function(selector) {

    // Find our toolbar element
    this.elem = $$(selector);

    // Listen to a click on our toolbar...
    this.elem.addEvent('click', this.whenClick.bind(this));
  },

  // Add event listeners to the toolbar element en masse.
  listen: function(events) {
    Object.each(events, function(callback, eventType, object) {
      this.elem.addEvent(eventType, callback);
    }, this);
  },

  // Respond to the user clicking on our toolbar
  whenClick: function(e) {

    // If the user clicked on one of the images then
    // dispatch the correct tool event
    if(e.target.nodeName.toLowerCase() === 'div') {
      this.elem.fireEvent(e.target.id);
    }
  }

});