ArrangeBackCommand = new Class({

  Implements: ICommand,

  originalDepth: null,

  initialize: function(){},

  // Move the target to the new depth.
  execute: function() {

    if(!this.target) {
      this.target = this.canvas.getChildAt(this.originalDepth);
    }

    this.canvas.removeChild(this.target);
    this.canvas.addChildAt(this.target, 0);
  },

  // Place the target object back in its original depth.
  revert: function(target) {
    this.canvas.removeChild(this.target);
    this.canvas.addChildAt(this.target, this.originalDepth);
  },

  setOriginalDepth: function(val) {
    this.originalDepth = val;
  },

  toString: function() {
    return '{name: ArrangeBack, originalDepth: ' + this.originalDepth +
           ', target: ' + this.target.toString() + '}';
  }

});