// # Display Object

// Base display object for all objects drawn into the canvas
DisplayObject = new Class({

  name: '',

  // Left coordinate.
  x: 0,

  // Top coordinate.
  y: 0,

  // Constructor
  initialize: function(params) {
    this.x = params.x || 0;
    this.y = params.y || 0;
  },

  setName: function(val) { this.name = val; },
  getName: function() { return this.name; },

  getX: function() { return this.x; },

  getY: function() { return this.y; },

  setPosition: function(pt) {
    this.x = pt.x;
    this.y = pt.y;
  },

  getPosition: function() {
    return new Point(this.x, this.y);
  },

  edit: function(){},

  refresh: function(){},

  // Interface for the hitTest method.
  // Must test if a point 'hits' this object.
  hitTest: function(pt) {
    throw 'Display Objects must implement the hitTest method';
  },

  // Interface for the draw method.
  // Must return an array of characters fit for display to user.
  draw: function() {
    throw 'Display Objects must implement the hitTest method';
  }

});