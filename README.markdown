Draw.txt [demo](http://somethingkindawierd.github.com/draw.txt/demo/index.html)
========

![Screenshot of draw.txt](https://github.com/somethingkindawierd/draw.txt/raw/master/screenshot.png "Sceenshot of draw.txt")

A very simple drawing application for *drawing* a text file. [Try the live demo](http://somethingkindawierd.github.com/draw.txt/demo/index.html).
View the [annotated source](http://somethingkindawierd.github.com/draw.txt/docs/draw.txt.html).

Each character is a *pixel* and shapes are drawn with monospaced characters.
The final product can be saved as a .txt file.

The current version features the ability to draw boxes and create lines of text,
and sports an unlimited history for some snazzy undo/redo action.

Origin
------

I wanted a way to *draw* some very basic text-based documentation for some
of my projects; e.g. to create simple shapes to show object/class relationships.
Furthermore I wanted them stored in plain .txt files.

Current Status: Experimental
============================

Boxes:

* You can create boxes by dragging on the grid. 
* Move boxes by click-and-dragging them.

Text:

* You can create text by clicking on an empty grid-cell.
*  Edit text by double-clicking on the text objcet.
*  Move text by clicking and dragging the object.

Most commands are supported by the history, so undo and redo will work.

Using
=====

If you have a web browser then you can run draw.txt. Just open `index.html` and
you're up and running!

Or you can [check out the live draw.txt demo](http://somethingkindawierd.github.com/draw.txt/demo/index.html).

Contributing
============

draw.txt is written in Javascript, built upon on the [Mootools 1.3 framework](http://mootools.net/).
If you know Javascript then you should be able to jump right in.
If you know Mootools then you'll feel right at home!

First you need to download the source. You can either clone the code from git:

    git clone git://github.com/somethingkindawierd/draw.txt.git

Or, better yet, fork it!

To run the app using the development files in `/js` use `index.dev.html`.

For the production-ready app, and to create the [docco](http://jashkenas.github.com/docco/) documentation, you need
to run the `merge.php` script from your terminal. This merges all development `/js`
development files into a single `/draw.txt.js` file. *(yeah, I know, I should have
a script written in more of a standard-install language...)*

    cd /path/to/draw.txt/
    php merge.php

If you want to update the [docco](http://jashkenas.github.com/docco/) [annotated source](http://somethingkindawierd.github.com/draw.txt/docs/draw.txt.html) after merging the code then run

    docco draw.txt.js

Then you should be able to open `/docs/draw.txt.html` and see the updated docs.

To Do
=====

Shapes selector
---------------

Small toolbar/widget for selecting the type of shape to draw.

Open
----

Ability to open a .txt file and discover shapes, such as boxes and text areas,
turning them into editable objects.

New Display Objects
-------------------

*   Free-drawing

    Draw on mouse-move for arbitrary shapes

*   Lines

*   Triangles.

             *            /\
            * *          /  \
           *   *        /    \
          *     *      /      \
         *       *    /________\
        * * * * * *

*   Circles

            x  x           *  *    
         x        x     *        * 
        x          x   *          *
        x          x   *          *
         x        x     *        * 
            x  x           *  *    

*   Other?

Canvas/Shape Interactions
-------------------------

*   Resizing of shapes
*   Keyboard interaction

Linking of shapes with lines
----------------------------

One of my dreams for this app was the ability to link shapes with lines so when
a shape is moved all connected lines move with it.
