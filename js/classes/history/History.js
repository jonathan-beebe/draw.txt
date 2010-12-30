// # History

// The History class for storing the user's actions in time.
// Paired with the Command class, it provides for a basic undo/redo system.
History = new Class({

  Implements: [Options, Events],

  // Options? Not used yet...they're optional!
  options: {},

  // Array of actions
  stack: [],

  // Current position within history. This is incremented/decremented as
  // undo/redo move through the history.
  pos: 0,

  // Constructor
  initialize: function(options) {
    this.setOptions(options);
  },

  // Undo the previous action.
  undo: function() {
    if(this.pos > 0) {
      var c = this.stack[this.pos-1];
      c.revert.call(c);
      this.pos--;
      this.fireEvent('undo');
    }
  },

  // Redo the action at current position.
  redo: function() {
    if(this.pos <= this.stack.length-1) {
      var c = this.stack[this.pos];
      c.execute.call(c);
      this.pos++;
      this.fireEvent('redo');
    }
  },

  // Add a new command to the history.
  add: function(command) {

    // If we are not at the end of the history stack then the user has
    // undone some commands. Remove all commands past the current position.
    if(this.pos < (this.stack.length - 1)) {
      this.stack = this.stack.slice(0, this.pos);
    }

    // Add the new command to the history
    this.stack.push(command);
    this.pos++;

    return this;
  },

  execute: function() {
    this.stack[this.stack.length-1].execute();
    this.fireEvent('redo');
  },

  // Add event listeners to the canvas
  listen: function(events) {
    Object.each(events, function(callback, eventType, object) {
      this.addEvent(eventType, callback);
    }, this);
  },

  toString: function() {
    var s = '';

    this.stack.each(function(item, index, array) {
      s += item.toString() + "\n";
    });

    return s;
  }

});