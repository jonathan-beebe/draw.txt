// # Controller

// Class definition.
// I know, this file is a bit of a mess. It's been the catch-all for code before
// I decide where I want it to live (if it's worth keeping at all.)
Controller = new Class({

  // ## Class Properties

  background: null,

  canvas: null,

  history: null,

  toolbar: null,

  overlay: null,

  // Track user-actions
  dragging: false,
  mouseStatus: null,

  // The command currently in-action
  command: null,

  // Store relevant points during an action

  // The first point of an action
  ptA: null,

  // Offset of point relative to target DisplayObject's origin
  ptAOffset: null,

  // The most recent point of an action
  ptB: null,

  // ## Initialization

  // Constructor
  initialize: function(foreground, background, toolbar) {

    // Create the background grid
    this.grid = new Grid(background);

    this.toolbar = new Toolbar(toolbar);

    // Create the canvas to draw into
    this.canvas = new Canvas(
        foreground,
        this.grid.getWidth(),
        this.grid.getHeight()
    );

    this.history = new History();

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

    // Wire up event listeners
    this.initEvents();
  },

  // Initialize all event listeners
  initEvents: function() {

    this.canvas.listen({
      canvasRefresh: this.whenCanvasRefresh.bind(this)
    });

    this.grid.listen({
      mousedown: this.whenMouseDown.bind(this),
      mouseup: this.whenMouseUp.bind(this),
      mousemove: this.whenMouseMove.bind(this)
    });

    this.toolbar.listen({
      undo: this.whenUndo.bind(this),
      redo: this.whenRedo.bind(this),
      'delete': this.whenDelete.bind(this),
      edit: this.whenEditMode.bind(this),
      preview: this.whenPreviewMode.bind(this),
      move_front: this.whenMoveFront.bind(this),
      move_up: this.whenMoveUp.bind(this),
      move_down: this.whenMoveDown.bind(this),
      move_back: this.whenMoveBack.bind(this),
    });

  },

  // ## Event Listeners
  
  whenEditMode: function() {
    $$('#right').addClass('hidden');
    $$('#left').removeClass('hidden');
  },
  
  whenPreviewMode: function() {
    $$('#right').removeClass('hidden');
    $$('#left').addClass('hidden');
  },

  whenDelete: function() {
    var childIndex = this.canvas.getIndexOfSelected();
    if(childIndex !== null) {
      this.canvas.removeChildAt(childIndex);
      this.canvas.draw();
    }
  },

  whenUndo: function() {
    this.history.undo();
    this.canvas.draw();
  },

  whenRedo: function() {
    this.history.redo();
    this.canvas.draw();
  },

  // TODO: for arrange commands, if already at to/bottom then do not perform command.
  whenMoveFront: function() {
    var indexA = this.canvas.getIndexOfSelected(),
        command = new ArrangeFrontCommand();

    command.setOriginalDepth(indexA);
    command.setCanvas(this.canvas);

    this.history.add(command).execute();
    this.canvas.draw();
  },

  whenMoveUp: function() {
    var indexA = this.canvas.getIndexOfSelected();
        indexB = null;

    if(indexA !== null) { indexB = indexA + 1; }
    
    if(indexA !== null && indexB !== null) {
      var command = new ArrangeSwapCommand();
      command.setCanvas(this.canvas);
      command.setBeginDepths([indexA, indexB]);
      this.history.add(command).execute();
      this.canvas.draw();
    }
  },

  whenMoveDown: function() {
    var indexA = this.canvas.getIndexOfSelected();
        indexB = null;

    if(indexA !== null) { indexB = indexA - 1; }

    if(indexA !== null && indexB !== null) {
      var command = new ArrangeSwapCommand();
      command.setCanvas(this.canvas);
      command.setBeginDepths([indexA, indexB]);
      this.history.add(command).execute();
      this.canvas.draw();
    }
  },

  whenMoveBack: function() {
    var indexA = this.canvas.getIndexOfSelected(),
        command = new ArrangeBackCommand();

    command.setOriginalDepth(indexA);
    command.setCanvas(this.canvas);

    this.history.add(command).execute();
    this.canvas.draw();
  },

  // Respond to a mouse down event
  whenMouseDown: function(e) {

    this.mouseStatus = 'down';

    // Reset all action-tracking properties
    this.dragging = false;
    this.canvas.setSelected(null);
    this.command = null;

    // Store the first point of this action
    this.ptA = this.grid.findClickLocation(e.target);

    // Did we hit an existing DisplayObject?
    var hit = this.canvas.hitTest(this.ptA);

    // If we hit an object then decide which action to perform on it.
    // Currently we only move it, but eventually we will be able to resize
    // it as well.
    if(hit) {
      this.canvas.setSelected(hit);
      this.canvas.draw();

      // Store the offset of the click relative to the hit object's origin.
      this.ptAOffset = new Point(this.ptA.x - hit.getX(), this.ptA.y - hit.getY());
    }

    // Stop the event from propagating
    return false;
  },

  // Respond to a mouse move event
  whenMouseMove: function(e) {

    // If we have an existing first point...
    if(this.mouseStatus === 'down') {

      // Store current mouse location as most recent point
      this.ptB = this.grid.findClickLocation(e.target);

      // If we have not set the dragging flag, and the begin point &
      // current point are different, then we are dragging...
      if(!this.dragging && !this.ptA.equals(this.ptB)) {
        this.dragging = true;
      }

      // Are we dragging on the grid?
      if(this.dragging && !this.canvas.getSelected()) {

        // Draw the border of the dragged/selected area
        this.grid.markDraw(this.ptA, this.ptB);
      }

      // Are we moving an object?
      else if(this.canvas.getSelected()) {

        // We're moving an object! Create the move command and store the
        // original
        // location of the box before repositioning it.
        if(!this.command) {
          this.command = new MoveCommand();
          this.command.setTarget(this.canvas.getSelected());
          this.command.setBeginPoint(this.canvas.getSelected().getPosition());
        }

        // Find the new location of the object by offsetting the most recent
        // mouse position by the previously recorded click-offset.
        var newLoc = new Point(this.ptB.x - this.ptAOffset.x, this.ptB.y - this.ptAOffset.y);

        // Tell the object we're moving where it's new location is.
        this.canvas.getSelected().setPosition(newLoc);

        // Redraw the canvas.
        this.canvas.draw();
      }
    }
  },

  // Respond to a mouse up event
  whenMouseUp: function(e) {

    var x, y, width, height, boxProps, box;

    this.mouseStatus = 'up';

    // Store the most recent mouse location
    this.ptB = this.grid.findClickLocation(e.target);

    // If the user did not drag the mouse and did not hit existing art object...
    if(!this.dragging && !this.canvas.getSelected()) {
      if(this.ptA.equals(this.ptB)) {
        this.getNewTextString('New Text', 'new');
      }
    }

    // Are we dragging the mouse across the grid?
    else if(this.dragging && !this.canvas.getSelected()) {
      if(!this.ptA.equals(this.ptB)) {
        this.createBox();
      }
    }

    // Is the user manipulating an existing art object?
    else if(this.canvas.getSelected()) {
      this.editShape();
    }

    // Reset our action-tracking properties
    this.command = null;
    this.dragging = false;
  },

  // ## Interact with the canvas

  // Catch-all for shape-edit actions.
  // Determine what the user is trying to do, and create/perform the command.
  editShape: function() {

    // If we have an existing command, work with it...
    if(this.command) {

      // If the begin and end point do not match then move the target object
      if(!this.ptA.equals(this.ptB)) {
        this.moveShape();
      }

    }

    // No existing command...create one.
    else {

      // If the user did not move their mouse when clicking, then
      // open the shape-editing dialog if approprate for target shape.
      if(this.ptA.equals(this.ptB)) {

        // If it's text, open the text-editor.
        if(this.canvas.getSelected() instanceof Text) {
          this.getNewTextString(this.canvas.getSelected().getText(), 'edit');
        }

      }
    }
  },

  moveShape: function() {
    // Find the new location of the object by offsetting the most recent
    // mouse position by the previously recorded click-offset.
    this.command.setEndPoint(new Point(this.ptB.x - this.ptAOffset.x, this.ptB.y - this.ptAOffset.y));
    this.history.add(this.command);
  },

  editText: function(string) {
    if(string && string !== this.canvas.getSelected().getText()) {

      var command = new TextEditCommand();
      command.setTarget(this.canvas.getSelected());
      command.setOriginalText(this.canvas.getSelected().getText());
      command.setNewText(string);
      this.history.add(command).execute();

      this.canvas.draw();
    }
  },

  createText: function(string) {

    var props, text; // , string;

    if(string) {
      props = {
        x: this.ptA.x,
        y: this.ptA.y
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

  getNewTextString: function(input, mode) {
    this.overlay.load('<textarea type="text" id="text" data-mode="' + mode + '" name="text">' + input + '</textarea>').open();
  },

  createBox: function() {

    // Calculate the bounds of the selected area on the grid.
    x = Math.min(this.ptA.x, this.ptB.x);
    y = Math.min(this.ptA.y, this.ptB.y);
    width = Math.max(this.ptB.x, this.ptA.x) - x + 1;
    height = Math.max(this.ptB.y, this.ptA.y) - y + 1;

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

      var c = new CreateCommand();
      c.setCanvas(this.canvas);
      c.setTarget(box);

      // Add the shape to the history.
      this.history.add(c).execute();

      // Clear the selection on the grid.
      this.grid.clearDraw();
    }

  },

  // Respond to the canvas refreshing it's contents.
  whenCanvasRefresh: function(e) {

    // Get the canvas contents as a text string.
    var txt = e.getText();

    // Show the text in the preview element.
    $$('#txt').set('html', txt);
  },

  // Getter for the canvas object.
  getCanvas: function() {
    return this.canvas;
  },

  getTextForSaving: function() {

    // @hack I know, this could be alot better...
    // Remove the selection so it's not drawn 'selected'
    // var s = this.canvas.getSelected();
    this.canvas.setSelected(null);

    // Get the text and be silent about it
    var txt = this.canvas.getText(true);

    // Reset the selection
    // this.canvas.setSelected(s);

    // Return the fixed text
    return txt.replace(/&nbsp;\r?/g, ' ').replace(/<br\/>\r?/g, "\n");
  }

}); /* </ Controller > */
