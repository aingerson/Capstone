
var context;
var canvas;
var paper;
function init(){
  canvas = $('#canvas')[0];
  context = canvas.getContext("2d");
  paper = new Raphael(8, 8, canvas.width, canvas.height);
  var circle = paper.circle(50,40,10);
  circle.attr("fill","#f00");

/*
var lines = paper.set();
for (line in poem){
	lines.push(paper.text(330, 100, line);
}
	lines.attr({font: "12px Fontin-Sans, Arial", fill: "#000", "text-anchor": "start"});
*/

}
$(document).ready(function() {
    init();
});
