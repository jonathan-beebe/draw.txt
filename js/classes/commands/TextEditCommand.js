// # Text Edit Command

// Edit the textual content of a Text Display Object
TextEditCommand = new Class({

  Implements: Command,

  // The target DisplayObject to be edited.
  target: null,

  originalText: null,

  newText: null,

  // Constructor
  initialize: function() {},

  setTarget: function(val) {
    this.target = val;
  },

  setOriginalText: function(val) {
    this.originalText = val;
  },

  setNewText: function(val) {
    this.newText = val;
  },

  // Add the target DisplayObject to the canvas.
  execute: function() {
    this.target.setText(this.newText);
  },

  // Remove the target DisplayObject from the canvas.
  revert: function() {
    this.target.setText(this.originalText);
  }

});