DeleteCommand = new Class({

  Implements: Command,

  // The canvas we will add to and remove from.
  canvas: null,

  targetIndex: null,

  initialize: function(){},

  setCanvas: function(val) {
    this.canvas = val;
  },

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
  }

});