// # Command Interface

// The base command class.
// All specific commands should implement this interface.
ICommand = new Class({

  // The target DisplayObject to apply this command to.
  target: null,

  // The canvas we will add to and remove from.
  canvas: null,

  // Constructor
  initialize: function() {},

  // Override the before method in child classes
  // Set the target to its original state before this command was applied.
  revert: function() {
    throw "Command classes must implement the 'before' method";
  },

  // Override the after method in child classes
  // Apply command -- target will be in new state after changes applied.
  execute: function() {
    throw "Command classes must implement the 'after' method";
  },

  setTarget: function(val) {
    this.target = val;
  },

  getTarget: function() {
    return this.target;
  },

  setCanvas: function(val) {
    this.canvas = val;
  },

  toString: function() {
    throw "Command classes must implement their own toString methods";
  }

});