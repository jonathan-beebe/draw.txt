var Matrix = new Class({

  a: [],
  w: 0,
  h: 0,
  char: undefined,

  initialize: function(w, h, char) {
    this.w = w;
    this.h = h;
    this.char = char;
    this.create();
  },

  reset: function(fillWith) {
    this.create();
  },

  create: function() {
    this.a = Array(this.h);
    for(var i = 0; i < this.h; i++) {
      this.a[i] = Array(this.w);
    }
    this.fill();
  },

  fill: function(c) {
    c = c || this.char;
    if(c !== undefined) {
      for(var y = 0; y < this.h; y++) {
        this.a[y] = new Array(this.w);
        for(var x = 0; x < this.w; x++ ) {
          this.a[y][x] = this.char;
        }
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