// $(function(){
//   highlightByCoords(0,3, "white");
// });

// $(function(){
// 	higlightBeam(2,3,0,1,"white");
// });

$(function(){
	$("#a1").append("<i class='white_horse' name='white_horse'></i>");
	$("#b3").append("<i class='black_rook' name='black_rook'></i>");
	$("#f6").append("<i class='white_bishop' name='white_bishop'></i>");
	$("#d1").append("<i class='black_queen' name='black_queen'></i>");
	$("#e1").append("<i class='black_king' name='black_king'></i>");
	$( "table.generated i" ).draggable(draggable_options);
	// higlightBeam(4,3,-1,-1, "white");

});