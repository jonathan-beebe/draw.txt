// # Display Object

// Base display object for all objects drawn into the canvas
DisplayObject = new Class({

  name: '',

  type: 'DisplayObject',

  // Left coordinate.
  x: 0,

  // Top coordinate.
  y: 0,

  // Constructor
  initialize: function(props) {
    this.x = props.x || 0;
    this.y = props.y || 0;
  },

  setName: function(val) { this.name = val; },
  getName: function() { return this.name; },

  getX: function() { return this.x; },

  getY: function() { return this.y; },

  getType: function() { return this.type; },

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

  toString: function() {
    throw 'Display Objects must implement their own toString method';
  },

  // Render the object's properties to json so it can be saved.
  toJSON: function() {
    throw 'Display Objects must implement their own toJSON method';
  },

  // Re-create the object from the json created from the toJSON method.
  fromJSON: function() {
    throw 'Display Objects must implement their own fromJSON method';
  },

  // Interface for the draw method.
  // Must return an array of characters fit for display to user.
  draw: function() {
    throw 'Display Objects must implement the hitTest method';
  }

});

DisplayObjectFactory = (function(props) {

  var createDisplayObject = function(props) {
    if(props.type) {
      switch(props.type) {

      case 'Box':
        return new Box(props);
      break;

      case 'Text':
        return new Text(props);
      break;

      default: throw 'Could not find display object type "' + props.type + '"';
      break;

      }
    }
  };

  return {create: createDisplayObject};

})();