// # Grid

// Defined the character grid to draw within.
Grid = new Class({

  Binds: ['mouseDown',
          'mouseMove',
          'mouseUp',
          'doubleClick'],

  Implements: Events,

  // This is the dom elem to target
  elem: null,

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

    this.elem.addEvent('mousedown', this.mouseDown);
    this.elem.addEvent('dblclick', this.doubleClick);

    this.drawGrid();
  },

  doubleClick: function(e) {

    this.ptA = this.findClickLocation(e.target);
    this.fireEvent('dblclick', [this, this.ptA]);

    e.stop();
    return false;

  },

  mouseDown: function(e) {

    $(document).addEvent('mouseup', this.mouseUp);
    this.elem.addEvent('mousemove', this.mouseMove);

    this.ptA = this.findClickLocation(e.target);

    this.fireEvent('mousedown', [this, this.ptA]);

    e.stop();
    return false;

  },

  mouseMove: function(e) {

    this.ptB = this.findClickLocation(e.target);

    var parent = $$(e.target).getParents('#' + this.elem.get('id'));

    if(parent[0].length) {
      this.fireEvent('mousemove', [this, this.ptA, this.ptB]);
    }

    e.stop();
    return false;

  },

  mouseUp: function(e) {

    $(document).removeEvent('mouseup', this.mouseUp);
    this.elem.removeEvent('mousemove', this.mouseMove);

    var parent = $$(e.target).getParents('#' + this.elem.get('id'));

    if(parent[0].length) {
      this.ptB = this.findClickLocation(e.target);
    }

    this.fireEvent('mouseup', [this, this.ptA, this.ptB]);

    e.stop();
    return false;

  },


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

  // Add event listeners to the canvas
  listen: function(events) {
    Object.each(events, function(callback, eventType, object) {
      this.addEvent(eventType, callback);
    }, this);
  },

  // Add event listeners to the canvas
  stopListening: function(events) {
    Object.each(events, function(callback, eventType, object) {
      this.removeEvent(eventType, callback);
    }, this);
  },

  clearDraw: function() {
    $$('.preview').removeClass('preview');
  },

  markDraw: function(ptA, ptB) {

    var x, y, width, height, left, right, top, bottom;

    var prevDisplay = this.elem.getStyle('display');
    this.elem.setStyle('display', 'none');

    this.clearDraw();

    x = Math.min(ptA.x, ptB.x);
    y = Math.min(ptA.y, ptB.y);
    width = Math.max(ptB.x, ptA.x) - x + 1;
    height = Math.max(ptB.y, ptA.y) - y + 1;

    if(width > 1 || height > 1) {
      left = this.elem.getChildren('[data-x=' + x + ']')[0].slice(y, y+height);
      right = this.elem.getChildren('[data-x=' + (x + width - 1) + ']')[0].slice(y, y+height);
      top = this.elem.getChildren('[data-y=' + y + ']')[0].slice(x, x + width - 1);
      bottom = this.elem.getChildren('[data-y=' + (y + height - 1) + ']')[0].slice(x, x + width - 1);

      this.markPreviewCells(Utilities.arrayMerge(left, right, top, bottom));
    }

    this.elem.setStyle('display', prevDisplay);
  },

  markPreviewCells: function(items) {
    Array.each(items, function(item, index, obj) {
      item.addClass('preview');
    });
  },

  // Find the click location on our grid. This is not a pixel value, but rather
  // the x and y location within our grid matrix.
  findClickLocation: function(elem) {

    var x = $(elem).get('data-x'),
        y = $(elem).get('data-y');

    return new Point(x, y);

  }

}); /* </ Grid > */
