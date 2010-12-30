ArrangeSwapCommand = new Class({

  Implements: ICommand,

  beginDepths: [],

  initialize: function(){},

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
  },

  toString: function() {
    return '{name: ArrangeSwap, ptA: ' + this.beginDepths[0].toString() +
           ', ptB: ' + this.beginDepths[1].toString() + '}';
  }

});