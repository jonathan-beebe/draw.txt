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
