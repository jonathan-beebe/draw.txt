Draw.txt [demo](http://somethingkindawierd.github.com/draw.txt/demo/index.html)
========

![Screenshot of draw.txt](https://github.com/somethingkindawierd/draw.txt/raw/master/screenshot.jpg "Sceenshot of draw.txt")

A very simple drawing application for *drawing* a text file. [Try the live demo](http://somethingkindawierd.github.com/draw.txt/demo/index.html)

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
*  Edit text by clicking on the text objcet.
*  Move text by clicking and dragging the object.

Most commands are supported by the history, so undo and redo will work.

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

Bugs
----

What would a new project like this be without a good bug or two?

Right now the History is a bit shaky...sometimes commands don't undo or redo
exactly how you'd expect.
