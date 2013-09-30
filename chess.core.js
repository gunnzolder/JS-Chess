/*
JS Chess project
by Anton Parkhomenko 
(gunnzolder)
gunnzolder@gmail.com
*/

(function(b){b.support.touch="ontouchend" in document;if(!b.support.touch){return;}var c=b.ui.mouse.prototype,e=c._mouseInit,a;function d(g,h){if(g.originalEvent.touches.length>1){return;}g.preventDefault();var i=g.originalEvent.changedTouches[0],f=document.createEvent("MouseEvents");f.initMouseEvent(h,true,true,window,1,i.screenX,i.screenY,i.clientX,i.clientY,false,false,false,false,0,null);g.target.dispatchEvent(f);}c._touchStart=function(g){var f=this;if(a||!f._mouseCapture(g.originalEvent.changedTouches[0])){return;}a=true;f._touchMoved=false;d(g,"mouseover");d(g,"mousemove");d(g,"mousedown");};c._touchMove=function(f){if(!a){return;}this._touchMoved=true;d(f,"mousemove");};c._touchEnd=function(f){if(!a){return;}d(f,"mouseup");d(f,"mouseout");if(!this._touchMoved){d(f,"click");}a=false;};c._mouseInit=function(){var f=this;f.element.bind("touchstart",b.proxy(f,"_touchStart")).bind("touchmove",b.proxy(f,"_touchMove")).bind("touchend",b.proxy(f,"_touchEnd"));e.call(f);};})(jQuery);

var letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
// CELL SIZE IS MODIFIED HERE
var cell_size=42;
// CELL SIZE IS MODIFIED HERE

var draggable_options = { 
	    grid: [ cell_size, cell_size ],
	    containment: "table.generated",
	    // opacity: 0.4,
	    cursor: "pointer",
	    start: function() {
	    	$(".position_output").html("");
	    	$(".another_output").html("");
	    },
	    drag: function(){
	    	// var left = $(this).css("left");
	    	// var top = $(this).css("top");
	    	// var params={
	    	// 	"width": "44px",
	    	// 	"height": "44px",
	    	// 	"position":"absolute",
	    	// 	"background-size": "cover",
	    	//  "margin":"-2px"
	    	//  "left":parseInt(left.substr(0, left.length-2))-6+"px",
	   		//  "top":parseInt(left.substr(0, left.length-2))-6+"px",
	    	// };
	    	// $(this).css(params);
	    	var td_id=$(this).parent("td").attr("id");
	    	var figure=$(this);
	    	highlight(td_id, figure);
	    },
	    stop: function(){
	    	moveFigure($(this));
			$( "table.generated i" ).draggable(draggable_options);
			$('td.highlight').removeClass("highlight");
			$('td.beat').removeClass("beat");
	    }
	};
$(function(){
	drawTable();
	$( "table.generated i" ).draggable(draggable_options);
	
});
/*
	highlight() is the first and the base function.
*/
function highlight(td_id, figure) {
	/* 
	the part below mabe needs to be refactored too - i'm not sure that we need to use
	'chess' coordinates (IDs) instead of numeric ones */
	    var td_y=td_id.substr(0,1);
    	var td_x=td_id.substr(1,1);
		var figure_name = figure.attr("name");
		var color = figure.attr("name").substr(0,5);
		if(figure_name.indexOf("rook")>1) highlightRook(td_x,td_y,figure, color);
		if(figure_name.indexOf("horse")>1) highlightHorse(td_x,td_y,figure, color);
		if(figure_name.indexOf("bishop")>1) highlightBishop(td_x,td_y,figure, color);
		if(figure_name.indexOf("queen")>1) highlightQueen(td_x,td_y,figure, color);
		if(figure_name.indexOf("king")>1) highlightKing(td_x,td_y,figure, color);
		$("#"+td_id).removeClass("beat");
}


/*
	function highlightByCoords() highlights the cells by 
	its coordinates - e.g. 
	highlightByCoords(2,3, "white");
	will highlight the #D3 cell as for white-color figure ()
*/

function highlightByCoords(x,y, color){
	if(x<8&&y<8) {
		this_x=parseInt(x)+1;
		var td = $("#"+letters[y]+this_x);
		td.addClass("highlight");
		if (td.children('i').length>0) { 
			var target_color = td.children("i").attr("name").substr(0,5);
			color!=target_color ? td.addClass("beat") : td.removeClass("highlight");
		}
	} 
}

/*
	functions highlightTd() and highlightById() highlight the 
	<td> directly, as jQuery object and by id.

	They certainly need to be refactored later

*/

function highlightById(id, color){
	var td = $('td[id*="'+id+'"]');
	highlightTd(td, color);
}

function highlightTd(td, color){
	td.addClass("highlight");
	var td_html = td.children("i").attr("class");
	if (td.children('i').length>0) { 
		var target_color = td.children("i").attr("name").substr(0,5);
		color!=target_color ? td.addClass("beat") : td.removeClass("highlight");
	}
}

/*
	function higlightBeam() creates the highligting beam sending 
	the coordinates to the highlightByCoords() function until it reaches
	the cell with a figure
*/

function higlightBeam(x,y,xModifier,yModifier,color) {
    var currx = x;
    var curry = y;
    // highlightByCoords(currx,curry, color);
    var td="";
    do {
        currx = currx + xModifier;
        curry = curry + yModifier; 
        highlightByCoords(currx,curry, color); 
    	this_x=parseInt(currx)+1;
		var td = $("#"+letters[curry]+this_x);
		console.log(curry+":"+currx);
		if(Math.abs(curry)>7) return;
		if(Math.abs(currx)>7) return;
    } while(td.children("i").length==0);
    return         
}

function highlightByCoordsArray(coords_array, x, y, color) {
	for (var a=0;a<coords_array.length;a++) {
		var this_x = parseInt(x) + coords_array[a].x;
		var this_y=letters.indexOf(y) +  coords_array[a].y;
		typeof letters[this_y]!='undefined' ? this_y=letters[this_y] : this_y=0;
		var td=$("#"+this_y+""+this_x);
		highlightTd(td, color);
	}
}

function tempLetterToNumber(letter) {
	var number = letters.indexOf(letter);
}

/*	Spesific functions for different kinds of figures:

	ROOK
*/

function highlightRook(x,y, figure, color){
	coordy = letters.indexOf(y);
	coordx = parseInt(x)-1;
	higlightBeam(coordx,coordy,0,1, color);
	higlightBeam(coordx,coordy,1,0, color);
	higlightBeam(coordx,coordy,-1,0, color);
	higlightBeam(coordx,coordy,0,-1, color);
	figure.parent("td").addClass("highlight");
}

/*
HORSE
*/

function highlightHorse(x,y, figure, color){
	var horse_move=[1,2,-1,-2,];
	var horse_moves=[];
	for (var a=0;a<4;a++){
		for (var b=0;b<4;b++){
			if(Math.abs(horse_move[a])!=Math.abs(horse_move[b])) horse_moves.push({"x":horse_move[a], "y":horse_move[b]});
		}
	}
	highlightByCoordsArray(horse_moves, x, y, color);
	figure.parent("td").addClass("highlight");
}

/*
BISHOP
*/

function highlightBishop(x,y, figure, color){
	coordy = letters.indexOf(y);
	coordx = parseInt(x)-1;
	higlightBeam(coordx,coordy,1,1, color);
	higlightBeam(coordx,coordy,1,-1, color);
	higlightBeam(coordx,coordy,-1,1, color);
	higlightBeam(coordx,coordy,-1,-1, color);
	figure.parent("td").addClass("highlight");
}
/*
highlightQueen() looks too ugly, 
maybe needs to be refactored. 

QUEEN
*/
function highlightQueen(x,y, figure, color){
	coordy = letters.indexOf(y);
	coordx = parseInt(x)-1;
	higlightBeam(coordx,coordy,0,1, color);
	higlightBeam(coordx,coordy,1,0, color);
	higlightBeam(coordx,coordy,-1,0, color);
	higlightBeam(coordx,coordy,0,-1, color);
	higlightBeam(coordx,coordy,1,1, color);
	higlightBeam(coordx,coordy,1,-1, color);
	higlightBeam(coordx,coordy,-1,1, color);
	higlightBeam(coordx,coordy,-1,-1, color);
	figure.parent("td").addClass("highlight");
}

/*
KING
*/

function highlightKing(x,y, figure, color){
	var move=[0,1,-1];
	var moves=[];
	for (var a=0;a<3;a++){
		for (var b=0;b<3;b++){
                moves.push({"x":move[a], "y":move[b]});
		}
	}
	highlightByCoordsArray(moves, x, y, color);
	figure.parent("td").addClass("highlight");
}


/*
PAWN
*/
function highlightPawn(x,y, figure, color){
	// TODO: write pawn moves
	figure.parent("td").addClass("highlight");
}


function moveFigure(element) {
	var offset = element.offset();
    	element.hide();
    	var figure = element.attr("name");
    	var this_td = $(document.elementFromPoint(offset.left, offset.top));
    	if(this_td.is("i")) this_td=this_td.parent();
    	if (this_td.hasClass("highlight")) { 
    		var start_cell=element.parent("td").attr("id");
    		element.remove();
    		if (this_td.hasClass("beat")) $(".another_output").html("beat");
    		this_td.html("<i class='"+figure+"' name='"+figure+"'></i>");
    		$(".position_output").html("<span>"+start_cell+"&rarr;"+this_td.attr('id')+"</span>");
    	} 
    	else {
    		$(".position_output").html("!");
    		element.attr('style', '');
    		element.css("position", "relative");
    	}
}

function drawTable() {
		
		var table="";
		for (var i=1;i<9;i++){
			var tr ="";
			for (var a=0;a<letters.length;a++){
				var letter = letters[a];
				var td_id=letter+i;
				var td = "<td id='"+td_id+"'></td>";
				tr = tr+td;
			}
			tr="<tr><th>"+i+"</th>"+tr+"</tr>";
			table=tr+table;
		}
		var th_letter="";
		var tr_letters="";
		for (var a=0;a<letters.length;a++){
				var b = letters[a];
				th_letter="<th>"+b+"</th>";
				tr_letters=tr_letters+th_letter;
			}
		tr_letters=" <tr><th>&nbsp;</th>"+tr_letters+"</tr>";
		table="<table class='generated'>"+table+tr_letters+"</table><div class='position_output'></div><div class='another_output'></div>";
		$("body").prepend(table);
	}


