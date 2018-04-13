var sketch = require('sketch/dom');
var Settings = require('sketch/settings');
var UI = require('sketch/ui');
var document = sketch.Document.getSelectedDocument();
var selection = document.selectedLayers;

var columns, rows, margin, gutter;

function splitAgain() {
	if(selection.length === 0){
		UI.message("Oops! You have to select something for the magic to happen!");
		return;
	}
	selection.layers.forEach(layer => {
		var x, y;
		var width = layer.frame.width;
		var height = layer.frame.height;

		x = layer.frame.x;
		y = layer.frame.y;

		if (margin > 0) {
			x = x + margin;
			y = (margin + y);
			width = width - (margin * 2);
			height = height - (margin * 2);
		}

		var newWidth = width - ((columns - 1) * gutter);
		var columnWidth = newWidth / columns;

		if (rows > 1) {
			var rowHeight = (height - ((rows - 1) * gutter)) / rows;
		} else {
			var rowHeight = height;
		}

		for (i = 0; i < columns; i++) {
			var newX = x + (gutter * i) + (columnWidth * i);
			for (j = 0; j < rows; j++) {
				var newY = y + (gutter * j) + (rowHeight * j);
				var newLayer = layer.duplicate();
				sizeLayer(newLayer, columnWidth, rowHeight);
				moveLayer(newLayer, newX, newY);
			}
		}

		layer.remove();
	});
	UI.message("Shazam! One shape becomes many! 🎉");
}

function settings(context) {
	// Display settings window
	var window = createRectangleWindow(context);
	var alert = window[0];

	var response = alert.runModal()

	if (response == "1000") {
		// This code only runs when the user clicks 'Save and run';
		log("Save and run")

		// Save user input to user preferences
		saveDialogState(context);

		// Split the shape

		splitAgain();

		return true;

	} else

	if (response == "1001") {
		// This code only runs when the user clicks 'save';
		log("Save")

		// Save user input to user preferences
		saveDialogState(context);
		UI.message("Split Shape settings saved.");
		return true;

	}

	{
		return false;
	}

}

function setVariables(){
	if(Settings.settingForKey('columnInput') == undefined){
		columns = 3;
	}else{
		columns = Settings.settingForKey('columnInput');
	}

	if(Settings.settingForKey('rowInput') == undefined){
		rows = 1;
	}else{
		rows = Settings.settingForKey('rowInput');
	}

	if(Settings.settingForKey('marginInput') == undefined){
		margin = 0;
	}else{
		margin = Settings.settingForKey('marginInput');
	}

	if(Settings.settingForKey('gutterInput') == undefined){
		gutter = 20;
	}else{
		gutter = Settings.settingForKey('gutterInput');
	}
}

function saveDialogState(context){

  // The user entered some input in the dialog window and closed it.
  // We should save the preferences of the user so the user doesn't have to
  // re-enter them when running the plugin for a second time.

  // Save column textfield
  columnInput = columnTextField.intValue();
	Settings.setSettingForKey('columnInput', columnInput);

  // Save row textfield
  rowInput = rowTextField.intValue();
	Settings.setSettingForKey('rowInput', rowInput);

  // Save margin textfield
  marginInput = marginTextField.intValue();
	Settings.setSettingForKey('marginInput', marginInput);

  // Save gutter textfield
  gutterInput = gutterTextField.intValue();
	Settings.setSettingForKey('gutterInput', gutterInput);


  log('⚙️ ------ START SAVED SETTINGS --------- ⚙️');
  log('columnInput: ' + columnInput);
  log('rowInput: ' + rowInput);
	log('marginInput: ' + marginInput);
	log('gutterInput: ' + gutterInput);
  log('⚙️ ------ END SAVED SETTINGS --------- ⚙️');

	setVariables();

}


function createRectangleWindow(context) {
	setVariables();

  // Setup the window
  var alert = COSAlertWindow.new();
  alert.setMessageText("Split Shape Settings");
  alert.addButtonWithTitle("Save and run");
  alert.addButtonWithTitle("Save");
  alert.addButtonWithTitle("Cancel");

	// Utilities
	utils = {
	"createLabel": function(frame, text) {
		var label = NSTextField.alloc().initWithFrame(frame);
		label.setStringValue(text);
		label.setSelectable(false);
		label.setEditable(false);
		label.setBezeled(false);
		label.setDrawsBackground(false);
		return label
	},
	"getLayerProps": function() {
		var layer = selection.firstObject();

		if (layer) {
			var x = layer.frame().x();
			var y = layer.frame().y();
			return [x, y];
		} else {
			return [0, 0];
			}
		}
	};

  // Create the main view
  var viewWidth = 400;
  var viewHeight = 170;
  var viewSpacer = 10;
  var view = NSView.alloc().initWithFrame(NSMakeRect(0, 0, viewWidth, viewHeight));
  alert.addAccessoryView(view);

  // Labels
  var infoLabel = utils.createLabel(NSMakeRect(0, viewHeight - 33, (viewWidth - 100), 35),"Your selected shape will be split into a grid based on the settings you provide below.");
  var horizontalLabel = utils.createLabel(NSMakeRect(-1, viewHeight - 65, (viewWidth / 2) - viewSpacer, 20), "Columns ↔");
  var verticalLabel = utils.createLabel(NSMakeRect(130 + viewSpacer, viewHeight - 65, (viewWidth / 2) - viewSpacer, 20), "Rows ↕");
  var marginLabel = utils.createLabel(NSMakeRect(-1, viewHeight - 130, (viewWidth / 2) - viewSpacer, 20), "Margin");
  var gutterLabel = utils.createLabel(NSMakeRect(130 + viewSpacer, viewHeight - 130, (viewWidth / 2) - viewSpacer, 20), "Gutters");

  view.addSubview(infoLabel);
  view.addSubview(horizontalLabel);
  view.addSubview(verticalLabel);
  view.addSubview(marginLabel);
  view.addSubview(gutterLabel);

  // Create inputs
  columnTextField = NSTextField.alloc().initWithFrame(NSMakeRect(0, viewHeight - 85, 130, 20));
  rowTextField = NSTextField.alloc().initWithFrame(NSMakeRect(130 + viewSpacer, viewHeight - 85, 130, 20));
  marginTextField = NSTextField.alloc().initWithFrame(NSMakeRect(0, viewHeight - 150, 130, 20));
  gutterTextField = NSTextField.alloc().initWithFrame(NSMakeRect(130 + viewSpacer, viewHeight - 150, 130, 20));

  // Make TAB key work to switch between textfields
  [columnTextField setNextKeyView:rowTextField];
  [rowTextField setNextKeyView:marginTextField];
  [marginTextField setNextKeyView:gutterTextField];

  //Adding inputs to the dialog
  view.addSubview(columnTextField);
  view.addSubview(rowTextField);
  view.addSubview(marginTextField);
  view.addSubview(gutterTextField);

  // Fill inputs
  columnTextField.setStringValue(columns);
  rowTextField.setStringValue(rows);
  marginTextField.setStringValue(margin);
  gutterTextField.setStringValue(gutter);

  return [alert];
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
	}
	return offset;
}

function moveLayer(layer, x, y) {
	var newFrame = new sketch.Rectangle(layer.frame);
	if(layer.parent.type == 'Artboard'){
		var parentOffset = parentOffsetInArtboard(layer);
		newFrame.x = x - parentOffset.x;
		newFrame.y = y - parentOffset.y;
	}else{
		newFrame.x = x;
		newFrame.y = y;
	}
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
	// log(parent.type);
	while (parent && parent.name && parent.type !== 'Artboard') {
		if(parent.type !== 'SymbolMaster'){
			parent.adjustToFit();
		}
		parent = parent.parent;
	}
}
