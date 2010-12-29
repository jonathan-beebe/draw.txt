Draw.txt
========

A very simple drawing application for *drawing* a text file.

A drawing app where the lines/brushes/shapes are created using monospaced font 
characters. The final product can be saved as a .txt file.

The current version features the ability to draw boxes and create lines of text,
and sports an unlimited history for some snazzy undo/redo action.

Origin
------

I wanted a way to *draw* some very basic text-based documentation for some
of my projects; e.g. to create simple shapes to show object/class relationships.
Furthermore I wanted them stored in plain .txt files.

Current Status: Experimental
============================

This is highly experimental. All it has, right now, are boxes. You can create
boxes by dragging on the grid. You can move boxes by click-and-dragging them.

To Do
=====

Create About App signature
--------------------------

Small signature on the bottom of app and in code.

Add a license
--------------

Find the right free/open-source license

Post to GitHub
--------------

Post the code to github and create a working demo on github

Shapes selector
---------------

Small toolbar for selecting the current shape to draw.

Event System
------------

All interaction between elements needs to be done through a global event system.

Ex: new elem creation, whether through a user interaction or a redo event, needs
to trigger the same code in the controller.

Deletion -- remove the item from the canvas and remove from 'selected' property.

Save
----

Save the txt directly to...where? Desktop? Cloud? HTML5 Local StorageL?

http://blog.another-d-mention.ro/programming/java-script/open-and-save-files-to-desktop-without-going-to-server/

Open
----

Ability to open a .txt file and discover shapes, such as boxes, and text areas,
turning these into editable objects.

Try using the [File API](http://www.w3.org/TR/FileAPI/). 
Here's an example of a [file reader](http://www.w3.org/TR/FileAPI/#dfn-filereader).

New Display Objects
-------------------
    
*   Free-drawing

    Draw on mouse-move for arbitrary shapes
    
*   Circles, Lines, Triangles.

     *
    * *
   *   *
  *     *
 *       *
* * * * * *

     /\
    /  \
   /    \
  /      \
 /________\

*   Other?

Canvas/Shape Interactions
-------------------------

*   Delete
*   Arrange layers
*   Resizing of shapes
*   Keyboard interaction

Linking of shapes with lines
----------------------------

One of my dreams for this app was the ability to link shapes with lines so when
a shape is moved all connected lines move with it.
