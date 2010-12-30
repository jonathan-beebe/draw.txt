// Move Command
// ------------

// Move a display object.
MoveCommand = new Class({

  Implements: ICommand,

  // The original location.
  ptA: null,

  // The new location.
  ptB: null,

  // Constructor
  initialize: function() {},

  // Move the target to the new location.
  execute: function() {
    this.target.setPosition(this.ptB);
    this.target.refresh();
  },

  // Place the target object back in its original location.
  revert: function(target) {
    this.target.setPosition(this.ptA);
    this.target.refresh();
  },

  // Set the original location of the target.
  setBeginPoint: function(val) {
    this.ptA = val;
  },

  // Set the new location of the target.
  setEndPoint: function(val) {
    this.ptB = val;
  },

  toString: function() {
    return '{name: Move, ptA: ' + this.ptA.toString() +
           ', ptB: ' + this.ptB.toString() + '}';
  }

});