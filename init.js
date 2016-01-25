
var context;
var canvas;
var paper;
function init(){
  canvas = $('#canvas')[0];
  context = canvas.getContext("2d");
  paper = new Raphael(8, 8, canvas.width, canvas.height);
  var circle = paper.circle(50,40,10);
  circle.attr("fill","#f00");
}


$(document).ready(function() {
    init();
});
