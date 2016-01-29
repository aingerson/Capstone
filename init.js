
var context;
var canvas;
var paper;
var numPoems = 2;
var poems = [];

var buffer = 30;

function init(){
  canvas = $('#canvas')[0];
  context = canvas.getContext("2d");
  paper = new Raphael(buffer+canvas.width/3, buffer, canvas.width, '100%');
  selectBar = new Raphael(buffer, buffer, canvas.width/3, canvas.height);
  var rect1 = paper.rect(0, 0, canvas.width, canvas.height);
  rect1.attr("fill", "#448C0E");
  rect1.attr("stroke", "#000");
  var rect2 = selectBar.rect(0, 0, canvas.width, canvas.height);
  rect2.attr("fill", "#0f0");
  rect2.attr("stroke", "#000");
  var circle = selectBar.circle(50,40,10);
  circle.attr("fill","#f00");
  var circle = paper.circle(50,40,10);
  circle.attr("fill","#f00");

  var selectHeader = selectBar.text(60,100,"Choose a Poem");
  selectHeader.attr({font: "20px Fontin-Sans, Arial", fill: "#000", "text-anchor": "start"});

  document.getElementById('files').addEventListener('change',handleFileSelect,false);
}

function handleFileSelect(evt){
  var files = evt.target.files;
  var output = [];

  for (var i = 0, f; f = files[i]; i++) {
    var reader = new FileReader();
    var result;
    reader.onload = function(e){
      var text = e.target.result;
      var lines = text.split(/[\r\n]+/g);
      for(var i = 0; i < lines.length; i++) {
          output.push(lines[i]);
      }
      poems.push(new Poem(output));
      output = [];
    };
    reader.readAsText(f,"UTF-8");

   }



   reader.onloadend = function(e){
   var poemList = selectBar.set();
   poemList.attr({font: "18px Fontin-Sans, Arial", fill: "#000", "text-anchor": "start"});
     for(var j=0;j<poems.length;j++){
         toAdd = selectBar.text(100,130+(20*j),poems[j].title);
         toAdd.data('poem',poems[j]);
         toAdd.click(function(){
         paper.clear();
         this.data('poem').displayPoem();
       });
         poemList.push(toAdd);
     }
 };
 }

function Poem(data){
  this.title = data[0];
  this.lines = [];
  for(var i = 1; i<data.length;i++){
    this.lines.push(new Line(this.title,data[i]));
  }
}

Poem.prototype.displayPoem = function(){
  var lineSpacing = 50;
  var header = paper.text(330,100,this.title);
  header.attr({font: "20px Fontin-Sans, Arial", fill: "#000", "text-anchor": "start"});
  var lines = paper.set();
  lines.attr({font: "14px Fontin-Sans, Arial", fill: "#000", "text-anchor": "start"});
  for(i=0;i<this.lines.length;i++){
    lines.push(paper.text(330, 200+(lineSpacing*i), this.lines[i].line));
  }
}

Poem.prototype.printPoem = function(){
  console.log(this.title);

  for(var h=0;h<this.lines.length;h++){
    console.log(this.lines[h].line);
  }
}

function Line(poem,line){
  this.line = line;
  this.poem = poem;
}

$(document).ready(function() {
    init();
});
