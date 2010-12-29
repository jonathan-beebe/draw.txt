Draw.txt
========

![Screenshot of draw.txt](https://github.com/somethingkindawierd/draw.txt/raw/master/screenshot.jpg "Sceenshot of draw.txt")

A very simple drawing application for *drawing* a text file.

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

*	You can create boxes by dragging on the grid. 
* Move boxes by click-and-dragging them.

Text:

* You can create text by clicking on an empty grid-cell.
*	Edit text by clicking on the text objcet.
*	Move text by clicking and dragging the object.

Most commands are supported by the history, so undo and redo will work. However 
a few still need to be completed (e.g. delete.)

To Do
=====

Create About App signature
--------------------------

Small signature on the bottom of app and in code.

Add a license
--------------

Find the right free/open-source license

Create demo on github page
--------------

Post the working demo to the [github project page](http://somethingkindawierd.github.com/draw.txt/)

Shapes selector
---------------

Small toolbar for selecting the current shape to draw.

Event System
------------

All interaction between elements needs to be done through a global event system.

Ex: new elem creation, whether through a user interaction or a redo event, needs
to trigger the same code in the controller.

Deletion -- remove the item from the canvas and remove from 'selected' property.

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

		     *            /\
		    * *          /  \
		   *   *        /    \
		  *     *      /      \
		 *       *    /________\
		* * * * * *
		
		 
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
