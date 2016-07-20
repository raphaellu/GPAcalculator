// console.log("hi extension");

var enableSelection = function(data){
	for (var i = 0; i < tables.length; ++i) {
		rows = $(tables[i]).find("tr");
	
	for (var j = 1; j < rows.length; ++j) {
		row = $(rows[j])
		if (row.context.childElementCount == 7) {
			cells = row.context
			if (cells.children[0].innerText.trim() == "") continue;
			$(cells).addClass('hoverPointer')

			if (!data) {
				$(cells).click(function(){
					$(this).toggleClass('courseClicked');
					calculateGPA();
				})
			}
			else {
				if (data.length == 0) continue;
				var param = Object.getOwnPropertyNames($(cells).context)[0];
				if ($(cells).context[param] == data[0]) {
					$(cells).addClass('courseClicked');
					data.shift();
				}
				// console.log(data)
				// var param = ""
				// for( var k = 0; k < properties.length; ++k) {
				// 	if (properties[k].includes("jQuery"))
				// 		param = properties[k];
				// }
			}
		}	
	}
  } 
}

var retrieveData = function(){

	chrome.storage.sync.get('classes', function(result) {
		result = JSON.parse(result['classes'])
		
		if (result.length == 0) return;
		var classes = [];
		for (var i = 0 ; i < result.length; i ++) 
			classes.push(result[i][Object.getOwnPropertyNames(result[i])[0]]);
		classes.sort(function(a,b){return a-b;});
		// console.log(classes);
		enableSelection(classes);
		calculateGPA();
	})
}




var calculateGPA = function() {
	var classes = $(".courseClicked");
	var totUnits = 0;
	var totPoints = 0;
	var selected = []
	
	for (var i = 0 ; i < classes.length; ++i) {
		cells = $(classes[i]).context.children;

		subject = cells[0].innerText;
		course = cells[1].innerText;
		units = parseFloat(cells[3].innerText);
		points = parseFloat(cells[5].innerText);

		selected.push($(classes[i])[0]);

		if (points != 0.0) {
			totUnits += units;
			totPoints += points;
		}
	    var finalGPA = totUnits != 0 ? (totPoints/totUnits).toFixed(3) : "(╯°Д°)╯︵ ┻━┻"
	    $(".majorGPA").text(finalGPA);
	}
	if (totPoints == 0) {
		var finalGPA = "(╯°Д°)╯︵ ┻━┻"
		$(".majorGPA").text(finalGPA);
	}

	chrome.storage.sync.set({'classes': JSON.stringify(selected)})
	// console.log(JSON.stringify(selected))
}



var tables = jQuery("[id=ucsdCourses]").find("cs_box_content").prevObject.find("table:first")
$("body").append("<div class='majorGPA'></div>");

retrieveData();

enableSelection();




