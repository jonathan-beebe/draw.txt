var Utilities = {

  arrayMerge: function() {
    if(arguments.length === 0) { return null; }
    if(arguments.length === 1) {
      return arguments[1];
    }

    var merged = [];
    Array.each(arguments, function(item, index, obj) {
      merged.combine(item);
    });

    return merged;
  },

  lowercaseFirstLetter : function(string){
    return string.charAt(0).toLowerCase() + string.slice(1);
  },

  /**
   * Enhance an object by turning all getX and setX methods into official
   * getters and setters that are aliases for the getX and setX methods.
   *
   * This class uses the underscore.each method that limits the enumerated
   * properties to only those belonging to this object. Normally, this would
   * be the proper and safe way to do this. However, when inheriting from parent
   * classes, this will not see the child prototype's setX or getX properties.
   *
   * @param {object} A class prototype, passed as Class.prototype.
   */
  enhanceWithGettersAndSetters : function(c) {

    var props = {};

    Object.each(c, function(prop, n, obj) {

      if(n.indexOf('get') === 0 && n.indexOf('Options') === -1) {
        n = Utilities.lowercaseFirstLetter(n.substr(3));
        props[n] = props[n] || {};
        props[n].get = prop;
      }
      else if(n.indexOf('set') === 0 && n.indexOf('Options') === -1) {
        n = Utilities.lowercaseFirstLetter(n.substr(3));
        props[n] = props[n] || {};
        props[n].set = prop;
      }

    }); /* </ each > */

    if(props !== {}) {
      Object.defineProperties(c, props);
    }
  },

  /**
   * Enhance an object by turning all getX and setX methods into official
   * getters and setters that are aliases for the getX and setX methods.
   *
   * This class DOES NOT limit the for loop to only properties belonging
   * to this object so that we can see methods defined on a child class.
   * While not typically considered a safe thing to do, this function only
   * creates getter and setter aliases where appropriate (methods prefixed with
   * 'set' or 'get', so it should not have any undesired side effects.
   *
   * @param {object} A class prototype, passed as Class.prototype.
   */
  enhanceWithGettersAndSetters2 : function(c) {

    var props = {},
        prop = null,
        n = null;

    for(prop in c) {

      if(prop.indexOf('get') === 0 && prop.indexOf('Options') === -1) {
        n = Utilities.lowercaseFirstLetter(prop.substr(3));
        props[n] = props[n] || {};
        props[n].get = c[prop];
      }
      else if(prop.indexOf('set') === 0 && prop.indexOf('Options') === -1) {
        n = Utilities.lowercaseFirstLetter(prop.substr(3));
        props[n] = props[n] || {};
        props[n].set = c[prop];
      }
    }

    if(props !== {}) {
      Object.defineProperties(c, props);
    }

  },

  limit: function(val, min, max) {
    return Math.max(min, Math.min(max, val));
  }

};



/**
 * A generic way to define getters/setters for
 * objects in both the old Mozilla way and the new ECMA standard way,
 * which should work in I.E., at least on DOM Elements.
 *
 * more info:
 * John Resig: http://ejohn.org/blog/javascript-getters-and-setters/
 * Robert Nyman: http://bit.ly/duSGZU
 *
 * https://developer.mozilla.org/en/JavaScript/Reference/global_objects/object/defineproperties
 * https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Object/defineProperty
 *
 * @author somethingkindawierd@gmail.com (Jon Beebe)
 */
if (!Object.defineProperty && Object.__defineGetter__) {
  /**
   * very basic implementation ECMA5 Object.defineProperty
   * @param {object} target The object to define properties on.
   * @param {string} label The property label.
   * @param {object} funcs The functions for the label.
   */
  Object.extend('defineProperty', function(target, label, funcs) {
    if (funcs.get) {
      target.__defineGetter__(label, funcs.get);
    }
    if (funcs.set) {
      target.__defineSetter__(label, funcs.set);
    }
  });
}

if (!Object.defineProperties) {
  /**
   * very basic implementation ECMA5 Object.defineProperties
   * @param {object} target The object to define properties on.
   * @param {object} p All properties to define.
   */
  Object.extend('defineProperties', function(target, p) {
    for (var label in p) {
      if (p.hasOwnProperty(label)) {
        Object.defineProperty(
            target,
            label,
            {
              get: p[label].get,
              set: p[label].set
            }
        );
      }
    }
  });
}