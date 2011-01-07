// Character Grid Class
// ====================

// A two-dimensional array, or grid, for storing a matrix of characters.
var CharacterGrid = new Class({

  // Main array holding rows, or arrays of characters (lines of text)
  a: [],

  // The width of the grid of characters.
  w: 0,

  // The height of the grid of characters.
  h: 0,

  // Default character for empty cells in the grid.
  char: undefined,

  // Constructor
  initialize: function(w, h, char) {
    this.w = w;
    this.h = h;
    this.char = char;
    this.create();
  },

  reset: function(fillWith) {
    this.create();
  },

  // Create an empty grid. Fill all cells with the default character.
  create: function() {
    this.a = Array(this.h);
    this.fill();
  },

  // Fill the entire grid with a single character, useful for clearing the grid.
  fill: function(c) {
    c = c || this.char;
    for(var y = 0; y < this.h; y++) {
      this.a[y] = new Array(this.w);
      for(var x = 0; x < this.w; x++ ) {
        this.a[y][x] = this.char;
      }
    }
  },

  getArray: function() {
    return this.a;
  },

  toString: function() {
    var t = '';
    Array.each(this.a, function(item, index, object) {
      t += item.join('') + '<br/>';
    }, this);
    return t;
  }

});
