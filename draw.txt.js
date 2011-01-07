//     draw.txt
//     (c) 2011 Jon Beebe (somethingkindawierd@gmail.com)
//     draw.txt may be freely distributed under the MIT license.
//     For all details and documentation:
//     http://somethingkindawierd.github.com/draw.txt/

// Controller
// ==========

// The main controller for the application.
// I know, this file is a bit of a mess. It's been the catch-all for code before
// I decide where I want it to live.
Controller = new Class({

  // Bind all event listeners to this class instance
  Binds: [

          // *Grid Events*
          'whenMouseDown',
          'whenMouseUp',
          'whenMouseMove',
          'whenGridCancel',
          'whenGridDoubleClick',

          // *History Events*
          'whenHistoryChange',

          // *Canvas Events*
          'whenCanvasRefresh',

          // *Toolbar button events*
          'whenUndo',
          'whenRedo',
          'whenDelete',
          'whenEditMode',
          'whenPreviewMode',
          'whenMoveFront',
          'whenMoveUp',
          'whenMoveDown',
          'whenMoveBack',
          'whenOpen',
          'whenSave'
  ],

  // Class Properties
  // ----------------

  background: null,

  canvas: null,

  history: null,

  toolbar: null,

  overlay: null,

  localStorage: null,

  // Track user-actions
  dragging: false,

  // The command currently in-action
  command: null,

  // The first point of an action
  clickLocation: null,

  // Offset of point relative to target DisplayObject's origin
  clickOffset: null,




  // Initialization
  // --------------

  // Constructor
  initialize: function(foreground, background, toolbar) {

    this.grid = new Grid(background);

    this.toolbar = new Toolbar(toolbar);

    this.canvas = new Canvas(
        foreground,
        this.grid.getWidth(),
        this.grid.getHeight()
    );

    this.history = new History();

    // TODO: rework the use of overlays for setting artobject properties.
    this.overlay = new LightFace({
      width: 400,
      height: 200,
      draggable: true,
      title: 'Edit Text',
      content: '<p>This is the LightFace content!</p>',
      buttons: [
          { title: 'Ok', event:
            function() {
              var input = $$(this.messageBox).getChildren('textarea[name="text"]');
              var value = input[0][0].value;
              var mode = input[0].get('data-mode')[0];

              if(mode === 'new') {
                controller.createText(value);
              }
              else if(mode === 'edit') {
                controller.editText(value);
              }

              this.close();
            }, color: 'blue' },
          { title: 'Cancel', event: function() { this.close(); }, color: 'default' }
      ],
      resetOnScroll: true
    });

    this.initEvents();

    this.readLocalStorage();
  },

  // Initialize all event listeners
  initEvents: function() {

    this.canvas.listen({
      canvasRefresh: this.whenCanvasRefresh
    });

    this.grid.listen({
      mousedown: this.whenMouseDown,
      mouseup: this.whenMouseUp,
      mousemove: this.whenMouseMove,
      cancel: this.whenGridCancel,
      dblclick: this.whenGridDoubleClick
    });

    this.toolbar.listen({
      undo: this.whenUndo,
      redo: this.whenRedo,
      'delete': this.whenDelete,
      edit: this.whenEditMode,
      preview: this.whenPreviewMode,
      move_front: this.whenMoveFront,
      move_up: this.whenMoveUp,
      move_down: this.whenMoveDown,
      move_back: this.whenMoveBack,
      toggle_interface: this.whenToggleInterface,
      toggle_solid: this.whenToggleSolid,
      open: this.whenOpen,
      save: this.whenSave
    });

    this.history.listen({
      redo: this.whenHistoryChange,
      undo: this.whenHistoryChange
    });

  },

  // Read in settings from local storage
  readLocalStorage: function() {

    var st = new LocalStorage({debug:true}),
        theme = st.get('theme');

    if(theme) {
      $(document.body).addClass(theme);
    }

  },




  // Event Listeners
  // ---------------



  // ### History Events

  whenHistoryChange: function(e) {
    this.canvas.draw();
  },



  // ### General Interface events

  whenToggleSolid: function(e) {
    console.log('should toggle shapes to solid or transparent...');
  },

  whenToggleInterface: function(e) {
    var body = $(document.body),
        st = new LocalStorage({debug:true});

    if(body.hasClass('dark')) {
      console.log('removing dark...');
      body.removeClass('dark');
      st.set('theme', 'light');
    }
    else {
      console.log('adding dark...');
      body.addClass('dark');
      st.set('theme', 'dark');
    }
  },



  // ### Toolbar events

  whenEditMode: function() {
    $$('#right').addClass('hidden');
    $$('#left').removeClass('hidden');
  },

  whenPreviewMode: function() {
    $$('#right').removeClass('hidden');
    $$('#left').addClass('hidden');
  },

  whenDelete: function() {
    var c = new DeleteCommand();
    c.setCanvas(this.canvas);
    c.setTarget(this.canvas.getSelected());
    c.setTargetIndex(this.canvas.getIndexOfSelected());
    this.history.add(c).execute();
  },

  whenUndo: function() {
    this.history.undo();
  },

  whenRedo: function() {
    this.history.redo();
  },

  whenOpen: function() {

    var reply, lfs, fileContents;

    reply = prompt("Name of file to open:", "");

    if(reply && reply !== '') {

      lfs = this.getLocalStorage();
      fileContents = lfs.read(reply);

      if(fileContents) {
        if(this.canvas.fromJSON(fileContents)) {
          console.log('SUCCESS opening json!');
          this.history.clear();
          this.canvas.draw();
        }
      }

    }

  },

  whenSave: function() {

    var reply = prompt("Name of file to save:", "");

    if(reply && reply !== '') {
      var lfs = this.getLocalStorage();
      lfs.save(reply, this.canvas.toJSON());
    }

  },

  // TODO: for arrange commands, if already at to/bottom then do not perform command.
  whenMoveFront: function() {
    var indexA = this.canvas.getIndexOfSelected(),
        command = new ArrangeFrontCommand();

    command.setTarget(this.canvas.getSelected());
    command.setOriginalDepth(indexA);
    command.setCanvas(this.canvas);

    this.history.add(command).execute();
  },

  whenMoveUp: function() {
    var indexA = this.canvas.getIndexOfSelected();
        indexB = null,
        command = null;

    if(indexA !== null) { indexB = indexA + 1; }

    if(indexA !== null && indexB !== null) {
      command = new ArrangeSwapCommand();
      command.setCanvas(this.canvas);
      command.setBeginDepths([indexA, indexB]);
      this.history.add(command).execute();
    }
  },

  whenMoveDown: function() {
    var indexA = this.canvas.getIndexOfSelected();
        indexB = null,
        command = null;

    if(indexA !== null) { indexB = indexA - 1; }

    if(indexA !== null && indexB !== null) {
      command = new ArrangeSwapCommand();
      command.setCanvas(this.canvas);
      command.setBeginDepths([indexA, indexB]);
      this.history.add(command).execute();
    }
  },

  whenMoveBack: function() {
    var indexA = this.canvas.getIndexOfSelected(),
        command = new ArrangeBackCommand();

    command.setTarget(this.canvas.getSelected());
    command.setOriginalDepth(indexA);
    command.setCanvas(this.canvas);

    this.history.add(command).execute();
  },




  // ### Mouse events on the grid

  whenGridDoubleClick: function(grid, ptA) {

    // Did we hit an existing DisplayObject?
    var hit = this.canvas.hitTest(ptA);

    if(hit) {
      this.canvas.setSelected(hit);
      this.canvas.draw();

      // Store the offset of the click relative to the hit object's origin.
      this.clickOffset = new Point(ptA.x - hit.getX(), ptA.y - hit.getY());

      this.editShape(ptA, ptA);
    }

  },

  whenMouseDown: function(grid, ptA) {

    // Record the location of the click
    this.clickLocation = ptA;

    // Reset all action-tracking properties
    this.dragging = false;
    this.canvas.setSelected(null);
    this.command = null;

    // Did we hit an existing DisplayObject?
    var hit = this.canvas.hitTest(ptA);

    // If we hit an object then decide which action to perform on it.
    // Currently we only move it, but eventually we will be able to resize
    // it as well.
    if(hit) {
      this.canvas.setSelected(hit);
      this.canvas.draw();

      // Store the offset of the click relative to the hit object's origin.
      this.clickOffset = new Point(ptA.x - hit.getX(), ptA.y - hit.getY());
    }
  },

  whenMouseMove: function(grid, ptA, ptB) {

    // If we have not set the dragging flag, and the begin point &
    // current point are different, then we are dragging...
    if(!this.dragging && !ptA.equals(ptB)) {
      this.dragging = true;
    }

    // Are we dragging across empty space on the grid?
    if(this.dragging && !this.canvas.getSelected()) {

      // Draw the border of the dragged/selected area
      this.grid.markDraw(ptA, ptB);
    }

    // Are we moving an object?
    else if(this.canvas.getSelected()) {

      // We're moving an object! Create the move command and store the
      // original location of the box before repositioning it.
      if(!this.command) {
        this.beginMove();
      }

      this.continueMove(ptB);
    }
  },

  whenMouseUp: function(grid, ptA, ptB) {

    var newShape = null;

    // If we have no selection on the canvas...
    if(!this.canvas.getSelected()) {

      // If the user did not drag the mouse and did not hit existing art object...
      // We will create a text object.
      if(!this.dragging) {
        newShape = 'text';
      }

      // Otherwise, make a box.
      else {
        newShape = 'box';
      }

      this.createShape(newShape, ptA, ptB);

    }

    // We have a selection. Do we edit it?
    else {

      // Only edit if the mouse has moved during this operation.
      if(this.dragging) {
        this.editShape(ptA, ptB);
      }
    }

    grid.clearDraw();

    // Reset our action-tracking properties
    this.command = null;
    this.dragging = false;
  },

  whenGridCancel: function(grid) {
    grid.clearDraw();
  },



  // ### Canvas Events

  // Respond to the canvas refreshing it's contents.
  whenCanvasRefresh: function(canvas) {

    // Get the canvas contents as a text string.
    var txt = canvas.getText();

    // Show the text in the preview element.
    $$('#txt').set('value', this.cleanText(txt));
  },




  // Interact with the canvas
  // ------------------------

  // Catch-all for shape-edit actions.
  // Determine what the user is trying to do, and create/perform the command.
  editShape: function(ptA, ptB) {

    // If we have an existing command, work with it...
    if(this.command) {

      // If the begin and end point do not match then move the target object
      if(!ptA.equals(ptB)) {
        this.finalizeMove(ptA, ptB);
      }

    }

    // No existing command...create one.
    else {

      // If the user *did not* move their mouse when clicking...
      if(ptA.equals(ptB)) {

        // If it's text, open the text-editor.
        if(this.canvas.getSelected() instanceof Text) {
          this.getNewTextString(this.canvas.getSelected().getText(), 'edit');
        }

      }
    }
  },

  // Begins a move command.
  beginMove: function() {
    this.command = new MoveCommand();
    this.command.setTarget(this.canvas.getSelected());
    this.command.setBeginPoint(this.canvas.getSelected().getPosition());
  },

  // Move a dragged item as the user moves their mouse
  continueMove: function(ptB) {

    // Find the new location of the object by offsetting the most recent
    // mouse position by the previously recorded click-offset.
    var newLoc = new Point(ptB.x - this.clickOffset.x, ptB.y - this.clickOffset.y);

    // Tell the object we're moving where it's new location is.
    this.canvas.getSelected().setPosition(newLoc);

    // Redraw the canvas.
    this.canvas.draw();
  },

  // Finalize a move command
  finalizeMove: function(ptA, ptB) {
    // Find the new location of the object by offsetting the most recent
    // mouse position by the previously recorded click-offset.
    this.command.setEndPoint(new Point(ptB.x - this.clickOffset.x, ptB.y - this.clickOffset.y));
    this.history.add(this.command);
  },

  editText: function(string) {
    if(string && string !== this.canvas.getSelected().getText()) {

      var command = new TextEditCommand();
      command.setTarget(this.canvas.getSelected());
      command.setOriginalText(this.canvas.getSelected().getText());
      command.setNewText(string);
      this.history.add(command).execute();
    }
  },

  // Create a shape on the canvas
  createShape: function(type, ptA, ptB) {

    if(type === 'text') {
      this.getNewTextString('New Text', 'new');
    }
    else if(type === 'box') {
      this.createBox(ptA, ptB);
    }

  },

  createText: function(string) {

    var props, text;

    if(string) {
      props = {
        x: this.clickLocation.x,
        y: this.clickLocation.y
      };

      text = new Text(props);
      text.setText(string);

      var c = new CreateCommand();
      c.setCanvas(this.canvas);
      c.setTarget(text);

      // Add the shape to the history.
      this.history.add(c).execute();
    }
  },

  createBox: function(ptA, ptB) {

    var x, y, width, height, boxProps, box, c;

    // Calculate the bounds of the selected area on the grid.
    x = Math.min(ptA.x, ptB.x);
    y = Math.min(ptA.y, ptB.y);
    width = Math.max(ptB.x, ptA.x) - x + 1;
    height = Math.max(ptB.y, ptA.y) - y + 1;

    // If we have an area greater than 1 cell, make a shape.
    if(width > 1 || height > 1) {

      boxProps = {
          x: x,
          y: y,
          width: width,
          height: height,
          solid: true
      };

      box = new Box(boxProps);

      c = new CreateCommand();
      c.setCanvas(this.canvas);
      c.setTarget(box);

      // Add the shape to the history.
      this.history.add(c).execute();

      // Clear the selection on the grid.
      this.grid.clearDraw();
    }
  },



  // Other Controller Methods
  // ------------------------

  getNewTextString: function(input, mode) {
    this.overlay.load('<textarea type="text" id="text" data-mode="' + mode + '" name="text">' + input + '</textarea>').open();
  },

  // Getter for the canvas object.
  getCanvas: function() {
    return this.canvas;
  },

  getTextForSaving: function() {

    // Get the text and be silent about it
    var txt = this.canvas.getText(true);

    // Return the fixed text
    return this.cleanText(txt);
  },

  cleanText: function(string) {
    var blankRegex = new RegExp(Utilities.blankChar + "\r?", 'gi');
    return string.replace(blankRegex, ' ').replace(/<br\/>\r?/g, "\n").replace(/(<[\/]?[a-zA-Z ]+)[^>]*>/g, '');
  },

  // Get the local storage engine.
  getLocalStorage: function() {
    if(!this.localStorage) {
      this.localStorage = new LocalFileStorage({namespace: 'draw.txt'});
    }
    return this.localStorage;
  },

  // log the history to the console
  debugHistory: function() {
    console.log('History: [\n' + this.history.toString() + ']');
  },

  debugDisplayList: function() {
    console.log(JSON.encode(this.canvas.toJSON()));
  },

  debugFromJSON: function(json) {
    if(this.canvas.fromJSON(json)) {
      console.log('SUCCESS opening json!');
      this.history.clear();
      this.canvas.draw();
    }
    else {
      console.log('FAILED to open json :(');
    }
  }

}); /* </ Controller > */


// Array Enhancements
// ---------------

Array.implement({

  // Merge any number of arrays into a single array
  merge: function() {
    if(arguments.length === 0) { return this; }
    if(arguments.length === 1) {
      return this.combine(arguments[1]);
    }

    var merged = [];
    Array.each(arguments, function(item, index, obj) {
      merged.combine(item);
    });

    return this.combine(merged);
  }

});

// String Enhancements
// ----------------

String.implement({

  // Force the first letter of a string to lowercase.
  lowercaseFirstLetter : function(){
    return this.charAt(0).toLowerCase() + this.slice(1);
  }

});

// Event Enhancements
// ---------------

Events.implement({

  // Add event listeners en masse
  listen: function(events) {
    Object.each(events, function(callback, eventType, object) {
      this.addEvent(eventType, callback);
    }, this);
  },

  // Remove event listeners en masse
  stopListening: function(events) {
    Object.each(events, function(callback, eventType, object) {
      this.removeEvent(eventType, callback);
    }, this);
  }

});

// Options Enhancements
// -----------------

Options.implement({
  
  getOption: function(opt) {
    return this.options[opt];
  },
  
  setOption: function(opt, value) {
    this.options[opt] = value;
  }
  
});

// Utilities Namespace
// -------------------

// A place for things to live until I find a better place for them...
Utilities = {};

// Define a blank html character. We need to do this because iOS 
// [does not display monospace fonts correctly](http://www.cocoabuilder.com/archive/cocoa/296556-ios-monospaced-fonts-aren.html)
if (Browser.Platform.ipod){
  Utilities.blankChar = '<span class="sp">-&#8203;</span>';
}
else {
  Utilities.blankChar = '&nbsp;';
}


// Character Grid Class
// ====================

// A two-dimensional array, or grid, for storing a matrix of characters.
var CharacterGrid = new Class({

  // Main array holding rows, or arrays of characters (lines of text)
  a: [],

  // The width of the grid of characters.
  w: 0,

  // The height of the grid of characters.
  h: 0,

  // Default character for empty cells in the grid.
  char: undefined,

  // Constructor
  initialize: function(w, h, char) {
    this.w = w;
    this.h = h;
    this.char = char;
    this.create();
  },

  reset: function(fillWith) {
    this.create();
  },

  // Create an empty grid. Fill all cells with the default character.
  create: function() {
    this.a = Array(this.h);
    this.fill();
  },

  // Fill the entire grid with a single character, useful for clearing the grid.
  fill: function(c) {
    c = c || this.char;
    for(var y = 0; y < this.h; y++) {
      this.a[y] = new Array(this.w);
      for(var x = 0; x < this.w; x++ ) {
        this.a[y][x] = this.char;
      }
    }
  },

  getArray: function() {
    return this.a;
  },

  toString: function() {
    var t = '';
    Array.each(this.a, function(item, index, object) {
      t += item.join('') + '<br/>';
    }, this);
    return t;
  }

});


// Point
// =====

// A very basic point class
Point = new Class({

  // x coordinate value
  x: 0,

  // y coordinate value
  y: 0,

  // Constructor
  initialize: function(x, y) {
    this.x = x || 0;
    this.y = y || 0;
  },

  // Test the equality of this point to the input point.
  equals: function(pt) {
    return (this.x === pt.x && this.y === pt.y);
  },

  // Render to string
  toString: function() {
    return '{x:' + this.x + ', y:' + this.y + '}';
  }

});

// Toolbar Class
// =============

// Define a basic toolbar for managing buttons in app.
Toolbar = new Class({

  // Our toolbar element
  elem: null,

  // Constructor
  initialize: function(selector) {

    this.elem = $$(selector);

    // Listen to a click on our toolbar. The specific button clicked will be
    // identified in the event handler.
    this.elem.addEvent('click', this.whenClick.bind(this));
  },

  // Add event listeners to the toolbar element en masse.
  listen: function(events) {
    Object.each(events, function(callback, eventType, object) {
      this.elem.addEvent(eventType, callback);
    }, this);
  },

  // Respond to the user clicking on our toolbar. Identify the button clicked
  // dispatch the corresponding button event.
  whenClick: function(e) {
    if(e.target.nodeName.toLowerCase() === 'div') {
      this.elem.fireEvent(e.target.id);
    }
  }

});


// History
// =======

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

  // Clear the history stack.
  // Returns the history array in case we want to restore it later.
  // If you want to permanently clear the history, just ignore the return result.
  clear: function() {
    var h = this.stack;
    this.stack = [];
    this.pos = 0;
    return h;
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

    // Return this so we can chain...
    return this;
  },

  execute: function() {
    this.stack[this.stack.length-1].execute();
    this.fireEvent('redo');
  },

  toString: function() {
    var s = '';

    this.stack.each(function(item, index, array) {
      s += item.toString() + "\n";
    });

    return s;
  }

});

// Command Interface
// =================

// The base command class.
// All specific commands should implement this interface.
//
// * Expects a `DisplayObject` as its target. 
// * Implements an `execute` method to apply the command, and
// * implements a `revert` method to undo the command.
ICommand = new Class({

  // The target DisplayObject to apply this command to.
  target: null,

  // The canvas where DisplayObjects are drawn.
  // Here for convenience. Not all commands require this.
  canvas: null,

  // Constructor
  initialize: function() {},

  // Override this method in child classes
  // Set the target to its original state before this command was applied.
  revert: function() {
    throw "Command classes must implement the 'revert' method";
  },

  // Override this method in child classes
  // Apply command -- target will be in new state after changes applied.
  execute: function() {
    throw "Command classes must implement the 'execute' method";
  },

  setTarget: function(val) {
    this.target = val;
  },

  getTarget: function() {
    return this.target;
  },

  setCanvas: function(val) {
    this.canvas = val;
  },

  // Override toString this for debugging of commands.
  toString: function() {
    throw "Command classes must implement their own toString methods";
  }

});


// Create Command
// ==============

// Create a new DisplayObject.
CreateCommand = new Class({

  Implements: ICommand,

  // The target DisplayObject to be created on execute, removed on revert.
  target: null,

  // Constructor
  initialize: function() {},

  // Add the target DisplayObject to the canvas.
  execute: function() {
    this.canvas.addChild(this.target);
  },

  // Remove the target DisplayObject from the canvas.
  revert: function() {
    this.canvas.removeChild(this.target);
  },

  toString: function() {
    return '{name: Create, target: ' + this.target.toString() + '}';
  }

});

// Delete Command
// ==============

// Remove a DisplayObject from the display list.
DeleteCommand = new Class({

  Implements: ICommand,

  // The index where target DisplayObject lived prior to deletion
  targetIndex: null,

  // Constructor
  initialize: function(){},

  setTargetIndex: function(val) {
    this.targetIndex = val;
  },

  // Remove the target from the canvas
  execute: function() {
    this.canvas.removeChildAt(this.targetIndex);
  },

  // Place target back in the display list
  revert: function(target) {
    this.canvas.addChildAt(this.target, this.targetIndex);
  },

  toString: function() {
    return '{name: Delete, target: ' + this.target.toString() + '}';
  }

});

// Move Command
// ============

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

// Rearrange Command
// =================

// Swap two DisplayObjects
ArrangeSwapCommand = new Class({

  Implements: ICommand,

  // Store the beginning depths of the target DisplayObjects
  beginDepths: [],

  initialize: function(){},

  // Swap the two display objects to their new depths.
  execute: function() {
    this.canvas.swapChildren(this.beginDepths[0], this.beginDepths[1]);
  },

  // Place the target DisplayObjects at original depth.
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

// Grid
// ====

// Defined the character grid to draw within.
Grid = new Class({

  // Bind these event handlers to this class instance
  Binds: ['mouseDown',
          'mouseMove',
          'mouseUp',
          'doubleClick'],

  Implements: Events,

  // This is the dom elem to target.
  elem: null,

  // Are we using touch instead of mouse clicks?
  touch: null,

  // The size of our dom element.
  size: null,

  // This is the pixel size of a single monospaced letter {x:#, y:#}.
  em: null,

  // The width of our background in characters.
  width: null,

  // The height of our background in characters.
  height: null,

  // The first point of an action.
  ptA: null,

  // The most recent point of an action.
  ptB: null,

  // Constructor.
  initialize: function(selector) {
    this.elem = $$(selector);

    if (Browser.Platform.ipod){
      this.touch = new Touch(this.elem[0]);
      this.touch.addEvent('start', this.mouseDown);
    }
    else {
      this.elem.addEvent('mousedown', this.mouseDown);
      this.elem.addEvent('dblclick', this.doubleClick);
    }

    this.drawGrid();
  },

  // Mouse Events
  // ------------

  doubleClick: function(e) {

    this.ptA = this.findClickLocation(e.target);
    this.fireEvent('dblclick', [this, this.ptA]);

    e.stop();
    return false;

  },

  mouseDown: function(e) {

    if(this.touch) {
      this.touch.addEvent('move', this.mouseMove);
      this.touch.addEvent('end', this.mouseUp);
      this.touch.addEvent('cancel', this.mouseUp);
    }
    else {
      $(document).addEvent('mouseup', this.mouseUp);
      this.elem.addEvent('mousemove', this.mouseMove);
    }

    this.ptA = this.findClickLocation(e.target);
    this.ptB = this.ptA;

    this.fireEvent('mousedown', [this, this.ptA]);

    if(!this.touch) {
      e.stop();
    }

    return false;

  },

  // `e` comes from both mouse move and touch move events.
  // `dx`, and `dy` only apply to touch move events.
  mouseMove: function(e, dx, dy) {

    var x, y, parent;

    // If this was a touch event then we must calculate the position using the
    // touch event's delta, converting pixel units to character units.
    if(this.touch) {

      x = ((this.ptA.x * this.em.x) + dx) / this.em.x;
      y = ((this.ptA.y * this.em.y) + dy) / this.em.y;

      this.ptB = new Point(Math.floor(x), Math.floor(y));
    }
    else {
      this.ptB = this.findClickLocation(e.target);
    }

    parent = $$(e.target).getParents('#' + this.elem.get('id'));

    if(parent[0].length) {
      this.fireEvent('mousemove', [this, this.ptA, this.ptB]);
    }

    if(!this.touch) {
      e.stop();
    }

    return false;

  },

  mouseUp: function(e) {

    // Clean up event listeners since the user's action is complete.
    if(this.touch) {
      this.touch.removeEvent('move', this.mouseMove);
      this.touch.removeEvent('end', this.mouseUp);
    }
    else {
      $(document).removeEvent('mouseup', this.mouseUp);
      this.elem.removeEvent('mousemove', this.mouseMove);
    }

    this.fireEvent('mouseup', [this, this.ptA, this.ptB]);

    if(!this.touch) {
      e.stop();
    }

    return false;

  },

  // DOM Work
  // --------

  // Draw the grid of squares representing our editable area.
  // Each square is akin to a pixel, and is the exact same size a
  // single monospace character.
  drawGrid: function() {

    var top, left, x, y;

    // Calculate the width and height of the grid
    this.size = this.elem.getSize()[0];

    // Find the width and height of a single monospaced character
    this.em = this.getEmSize();

    // Calculate the width and height of grid in characters
    this.width = Math.floor(this.size.x / this.em.x);
    this.height = Math.floor(this.size.y / this.em.y);

    // Create our grid

    // Loop through each row of our grid...
    for(y = 0; y < this.height; y++) {

      // Find the top of this row
      top = this.em.y * y;

      // For this row, loop through each item...
      for(x = 0; x < this.width; x++) {

        // Find the left of this item
        left = this.em.x * x;

        // Create the dom element
        e = this.createBox('c' + x + 'r' + y,
            left-1,
            top-1,
            '' + (this.em.x - 1) + 'px',
            '' + (this.em.y - 1) + 'px'
        );

        // Store the x and y coordinates of this item in data attributes
        e.set('data-x', x);
        e.set('data-y', y);

        // Add classes based on the location of this square within the grid
        if(y === 0) { e.addClass('top'); }
        else if(y === this.height-1) { e.addClass('bottom'); }

        if(x === 0) { e.addClass('left'); }
        else if(x === this.width-1) { e.addClass('right'); }

        // Render this grid to DOM
        this.elem.adopt(e);
      }
    }
  },

  // Create a span element
  createSpan: function(id, x, y, w, h) {
    var e = new Element('span', {id:id});
    e.set('html', 'M');
    return e;
  },

  // Create a box, or <div>, element
  createBox: function(id, x, y, w, h) {
    var e = new Element('div', {id:id, 'class': 'bgbox'});

    e.setStyles({
      width: w,
      height: h,
      left:  x + 'px',
      top: y + 'px',
      position: 'absolute'
    });

    return e;
  },

  // Clear the bounding box preview from the dom
  clearDraw: function() {
    $$('.preview').removeClass('preview');
  },

  // Mark the cells of the user's current bounding box.
  // Given an origin point and end point, calculate the box and draw it.
  markDraw: function(ptA, ptB) {

    var /* @private */

    // The cells marking the bounding box
    left, right, top, bottom,

    // The bounds of the box
    x = Math.min(ptA.x, ptB.x),
    y = Math.min(ptA.y, ptB.y),
    width = Math.max(ptB.x, ptA.x) - x + 1,
    height = Math.max(ptB.y, ptA.y) - y + 1;

    if(width > 1 || height > 1) {

      // Find all the cells defining the bounding box
      left = this.elem.getChildren('[data-x=' + x + ']')[0].slice(y, y+height);
      right = this.elem.getChildren('[data-x=' + (x + width - 1) + ']')[0].slice(y, y+height);
      top = this.elem.getChildren('[data-y=' + y + ']')[0].slice(x, x + width - 1);
      bottom = this.elem.getChildren('[data-y=' + (y + height - 1) + ']')[0].slice(x, x + width - 1);

      // Clear all previously marked cells
      this.clearDraw();

      // Mark all cells in the bounding box
      this.markPreviewCells([].merge(left, right, top, bottom));
    }
  },

  // Mark all given cells with '.preview' to show the user the bounds of the
  // box they've draw.
  markPreviewCells: function(items) {

//    Array.each(items, function(item, index, obj) {
//      item.addClass('preview');
//    });

    var tempElements = new Elements(items);
    tempElements.addClass('preview');
  },

  // Getters
  // -------

  // Get the width of our grid, in characters
  getWidth: function() {
    return this.width;
  },

  // Get the height of our grid, in characters
  getHeight: function() {
    return this.height;
  },

  // Calculate the size of a single monospaced character, both width and height,
  // by creating a single M and measuring it's size.
  getEmSize: function() {
    var e = this.createSpan('tempSpan', 0, 0, '1em', '1em'),
    emSize = null, letterSpacing = null;
    this.elem.adopt(e);
    emSize = e.getSize();
    e.dispose();
    return emSize;
  },

  // Find the click location on our grid. This is not a pixel value, but rather
  // the x and y location within our grid matrix.
  findClickLocation: function(elem) {

    var x = $(elem).get('data-x'),
        y = $(elem).get('data-y');

    return new Point(x, y);

  }

}); /* </ Grid > */


// Artboard for drawing
// ====================

// This is where you do your drawing...
Canvas = new Class({

  Implements: Events,

  elem: null,

  // Our list of DisplayObjects
  displayList: [],

  // Our matrix of text characters making up our display
  characterGrid: [],

  // Here we store our display as a string
  txt: '',

  width: null,

  height: null,

  // Store the currently selected DisplayObject
  selected: null,

  // Constructor
  initialize: function(selector, w, h) {
    this.elem = $$(selector);
    this.width = w;
    this.height = h;
  },

  // Initialize our display matrix
  initMatrix: function(w, h) {
    this.characterGrid = new CharacterGrid(w, h, Utilities.blankChar);
  },

  // Manage the currently selected DisplayObject
  setSelected: function(val) { this.selected = val; },
  getSelected: function() { return this.selected; },

  getIndexOfSelected: function() {
    var i = null;
    if(this.selected) {
      i = this.getIndexOfChild(this.selected);
    }
    return i;
  },

  // Draw our display list.
  // Here we turn our DisplayObjects into text, and merge the text into
  // the final array of characters to display.
  draw: function(silent) {

    silent = silent || false;

    // Init our matrix
    this.initMatrix(this.width, this.height);

    // Turn the display list into a single array of characters
    Array.each(this.displayList, this.drawDisplayListItem, this);

    // Insert into DOM
    this.txt = this.characterGrid.toString();
    this.elem.set('html', this.txt);

    if(!silent) {
      this.fireEvent('canvasRefresh', this);
    }

  },

  // Given a DisplayObject, turn it into a text matrix.
  drawDisplayListItem: function(item, index, object) {

    var char = item.char,
        xOff = item.getX(),
        yOff = item.getY(),
        a = item.draw(),
        m = this.characterGrid.getArray();

    Array.each(a, function(column, columnIndex, object) {
      Array.each(column, function(row, rowIndex, object) {
        try {
          if(item === this.selected) {
            row = '<span class="selected">' + row + '</span>';
          }
          else {
            row = '<span>' + row + '</span>';
          }
          m[Number(yOff) + columnIndex][Number(xOff) + rowIndex] = row;
        }
        catch (e) {
          // TODO: handle exception
          console.log(e);
        }

      }, this);
    }, this);

  },

  hitTest: function(pt) {
    var hit = false,
        i = 0,
        max = this.displayList.length-1;

    for(var i = max; i >= 0; i-- ) {
      if(this.displayList[i].hitTest(pt)) {
        hit = this.displayList[i];
        break;
      }
    }

    return hit;
  },

  // Display List Management
  // -----------------------

  addChild: function(child) {
    this.displayList.push(child);
  },

  addChildAt: function(child, index) {

    // Break the array into the left and right pieces.
    var left = this.displayList.slice(0, index),
        right = this.displayList.slice(index);

    // Merge the left and right arrays with the new child in the middle.
    this.displayList = [].merge(left, [child], right);
  },

  removeChild: function(child) {
    this.displayList.erase(child);
  },

  swapChildren: function(indexA, indexB) {

    var childA = this.getChildAt(indexA),
        childB = this.getChildAt(indexB);

    if(childA && childB) {
      this.displayList[indexA] = childB;
      this.displayList[indexB] = childA;
    }
  },

  getChildAt: function(index) {
    if(this.displayList[index]) {
      return this.displayList[index];
    }
    return null;
  },

  getIndexOfChild: function(child) {
    var found = false,
        i = 0,
        max = this.displayList.length-1;

    for(var i = max; i >= 0; i-- ) {
      if(this.displayList[i] === child) {
        found = i;
        break;
      }
    }

    return found;
  },

  removeChildAt: function(index) {

    var removed = null;

    if (this.displayList.length >= index) {
      removed = this.displayList.splice(index, 1)[0];
      if(removed === this.selected) {
        this.selected = null;
      }
    }

    return removed;

  },

  count: function() {
    return this.displayList.length;
  },

  // Other Canvas methods
  // --------------------

  getText: function(redraw) {
    if(redraw) {
      this.draw(true);
    }
    return this.txt;
  },

  toJSON: function() {
    var json = {displayList:[]};
    Array.each(this.displayList, function(item, index, array) {
      json.displayList.push(item.toJSON());
    }, this);

    return json;
  },

  fromJSON: function(json) {

    var errors = [];

    if(typeof json !== 'object') {
      json = JSON.decode(json);
    }

    if(json.displayList) {

      this.displayList = [];

      Array.each(json.displayList, function(item, index, obj) {
        try {
          var newObj = DisplayObjectFactory.create(item);
          this.displayList.push(newObj);
        }
        catch (e) {
          errors.push(e);
        }
      }, this);

      if(errors.length) {
        console.log('Errors encountered while opening file: ', errors);
      }

      return true;

    }
    else {
      return false;
    }
  }

});


// Display Object
// ==============

// Base display object for all objects drawn into the canvas
DisplayObject = new Class({

  name: '',

  type: 'DisplayObject',

  // Left coordinate.
  x: 0,

  // Top coordinate.
  y: 0,

  // Constructor
  initialize: function(props) {
    this.x = props.x || 0;
    this.y = props.y || 0;
  },

  setName: function(val) { this.name = val; },
  getName: function() { return this.name; },

  getX: function() { return this.x; },

  getY: function() { return this.y; },

  getType: function() { return this.type; },

  setPosition: function(pt) {
    this.x = pt.x;
    this.y = pt.y;
  },

  getPosition: function() {
    return new Point(this.x, this.y);
  },

  edit: function(){},

  refresh: function(){},

  // Interface for the hitTest method.
  // Must test if a point 'hits' this object.
  hitTest: function(pt) {
    throw 'Display Objects must implement the hitTest method';
  },

  toString: function() {
    throw 'Display Objects must implement their own toString method';
  },

  // Render the object's properties to json so it can be saved.
  toJSON: function() {
    throw 'Display Objects must implement their own toJSON method';
  },

  // Re-create the object from the json created from the toJSON method.
  fromJSON: function() {
    throw 'Display Objects must implement their own fromJSON method';
  },

  // Interface for the draw method.
  // Must return an array of characters fit for display to user.
  draw: function() {
    throw 'Display Objects must implement the hitTest method';
  }

});

// Display Object Factory
// ======================

// Simple factory for creating DisplayObjects from an object-map of properties.
DisplayObjectFactory = (function(props) {

  var createDisplayObject = function(props) {
    if(props.type) {
      switch(props.type) {

      case 'Box':
        return new Box(props);
      break;

      case 'Text':
        return new Text(props);
      break;

      default: throw 'Could not find display object type "' + props.type + '"';
      break;

      }
    }
  };

  return {create: createDisplayObject};

})();


// Box
// ====

// Class definition
Box = new Class({

  // Build off of the base DisplayObject
  Extends: DisplayObject,

  type: 'Box',

  // Store our matrix of display information here
  m:null,

  // Default options for the box.
  height: 0,
  width: 0,
  char: '*',

  // A blankChar of `undefined` will render a transparent box.
  blankChar: undefined,

  // Should this shape be transparent of solid?
  solid: false,

  // Constructor
  initialize: function(props) {
    this.parent(props);
    this.width = props.width || 0;
    this.height = props.height || 0;
    this.char = props.char || '*';
    this.blankChar = props.blankChar || undefined;
    this.solid = props.solid || false;
    this.refresh();
  },

  // Refresh the box. Re-creates the matrix of display info.
  refresh: function() {
    if(this.solid) {
      this.blankChar = Utilities.blankChar;
    }
    else {
      this.blankChar = undefined;
    }
    this.m = new CharacterGrid(this.width, this.height, this.blankChar);
  },

  getWidth: function() { return this.width; },

  getHeight: function() { return this.height; },

  // Update an option. This will cause a refresh.
  updateOption: function(key, val) {
    this[key] = val;
    this.refresh();
  },

  // Hit Test the box given a click-point.
  hitTest: function(pt) {

    // Calculate the bounds of this box
    var top = this.getY(),
        right = this.getX() + this.getWidth(),
        bottom = this.getY() + this.getHeight(),
        left = this.getX(),
        hit = false;

    // Is the point within the bounds, inclusive?
    if(pt.x >= left && pt.x < right &&
        pt.y >= top && pt.y < bottom) {
      hit = true;
    }

    return hit;

  },

  // Draw the box.
  // Will render the matrix so it's fit for displaying.
  draw: function() {

    var a = this.m.getArray();

    // Create the top and bottom sides
    for(var i = 0; i < this.width; i++) {

      // Set the top characters
      a[0][i] = this.char;

      // Set the bottom characters
      a[this.height-1][i] = this.char;
    }

    // Create the left and right sides
    for(var i = 0; i < this.height; i++) {

      // Set the left-side characters
      a[i][0] = this.char;

      // Set the right-side characters
      a[i][this.width-1] = this.char;
    }

    return a;
  },

  // Get the character at a specific location
  charAt: function(pt) {
    if(this.m) {
      var a = this.m.getArray();
      return a[pt.x][pt.y];
    }
    return null;
  },

  toString: function() {
    return '{type: Box, x:' + this.x + ', y:' + this.y +
           ', width:' + this.width + ', height:' + this.height + '}';
  },

  toJSON: function() {
    var json = {
        type: this.type,
        name: this.name,
        x: this.x,
        y: this.y,
        width: this.width,
        height: this.height,
        char: this.char,
        solid: this.solid
    };
    return json;
  },

  fromJSON: function(json) {
    this.initialize(json);
  }

});

// This is experimental code here...nothing to see...
/* Utilities.enhanceWithGettersAndSetters(Box.prototype); */

// Text Display Object
// ===================

// A basic text container
Text = new Class({

  // Build off of the base DisplayObject
  Extends: DisplayObject,

  type: 'Text',

  txt: 'New Text Box',

  // Constructor
  initialize: function(props) {
    this.parent(props);
    this.txt = props.txt || this.txt;
  },

  setText: function(val) {
    this.txt = val;
  },

  getText: function() {
    return this.txt;
  },

  // Hit Test the box given a click-point.
  hitTest: function(pt) {

    // Calculate the bounds of this box
    var top = this.getY(),
        right = Number(this.getX()) + Number(this.txt.length),
        bottom = this.getY(),
        left = this.getX(),
        hit = false,
        contentArray = this.draw();

    if(contentArray[pt.y - top]) {
      if(contentArray[pt.y - top][pt.x - left]) {
        hit = true;
      }
    }

    return hit;
  },

  draw: function() {

    var a = this.txt.replace(/\n\r?/g, '<br />').split("<br />"),
        finalArray = [];

    for(var h = 0; h < a.length; h++) {
      var row = a[h];

      finalArray[h] = [];

      for(var w = 0; w < row.length; w++) {
        finalArray[h][w] = row[w] === ' ' ? '&nbsp;' : row[w];
      }
    }

    return finalArray;
  },

  toString: function() {
    return '{type: Text, value: "' + this.txt + '"}';
  },

  toJSON: function() {
    var json = {
        type: this.type,
        name: this.name,
        x: this.x,
        y: this.y,
        txt: this.txt.replace('\n', '\\n')
    };
    return json;
  },

  fromJSON: function(json) {
    this.initialize(json);
  }

});

/*
---
description: LightFace

license: MIT-style

authors:
- David Walsh (http://davidwalsh.name)

requires:
- core/1.2.1: '*'

provides: [LightFace]

...
*/

var LightFace = new Class({
	
	Implements: [Options,Events],
	
	options: {
		width: 'auto',
		height: 'auto',
		draggable: false,
		title: '',
		buttons: [],
		fadeDelay: 400,
		fadeDuration: 400,
		keys: { 
			esc: function() { this.close(); } 
		},
		content: '<p>Message not specified.</p>',
		zIndex: 9001,
		pad: 100,
		overlayAll: false,
		constrain: false,
		resetOnScroll: true,
		baseClass: 'lightface',
		errorMessage: '<p>The requested file could not be found.</p>'/*,
		onOpen: $empty,
		onClose: $empty,
		onFade: $empty,
		onUnfade: $empty,
		onComplete: $empty,
		onRequest: $empty,
		onSuccess: $empty,
		onFailure: $empty
		*/
	},
	
	
	initialize: function(options) {
		this.setOptions(options);
		this.state = false;
		this.buttons = {};
		this.resizeOnOpen = true;
		this.ie6 = typeof document.body.style.maxHeight == "undefined";
		this.draw();
	},
	
	draw: function() {
		
		//create main box
		this.box = new Element('table',{
			'class': this.options.baseClass,
			styles: {
				'z-index': this.options.zIndex,
				opacity: 0
			},
			tween: {
				duration: this.options.fadeDuration,
				onComplete: function() {
					if(this.box.getStyle('opacity') == 0) {
						this.box.setStyles({ top: -9000, left: -9000 });
					}
				}.bind(this)
			}
		}).inject(document.body,'bottom');

		//draw rows and cells;  use native JS to avoid IE7 and I6 offsetWidth and offsetHeight issues
		var verts = ['top','center','bottom'], hors = ['Left','Center','Right'], len = verts.length;
		for(var x = 0; x < len; x++) {
			var row = this.box.insertRow(x);
			for(var y = 0; y < len; y++) {
				var cssClass = verts[x] + hors[y], cell = row.insertCell(y);
				cell.className = cssClass;
				if (cssClass == 'centerCenter') {
					this.contentBox = new Element('div',{
						'class': 'lightfaceContent',
						styles: {
							width: this.options.width
						}
					});
					cell.appendChild(this.contentBox);
				}
				else {
					document.id(cell).setStyle('opacity',0.4);
				}
			}
		}
		
		//draw title
		if(this.options.title) {
			this.title = new Element('h2',{
				'class': 'lightfaceTitle',
				html: this.options.title
			}).inject(this.contentBox);
			if(this.options.draggable && window['Drag'] != null) {
				this.draggable = true;
				new Drag(this.box,{ handle: this.title });
				this.title.addClass('lightfaceDraggable');
			}
		}
		
		//draw message box
		this.messageBox = new Element('div',{
			'class': 'lightfaceMessageBox',
			html: this.options.content || '',
			styles: {
				height: this.options.height
			}
		}).inject(this.contentBox);
		
		//button container
		this.footer = new Element('div',{
			'class': 'lightfaceFooter',
			styles: {
				display: 'none'
			}
		}).inject(this.contentBox);
		
		//draw overlay
		this.overlay = new Element('div',{
			html: '&nbsp;',
			styles: {
				opacity: 0
			},
			'class': 'lightfaceOverlay',
			tween: {
				link: 'chain',
				duration: this.options.fadeDuration,
				onComplete: function() {
					if(this.overlay.getStyle('opacity') == 0) this.box.focus();
				}.bind(this)
			}
		}).inject(this.contentBox);
		if(!this.options.overlayAll) {
			this.overlay.setStyle('top',(this.title ? this.title.getSize().y - 1: 0));
		}
		
		//create initial buttons
		this.buttons = [];
		if(this.options.buttons.length) {
			this.options.buttons.each(function(button) {
				this.addButton(button.title,button.event,button.color);
			},this);
		}
		
		//focus node
		this.focusNode = this.box;
		
		return this;
	},
	
	// Manage buttons
	addButton: function(title,clickEvent,color) {
		this.footer.setStyle('display','block');
		var focusClass = 'lightfacefocus' + color;
		var label = new Element('label',{
			'class': color ? 'lightface' + color : '',
			events: {
				mousedown: function() {
					if(color) {
						label.addClass(focusClass);
						var ev = function() {
							label.removeClass(focusClass);
							document.id(document.body).removeEvent('mouseup',ev);
						};
						document.id(document.body).addEvent('mouseup',ev);
					}
				}
			}
		});
		this.buttons[title] = (new Element('input',{
			type: 'button',
			value: title,
			events: {
				click: (clickEvent || this.close).bind(this)
			}
		}).inject(label));
		label.inject(this.footer);
		return this;
	},
	showButton: function(title) {
		if(this.buttons[title]) this.buttons[title].removeClass('hiddenButton');
		return this.buttons[title];
	},
	hideButton: function(title) {
		if(this.buttons[title]) this.buttons[title].addClass('hiddenButton');
		return this.buttons[title];
	},
	
	// Open and close box
	close: function(fast) {
		if(this.isOpen) {
			this.box[fast ? 'setStyles' : 'tween']('opacity',0);
			this.fireEvent('close');
			this._detachEvents();
			this.isOpen = false;
		}
		return this;
	},
	
	open: function(fast) {
		if(!this.isOpen) {
			this.box[fast ? 'setStyles' : 'tween']('opacity',1);
			if(this.resizeOnOpen) this._resize();
			this.fireEvent('open');
			this._attachEvents();
			(function() {
				this._setFocus();
			}).bind(this).delay(this.options.fadeDuration + 10);
			this.isOpen = true;
		}
		return this;
	},
	
	_setFocus: function() {
		this.focusNode.setAttribute('tabIndex',0);
		this.focusNode.focus();
	},
	
	// Show and hide overlay
	fade: function(fade,delay) {
		this._ie6Size();
		(function() {
			this.overlay.setStyle('opacity',fade || 1);
		}.bind(this)).delay(delay || 0);
		this.fireEvent('fade');
		return this;
	},
	unfade: function(delay) {
		(function() {
			this.overlay.fade(0);
		}.bind(this)).delay(delay || this.options.fadeDelay);
		this.fireEvent('unfade');
		return this;
	},
	_ie6Size: function() {
		if(this.ie6) {
			var size = this.contentBox.getSize();
			var titleHeight = (this.options.overlayAll || !this.title) ? 0 : this.title.getSize().y;
			this.overlay.setStyles({
				height: size.y - titleHeight,
				width: size.x
			});
		}
	},
	
	// Loads content
	load: function(content,title) {
		if(content) this.messageBox.set('html',content);
		if(title && this.title) this.title.set('html',title);
		this.fireEvent('complete');
		return this;
	},
	
	// Attaches events when opened
	_attachEvents: function() {
		this.keyEvent = function(e){
			if(this.options.keys[e.key]) this.options.keys[e.key].call(this);
		}.bind(this);
		this.focusNode.addEvent('keyup',this.keyEvent);
		
		this.resizeEvent = this.options.constrain ? function(e) { 
			this._resize(); 
		}.bind(this) : function() { 
			this._position(); 
		}.bind(this);
		window.addEvent('resize',this.resizeEvent);
		
		if(this.options.resetOnScroll) {
			this.scrollEvent = function() {
				this._position();
			}.bind(this);
			window.addEvent('scroll',this.scrollEvent);
		}
		
		return this;
	},
	
	// Detaches events upon close
	_detachEvents: function() {
		this.focusNode.removeEvent('keyup',this.keyEvent);
		window.removeEvent('resize',this.resizeEvent);
		if(this.scrollEvent) window.removeEvent('scroll',this.scrollEvent);
		return this;
	},
	
	// Repositions the box
	_position: function() {
		var windowSize = window.getSize(), 
			scrollSize = window.getScroll(), 
			boxSize = this.box.getSize();
		this.box.setStyles({
			left: scrollSize.x + ((windowSize.x - boxSize.x) / 2),
			top: scrollSize.y + ((windowSize.y - boxSize.y) / 2)
		});
		this._ie6Size();
		return this;
	},
	
	// Resizes the box, then positions it
	_resize: function() {
		var height = this.options.height;
		if(height == 'auto') {
			//get the height of the content box
			var max = window.getSize().y - this.options.pad;
			if(this.contentBox.getSize().y > max) height = max;
		}
		this.messageBox.setStyle('height',height);
		this._position();
	},
	
	// Expose message box
	toElement: function () {
		return this.messageBox;
	},
	
	// Expose entire modal box
	getBox: function() {
		return this.box;
	},
	
	// Cleanup
	destroy: function() {
		this._detachEvents();
		this.buttons.each(function(button) {
			button.removeEvents('click');
		});
		this.box.dispose();
		delete this.box;
	}
});

/*
---
description:     LightFace.Static

authors:
  - David Walsh (http://davidwalsh.name)

license:
  - MIT-style license

requires:
  core/1.2.1:   '*'

provides:
  - LightFace.Static
...
*/
LightFace.Static = new Class({
	Extends: LightFace,
	options: {
		offsets: {
			x: 20,
			y: 20
		}
	},
	open: function(fast,x,y) {
		this.parent(fast);
		this._position(x,y);
	},
	_position: function(x,y) {
		if(x == null) return;
		this.box.setStyles({
			top: y - this.options.offsets.y,
			left: x - this.options.offsets.x
		});
	}
});

/*
---
description: A cross browser persistent storgae API

license: MIT-style

authors:
- Arieh Glazer

requires:
- core/1.2.4 : [Core,Class,Class.Extras,Cookie]

provides: [LocalStorage]

...
*/
/*!
Copyright (c) 2010 Arieh Glazer

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE 
*/
(function($,window,undef){

window['LocalStorage'] = new Class({
    Implements : [Options]
    , options : {
          path : '*'
        , name : window.location.hostname
        , duration : 60*60*24*30
        , debug : false
    }
    , storage : null
    , initialize : function(options){
         var $this = this;
         
         this.setOptions(options);
         
         if (window.localStorage){ //HTML5 storage
            if (this.options.debug) console.log('using localStorage')
            this.storage = window.localStorage;
         }else if (Browser.Engine.trident){ //IE < 8
                if (this.options.debug) console.log('using behavior Storage');
            	this.storage = (function(){
                    var storage = document.createElement("span");
                    storage.style.behavior = "url(#default#userData)";
                    $(document.body).adopt(storage);  
                    storage.load($this.options.name);
                    
                    return {
                        setItem : function(name,value){
                            storage.setAttribute(name,value);
                            storage.save($this.options.name);
                        }
                        , getItem : function (name){
                            return storage.getAttribute(name);
                        }
                        , removeItem : function(name){
                            storage.removeAttribute(name);
                            storage.save($this.options.name);
                        }
                    };
                })();
         }else if (window.globalStorage){ //FF<3.5
            if (this.options.debug) console.log('using globalStorage');
            this.storage = (function(){
                storage = globalStorage[$this.options.name];
                return {
                        setItem : function(name,value){
                            storage[name] = value;
                        }
                        , getItem : function (name){
                            return storage[name].value;
                        }
                        , removeItem : function(name){
                            delete(storage[name]);
                        }
                    };
            })();
         }else{ //All others
            if (this.options.debug) console.log('using cookies');
            this.storage = (function(){
                var options ={
                    path : $this.options.path
                    , duration : $this.options.duration
                };
                
                return {
                        setItem : function(name,value){
                             Cookie.write(name,value,options);
                        }
                        , getItem : function (name){
                             return Cookie.read(name);
                        }
                        , removeItem : function(name){
                             Cookie.dispose(name);
                        }
                    };
            })();
         }
    },
    set : function(name,value){
        this.storage.setItem(name,JSON.encode(value));
        return this;
    }
    , get : function (name){
        
        return JSON.decode(this.storage.getItem(name));
    }
    , remove : function (name){
        this.storage.removeItem(name);
        return this;
    }
});

})(document.id,this);

/*
---
description: A cross browser persistent file storage API

license: MIT-style

authors:
- Jon Beebe (somethingkindawierd@gmail.com)

requires:
- core/1.2.4 : [Core,Class,Class.Extras,Cookie,LocalStorage]

provides: [LocalFileStorage]

...
*/
/*!
Copyright (c) 2011 Jon Beebe (somethingkindawierd@gmail.com)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE
*/
(function($,window,undef){

window['LocalFileStorage'] = new Class({

    Implements : [Options],

    Extends: LocalStorage,

    options: {
      // Default namespace for all files
      namespace: 'lfs',
      fileArrayName: '__files__'
    },

    initialize: function(options) {
      this.parent(options);
      this.setOptions(options);
    },

    getList: function() {
      return this.get(this.options.namespace + '.' + this.options.fileArrayName) || [];
    },

    save: function(filename, contents) {

      // Store the file in local storage
      this.set(this.options.namespace + '.' + filename, contents);

      // Record the filename in our file array
      var files = this.getList();
      if(!files.contains(filename)) {
        files.push(filename);
        this.set(this.options.namespace + '.' + this.options.fileArrayName, files);
      }

    },

    read: function(filename) {

      // Read the file from local storage
      return this.get(this.options.namespace + '.' + filename);

    },

    remove: function(filename) {

      // Remove file from local storage
      this.parent(this.options.namespace + '.' + filename);

      // Remove file from our file array
      var files = this.getList();
      if(files.contains(filename)) {
        files.erase(filename);
        this.set(this.options.namespace + '.' + this.options.fileArrayName, files);
      }

    }

});

})(document.id,this);

/*
---

name: Touch
version: 0.1
description: Simple drag implementation that works with standard-sized browsers and hooks with mobile safari touch events.
license: MooTools MIT-Style License (http://mootools.net/license.txt)
copyright: Valerio Proietti (http://mad4milk.net)
authors: Valerio Proietti (http://mad4milk.net)
requires: Core/1.2.4: *
provides: Touch

...
*/

var Touch = new Class({

	Implements: Events,

	initialize: function(element){
		this.element = document.id(element);

		this.bound = {
			start: this.start.bind(this),
			move: this.move.bind(this),
			end: this.end.bind(this)
		};

		if (Browser.Platform.ipod){
			this.context = this.element;
			this.startEvent = 'touchstart';
			this.endEvent = 'touchend';
			this.moveEvent = 'touchmove';
		} else {
			this.context = document;
			this.startEvent = 'mousedown';
			this.endEvent = 'mouseup';
			this.moveEvent = 'mousemove';
		}

		this.attach();
	},

	// public methods

	attach: function(){
		this.element.addListener(this.startEvent, this.bound.start);
	},

	detach: function(){
		this.element.removeListener(this.startEvent, this.bound.start);
	},

	getEvent: function() {
	  return this.event;
	},

	// protected methods

	start: function(event){
		this.preventDefault(event);
		// this prevents the copy-paste dialog to show up when dragging. it only affects mobile safari.
		document.body.style.WebkitUserSelect = 'none';

		this.hasDragged = false;

		this.context.addListener(this.moveEvent, this.bound.move);
		this.context.addListener(this.endEvent, this.bound.end);

		var page = this.getPage(event);

		this.event = event;

		this.startX = page.pageX;
		this.startY = page.pageY;

		this.fireEvent('start', [event]);
	},

	move: function(event){
		this.preventDefault(event);

		this.hasDragged = true;

		var page = this.getPage(event);

		this.deltaX = page.pageX - this.startX;
		this.deltaY = page.pageY - this.startY;

		this.fireEvent('move', [event, this.deltaX, this.deltaY]);
	},

	end: function(event){
		this.preventDefault(event);
		// we re-enable the copy-paste dialog on drag end
		document.body.style.WebkitUserSelect = '';

		this.context.removeListener(this.moveEvent, this.bound.move);
		this.context.removeListener(this.endEvent, this.bound.end);

		this.fireEvent((this.hasDragged) ? 'end' : 'cancel', [event]);
	},

	preventDefault: function(event){
		if (event.preventDefault) event.preventDefault();
		else event.returnValue = false;
	},

	getPage: function(event){
		//when on mobile safari, the coordinates information is inside the targetTouches object
		if (event.targetTouches) event = event.targetTouches[0];
		if (event.pageX != null && event.pageY != null) return {pageX: event.pageX, pageY: event.pageY};
		var element = (!document.compatMode || document.compatMode == 'CSS1Compat') ? document.documentElement : document.body;
		return {pageX: event.clientX + element.scrollLeft, pageY: event.clientY + element.scrollTop};
	}

});


