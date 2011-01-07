// Grid
// ====

// Defined the character grid to draw within.
Grid = new Class({

  Binds: ['mouseDown',
          'mouseMove',
          'mouseUp',
          'doubleClick'],

  Implements: Events,

  // This is the dom elem to target
  elem: null,

  touch: null,

  // The size of our dom element
  size: null,

  // This is the size of a single monospaced letter {x:#, y:#}
  em: null,

  // The width of our background in characters
  width: null,

  // The height of our background in characters
  height: null,

  // The first point of an action
  ptA: null,

  // The most recent point of an action
  ptB: null,

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
  // ============

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

  // dx and dy come from the Touch move event
  mouseMove: function(e, dx, dy) {

    if(this.touch) {

      var x = ((this.ptA.x * this.em.x) + dx) / this.em.x;
      var y = ((this.ptA.y * this.em.y) + dy) / this.em.y;

      this.ptB = new Point(Math.floor(x), Math.floor(y));
    }
    else {
      this.ptB = this.findClickLocation(e.target);
    }

    var parent = $$(e.target).getParents('#' + this.elem.get('id'));

    if(parent[0].length) {
      this.fireEvent('mousemove', [this, this.ptA, this.ptB]);
    }

    if(!this.touch) {
      e.stop();
    }

    return false;

  },

  mouseUp: function(e) {

    if(this.touch) {
      this.touch.removeEvent('move', this.mouseMove);
      this.touch.removeEvent('end', this.mouseUp);
    }
    else {
      $(document).removeEvent('mouseup', this.mouseUp);
      this.elem.removeEvent('mousemove', this.mouseMove);
    }

//    var parent = $$(e.target).getParents('#' + this.elem.get('id'));
//
//    if(parent[0].length) {
//      this.ptB = this.findClickLocation(e.target);
//    }
//
//    console.log(this.ptB.toString());

    this.fireEvent('mouseup', [this, this.ptA, this.ptB]);

    if(!this.touch) {
      e.stop();
    }

    return false;

  },

  // DOM Work
  // ========

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
  // =======

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
