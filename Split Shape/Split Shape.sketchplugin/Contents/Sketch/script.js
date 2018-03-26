var sketch = require('sketch/dom');
var document = sketch.Document.getSelectedDocument();
var selection = document.selectedLayers;

var columns = 3;
var rows = 2;
var margin = 0;
var gutter = 20;

function splitAgain(){
	selection.layers.forEach(layer => {
			var width = layer.frame.width;
			var height = layer.frame.height;
			var x = parentOffsetInArtboard(layer).x;
			var y = parentOffsetInArtboard(layer).y;
			// var gutter = Number(_gutter);
	    // var margin = Number(_margin);
	    // var columns = Number(_horizontal);
	    // var rows = Number(_vertical);

			if(margin > 0){
	        x = x + margin;
	        y = (margin + y);
	        width = width - ( margin * 2 );
	        height = height - ( margin * 2 );
	    }

	    var newWidth = width - ((columns - 1) * gutter);
	    var columnWidth = newWidth / columns;

	    if ( rows > 1 ){
	      var rowHeight = (height - ((rows - 1) * gutter)) / rows;
	    }else{
	      var rowHeight = height;
	    }

			for(i = 0; i < columns; i++){
	      var newX = x + (gutter * i) + (columnWidth * i);
	      for(j = 0; j < rows; j++){
	        var newY = y + (gutter * j) + (rowHeight * j);
					var newLayer = layer.duplicate();
					sizeLayer(newLayer, columnWidth, rowHeight);
					moveLayer(newLayer, newX, newY);
	      }
	    }

			//layer.remove();
	});
	sketch.message("Shazam! One shape becomes many! 🎉");
}

function settings(){
	var UI = require('sketch/ui');
	var string = UI.getStringFromUser("Rows", "1", "Columns", "2");
	log(string);
}

/*
|--------------------------------------------------------------------------
| Utilities
|--------------------------------------------------------------------------
*/

function parentOffsetInArtboard(layer) {
	var offset = {
		x: 0,
		y: 0
	};
	var parent = layer.parent;
	while (parent.name && parent.type !== 'Artboard') {
		offset.x += parent.frame.x;
		offset.y += parent.frame.y;
		parent = parent.parent;
		// log('offset:' + offset.y);
	}
	return offset;
}

function moveLayer(layer, x, y) {
	var parentOffset = parentOffsetInArtboard(layer);
	var newFrame = new sketch.Rectangle(layer.frame);
	newFrame.x = x - parentOffset.x;
	newFrame.y = y - parentOffset.y;
	layer.frame = newFrame;
	updateParentFrames(layer);
}

function sizeLayer(layer, width, height) {
	var newFrame = new sketch.Rectangle(layer.frame);
	newFrame.width = width;
	newFrame.height = height;
	layer.frame = newFrame;
	updateParentFrames(layer);
}

function updateParentFrames(layer) {
	var parent = layer.parent;
	while (parent && parent.name && parent.type !== 'Artboard') {
		parent.adjustToFit();
		parent = parent.parent;
	}
}
