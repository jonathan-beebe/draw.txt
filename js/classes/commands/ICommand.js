// Command Interface
// =================

// The base command class.
// All specific commands should implement this interface.
//
// * Expects a `DisplayObject` as its target. 
// * Implements an `execute` method to apply the command, and
// * implements a `revert` method to undo the command.
ICommand = new Class({

  // The target DisplayObject to apply this command to.
  target: null,

  // The canvas where DisplayObjects are drawn.
  // Here for convenience. Not all commands require this.
  canvas: null,

  // Constructor
  initialize: function() {},

  // Override this method in child classes
  // Set the target to its original state before this command was applied.
  revert: function() {
    throw "Command classes must implement the 'revert' method";
  },

  // Override this method in child classes
  // Apply command -- target will be in new state after changes applied.
  execute: function() {
    throw "Command classes must implement the 'execute' method";
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

  // Override toString this for debugging of commands.
  toString: function() {
    throw "Command classes must implement their own toString methods";
  }

});
