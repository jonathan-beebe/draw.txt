DeleteCommand = new Class({

  Implements: ICommand,

  targetIndex: null,

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