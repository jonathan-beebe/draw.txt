// # Box

// Class definition
Box = new Class({

  // Build off of the base DisplayObject
  Extends: DisplayObject,

  // Store our matrix of display information here
  m:null,

  // Default options for the box.
  height: 0,
  width: 0,
  char: '*',

  // A blankChar of `undefined` will render a transparent box.
  blankChar: undefined,

  // Should this shape be transparent of solid?
  solid: false,

  // Constructor
  initialize: function(props) {
    this.parent(props);
    this.width = props.width || 0;
    this.height = props.height || 0;
    this.char = props.char || '*';
    this.blankChar = props.blankChar || undefined;
    this.solid = props.solid || false;
    this.refresh();
  },

  // Refresh the box. Re-creates the matrix of display info.
  refresh: function() {
    if(this.solid) {
      this.blankChar = '&nbsp;';
    }
    else {
      this.blankChar = undefined;
    }
    this.m = new Matrix(this.width, this.height, this.blankChar);
  },

  getWidth: function() { return this.width; },

  getHeight: function() { return this.height; },

  // Update an option. This will cause a refresh.
  updateOption: function(key, val) {
    this[key] = val;
    this.refresh();
  },

  // Hit Test the box given a click-point.
  hitTest: function(pt) {

    // Calculate the bounds of this box
    var top = this.getY(),
        right = this.getX() + this.getWidth(),
        bottom = this.getY() + this.getHeight(),
        left = this.getX(),
        hit = false;

    // Is the point within the bounds, inclusive?
    if(pt.x >= left && pt.x < right &&
        pt.y >= top && pt.y < bottom) {
      hit = true;
    }

    return hit;

  },

  // Draw the box.
  // Will render the matrix so it's fit for displaying.
  draw: function() {

    var a = this.m.getArray();

    // Create the top and bottom sides
    for(var i = 0; i < this.width; i++) {

      // Set the top characters
      a[0][i] = this.char;

      // Set the bottom characters
      a[this.height-1][i] = this.char;
    }

    // Create the left and right sides
    for(var i = 0; i < this.height; i++) {

      // Set the left-side characters
      a[i][0] = this.char;

      // Set the right-side characters
      a[i][this.width-1] = this.char;
    }

    return a;
  },

  // Get the character at a specific location
  charAt: function(pt) {
    if(this.m) {
      var a = this.m.getArray();
      return a[pt.x][pt.y];
    }
    return null;
  }

});

// This is experimental code here...nothing to see...
/* Utilities.enhanceWithGettersAndSetters(Box.prototype); */