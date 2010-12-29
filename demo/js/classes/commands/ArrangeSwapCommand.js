ArrangeSwapCommand = new Class({

  Implements: Command,

  // The canvas we will add to and remove from.
  canvas: null,

  beginDepths: [],

  initialize: function(){},

  setCanvas: function(val) {
    this.canvas = val;
  },

  // Move the target to the new depth.
  execute: function() {
    this.canvas.swapChildren(this.beginDepths[0], this.beginDepths[1]);
  },

  // Place the target object back in its original depth.
  revert: function(target) {
    this.canvas.swapChildren(this.beginDepths[1], this.beginDepths[0]);
  },

  setBeginDepths: function(a) {
    this.beginDepths = a;
  }

});