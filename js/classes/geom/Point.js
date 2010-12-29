// # Point

// A very basic point class
Point = new Class({

  // x coordinate value
  x: 0,

  // y coordinate value
  y: 0,

  // constructor
  initialize: function(x, y) {
    this.x = x || 0;
    this.y = y || 0;
  },

  equals: function(pt) {
    return (this.x === pt.x && this.y === pt.y);
  },

  // Render to string
  toString: function() {
    return '{x:' + this.x + ', y:' + this.y + '}';
  }

});