// Create Command
// ==============

// Create a new DisplayObject.
CreateCommand = new Class({

  Implements: ICommand,

  // The target DisplayObject to be created on execute, removed on revert.
  target: null,

  // Constructor
  initialize: function() {},

  // Add the target DisplayObject to the canvas.
  execute: function() {
    this.canvas.addChild(this.target);
  },

  // Remove the target DisplayObject from the canvas.
  revert: function() {
    this.canvas.removeChild(this.target);
  },

  toString: function() {
    return '{name: Create, target: ' + this.target.toString() + '}';
  }

});