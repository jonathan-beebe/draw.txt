// Text Edit Command
// =================

// Edit the textual content of a Text Display Object
TextEditCommand = new Class({

  Implements: ICommand,

  // The target DisplayObject to be edited.
  target: null,

  // The text string prior to applying this command.
  originalText: null,

  // The new text string to apply using this command.
  newText: null,

  // Constructor
  initialize: function() {},

  setOriginalText: function(val) {
    this.originalText = val;
  },

  setNewText: function(val) {
    this.newText = val;
  },

  execute: function() {
    this.target.setText(this.newText);
  },

  revert: function() {
    this.target.setText(this.originalText);
  },

  toString: function() {
    return '{name: TextEdit, originalText: "' + this.originalText +
           '", newText: "' + this.newText + '"}';
  }

});