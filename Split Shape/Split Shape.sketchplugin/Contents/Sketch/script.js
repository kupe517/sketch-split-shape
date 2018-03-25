var sketch = require('sketch/dom');
var document = sketch.Document.getSelectedDocument();
var selection = document.selectedLayers;

@import "/Utilities/Utilities.js";

var columns = 3;
var rows = 1;

function splitAgain(){
	selection.layers.forEach(layer => {
	    log(layer.frame.width);
	    var originalWidth = layer.frame.width;
	    var columnSize = (originalWidth / columns);
	    log(columnSize);
	    var columnLayer = layer.duplicate();
	    sizeLayer(columnLayer, 50, 100);
	});
}
