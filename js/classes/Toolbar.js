// Toolbar Class
// =============

// Define a basic toolbar for managing buttons in app.
Toolbar = new Class({

  // Our toolbar element
  elem: null,

  // Constructor
  initialize: function(selector) {

    this.elem = $$(selector);

    // Listen to a click on our toolbar. The specific button clicked will be
    // identified in the event handler.
    this.elem.addEvent('click', this.whenClick.bind(this));
  },

  // Add event listeners to the toolbar element en masse.
  listen: function(events) {
    Object.each(events, function(callback, eventType, object) {
      this.elem.addEvent(eventType, callback);
    }, this);
  },

  // Respond to the user clicking on our toolbar. Identify the button clicked
  // dispatch the corresponding button event.
  whenClick: function(e) {
    if(e.target.nodeName.toLowerCase() === 'div') {
      this.elem.fireEvent(e.target.id);
    }
  }

});
