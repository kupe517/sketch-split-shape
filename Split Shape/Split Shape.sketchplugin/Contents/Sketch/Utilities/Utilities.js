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
