ArrangeFrontCommand = new Class({

  Implements: Command,

  // The canvas we will add to and remove from.
  canvas: null,

  originalDepth: null,

  initialize: function(){},

  setCanvas: function(val) {
    this.canvas = val;
  },

  // Move the target to the new depth.
  execute: function() {
    var child = this.canvas.removeChildAt(this.originalDepth);
    this.canvas.addChild(child);
  },

  // Place the target object back in its original depth.
  revert: function(target) {
    var child = this.canvas.removeChildAt(this.canvas.count()-1);
    this.canvas.addChildAt(child, this.originalDepth);
  },

  setOriginalDepth: function(val) {
    this.originalDepth = val;
  }

});