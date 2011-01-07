// Rearrange Command
// =================

// Swap two DisplayObjects
ArrangeSwapCommand = new Class({

  Implements: ICommand,

  // Store the beginning depths of the target DisplayObjects
  beginDepths: [],

  initialize: function(){},

  // Swap the two display objects to their new depths.
  execute: function() {
    this.canvas.swapChildren(this.beginDepths[0], this.beginDepths[1]);
  },

  // Place the target DisplayObjects at original depth.
  revert: function(target) {
    this.canvas.swapChildren(this.beginDepths[1], this.beginDepths[0]);
  },

  setBeginDepths: function(a) {
    this.beginDepths = a;
  },

  toString: function() {
    return '{name: ArrangeSwap, ptA: ' + this.beginDepths[0].toString() +
           ', ptB: ' + this.beginDepths[1].toString() + '}';
  }

});