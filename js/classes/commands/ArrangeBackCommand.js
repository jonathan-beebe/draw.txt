// Arrange to Back Command
// =======================

// Send a DisplayObject to the back of the display list
ArrangeBackCommand = new Class({

  Implements: ICommand,

  // The depth of DisplayObject prior to applying this command.
  // We don't need to store the new depth because we know it'll be the bottom
  // of the display list array -- 0
  originalDepth: null,

  initialize: function(){},

  // Move the target to the new depth.
  execute: function() {

    // This command does not require you to set the target manually. If you've
    // set the original depth we can grab the target located there.
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