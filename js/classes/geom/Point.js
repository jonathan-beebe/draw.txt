// Point
// =====

// A very basic point class
Point = new Class({

  // x coordinate value
  x: 0,

  // y coordinate value
  y: 0,

  // Constructor
  initialize: function(x, y) {
    this.x = x || 0;
    this.y = y || 0;
  },

  // Test the equality of this point to the input point.
  equals: function(pt) {
    return (this.x === pt.x && this.y === pt.y);
  },

  // Render to string
  toString: function() {
    return '{x:' + this.x + ', y:' + this.y + '}';
  }

});