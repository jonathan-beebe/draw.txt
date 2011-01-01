Canvas = new Class({

  Implements: Events,

  elem: null,

  displayList: [],

  txtArray: [],

  txt: '',

  width: null,

  height: null,

  selected: null,

  initialize: function(selector, w, h) {
    this.elem = $$(selector);
    this.width = w;
    this.height = h;
  },

  initMatrix: function(w, h) {
    this.txtArray = new Matrix(w, h, '&nbsp;');
  },

  // Add event listeners to the canvas
  listen: function(events) {
    Object.each(events, function(callback, eventType, object) {
      this.addEvent(eventType, callback);
    }, this);
  },

  draw: function(silent) {

    silent = silent || false;

    // Init our matrix
    this.initMatrix(this.width, this.height);

    // Turn the display list into a single array of characters
    Array.each(this.displayList, this.drawDisplayList, this);

    // Insert into DOM
    this.txt = this.txtArray.toString();
    this.elem.set('html', this.txt);

    if(!silent) {
      this.fireEvent('canvasRefresh', this);
    }

  },

  setSelected: function(val) {
    this.selected = val;
  },

  getSelected: function() {
    return this.selected;
  },

  drawDisplayList: function(item, index, object) {

    var char = item.char,
        xOff = item.getX(),
        yOff = item.getY(),
        a = item.draw(),
        m = this.txtArray.getArray();

    Array.each(a, function(column, columnIndex, object) {
      Array.each(column, function(row, rowIndex, object) {
        try {
          if(item === this.selected) {
            row = '<span class="selected">' + row + '</span>';
          }
          m[Number(yOff) + columnIndex][Number(xOff) + rowIndex] = row; //item.charAt({x:columnIndex, y:rowIndex});
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

  addChild: function(child) {
    this.displayList.push(child);
  },

  addChildAt: function(child, index) {

    // Break the array into the left and right pieces.
    var left = this.displayList.slice(0, index),
        right = this.displayList.slice(index);

    // Merge the left and right arrays with the new child in the middle.
    this.displayList = Utilities.arrayMerge(left, [child], right);
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

  getIndexOfSelected: function() {
    var i = null;
    if(this.selected) {
      i = this.getIndexOfChild(this.selected);
    }
    return i;
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

//Custom event for canvas update
Element.Events.canvasRefresh = {};