// # Create Command

// Create a new DisplayObject.
CreateCommand = new Class({

  Implements: Command,

  // The canvas we will add to and remove from.
  canvas: null,

  // The target DisplayObject to be created on execute, removed on revert.
  target: null,

  // Constructor
  initialize: function() {},

  setCanvas: function(val) {
    this.canvas = val;
  },

  setTarget: function(val) {
    this.target = val;
  },

  // Add the target DisplayObject to the canvas.
  execute: function() {

    // Add the shape to the display list of the canvas.
    this.canvas.addChild(this.target);

    // DRAW!
    this.canvas.draw();

  },

  // Remove the target DisplayObject from the canvas.
  revert: function() {

    // remove the shape from the display list of the canvas.
    this.canvas.removeChild(this.target);

    // DRAW!
    this.canvas.draw();

  }

});