<?php 

/**
 * Merge all javascript files into a single .js fil.
 * 
 * If you have the php cli then open your terminal and
 * 
 *   cd /path/to/draw.txt/
 *   php merge.php
 */

// Define the files to merge

$fileArray = array(
    'js/main.js',
    'js/lib/Utilities.js',
    
    'js/classes/geom/CharacterGrid.js',
    'js/classes/geom/Point.js',
    
    'js/classes/Controller.js',
    'js/classes/Toolbar.js',
    
    'js/classes/history/History.js',
    'js/classes/commands/ICommand.js',
    'js/classes/commands/CreateCommand.js',
    'js/classes/commands/DeleteCommand.js',
    'js/classes/commands/MoveCommand.js',
    'js/classes/commands/TextEditCommand.js',
    'js/classes/commands/ArrangeFrontCommand.js',
    'js/classes/commands/ArrangeBackCommand.js',
    'js/classes/commands/ArrangeSwapCommand.js',
    
    'js/classes/graphics/Grid.js',
    'js/classes/graphics/Canvas.js',
    'js/classes/graphics/DisplayObject.js',
    'js/classes/graphics/Box.js',
    'js/classes/graphics/Text.js',
    
    'js/lib/plugins/LightFace/Source/LightFace.js',
    'js/lib/plugins/LightFace/Source/LightFace.Static.js',
    'js/lib/plugins/LocalStorage.js',
    'js/lib/plugins/LocalFileStorage.js',
    'js/lib/plugins/Touch.js'
);

// Merge the js files into a single string.

$merged = '';
foreach($fileArray as $file) {
    $contents = file_get_contents($file);
    $merged .= $contents . "\n\n";
}

// Write the merged string to hd.

$myFile = 'draw.txt.js';
$fh = fopen($myFile, 'w') or die("can't open file");
fwrite($fh, $merged);
fclose($fh);