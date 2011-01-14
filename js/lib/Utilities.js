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
  },
  
  removeFirst: function() {
    this.splice(0, 1);
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
