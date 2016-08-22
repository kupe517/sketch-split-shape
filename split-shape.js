var onRun = function(context) {
  function alert(msg, title) {
  title = title || "Whoops";
  var app = [NSApplication sharedApplication];
  [app displayDialog:msg withTitle:title];
}
  var alert = [COSAlertWindow new];

  [alert setMessageText:"Create a grid based on the selected Layer"];
  [alert setInformativeText:"This is informative"];

  [alert addTextLabelWithValue:"Rows"];
  [alert addTextFieldWithValue:"1"];
  [alert addTextLabelWithValue:"Cols"];
  [alert addTextFieldWithValue:"4"];
  [alert addTextLabelWithValue:"Gutter"];
  [alert addTextFieldWithValue:"20"];

  [alert runModal];

  var rows = [[alert viewAtIndex:1] stringValue]
  var cols = [[alert viewAtIndex:3] stringValue]
  var gutter = [[alert viewAtIndex:5] stringValue]
  rows = parseInt(rows)
  columns = parseInt(cols)
  gutter = parseInt(gutter)


  //Selection changed from previous version?
  selection = context.selection;
  var layer = selection[0];
  var frame = [layer frame];

  //resize it first
  [frame setWidth:[[[frame width] + gutter - [gutter*columns]] /columns]];
  [frame setHeight:[[[frame height] + gutter - [gutter*rows]] /rows]];

  // generate copies and position them
  for(i = 0; i < rows; i++){
  	for(j = 0; j < columns; j++){

  		var newGridItem = [layer duplicate];
  		var frame_2 = [newGridItem frame];

  		[frame_2 setX:[frame x] + [[[frame width]+gutter]]*j];
  		[frame_2 setY:[frame y] + [[[frame height]+gutter]]*i];

  	}
  }
  //discard the first copy:
  var parent=layer.parentGroup();
  parent.removeLayer(layer);
}
