// Arrange to front Command
// ========================

// Send a DisplayObject to the front of the display list
ArrangeFrontCommand = new Class({

  Implements: ICommand,

  // The depth of DisplayObject prior to applying this command.
  // We don't need to store the new depth because we know it'll be the top
  // of the display list array.
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

    // The addChild method automatically inserts the DisplayObject at the top.
    this.canvas.addChild(this.target);
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
    return '{name: ArrangeFront, originalDepth: ' + this.originalDepth +
           ', target: ' + this.target.toString() + '}';
  }

});