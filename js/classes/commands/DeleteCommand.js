// Delete Command
// ==============

// Remove a DisplayObject from the display list.
DeleteCommand = new Class({

  Implements: ICommand,

  // The index where target DisplayObject lived prior to deletion
  targetIndex: null,

  // Constructor
  initialize: function(){},

  setTargetIndex: function(val) {
    this.targetIndex = val;
  },

  // Remove the target from the canvas
  execute: function() {
    this.canvas.removeChildAt(this.targetIndex);
  },

  // Place target back in the display list
  revert: function(target) {
    this.canvas.addChildAt(this.target, this.targetIndex);
  },

  toString: function() {
    return '{name: Delete, target: ' + this.target.toString() + '}';
  }

});