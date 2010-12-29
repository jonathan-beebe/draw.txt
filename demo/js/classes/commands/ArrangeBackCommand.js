ArrangeBackCommand = new Class({

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
    console.log('executing ArrangeBack');
    var child = this.canvas.removeChildAt(this.originalDepth);
    this.canvas.addChildAt(child, 0);
  },

  // Place the target object back in its original depth.
  revert: function(target) {
    console.log('reverting ArrangeBack, ' + this.originalDepth);
    console.log(this.canvas.count());
    var child = this.canvas.removeChildAt(0);
    console.log(this.canvas.count());
    this.canvas.addChildAt(child, this.originalDepth);
    console.log(this.canvas.count());
  },

  setOriginalDepth: function(val) {
    this.originalDepth = val;
  }

});