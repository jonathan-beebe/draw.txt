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