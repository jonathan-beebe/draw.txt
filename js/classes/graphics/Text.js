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
        txt: this.txt//.replace('\n', '\\n')
    };
    return json;
  },

  fromJSON: function(json) {
    this.initialize(json);
  }

});