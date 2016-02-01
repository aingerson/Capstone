
var context;
var canvas;
var paper;

var poems = [];
var canvasBuffer = 30;
var buffer = 20;
var ratio = 2.1;
var selected = null;
var selectBarColor = "#b1cdd1";//background left
var displayColor = "#93d0d1";//background right
var deselectColor = "#000";//font color of all writing
var selectColor = "#fff";//font color of selected poem

function init(){
  canvas = $('#canvas')[0];
  context = canvas.getContext("2d");
  paper = new Raphael(canvasBuffer+(canvas.width/ratio), canvasBuffer, 2*(canvas.width/ratio), canvas.height);
  selectBar = new Raphael(canvasBuffer, canvasBuffer, canvas.width/ratio, canvas.height);
  var rect1 = paper.rect(0, 0, canvas.width, canvas.height);
  rect1.attr("fill", displayColor);
  rect1.attr("stroke", "#000");
  var rect2 = selectBar.rect(0, 0, canvas.width, canvas.height);
  rect2.attr("fill", selectBarColor);
  rect2.attr("stroke", "#000");
  //var circle = selectBar.circle(50,40,10);
  //circle.attr("fill","#f00");
  //var circle = paper.circle(50,40,10);
  //circle.attr("fill","#f00");


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
      //var lines = text.split(/[\r\n]+/g);
      var lines = text.split("\n");

      for(var i = 0; i < lines.length; i++) {
          output.push(lines[i]);
      }
      poems.push(new Poem(output));
      output = [];
    };
    reader.readAsText(f,"UTF-8");

   }

   reader.onloadend = function(e){
     var selectHeader = selectBar.text(buffer,buffer,"Choose a Poem");
     selectHeader.attr({font: "20px Fontin-Sans, Helvetica", fill: deselectColor, "text-anchor": "start"});

   var poemList = selectBar.set();
     for(var j=0;j<poems.length;j++){
         toAdd = selectBar.text(buffer,(buffer*2)+(15*j),poems[j].title);
         toAdd.data('poem',poems[j]);
         toAdd.click(function(){
         /*selectBar.clear();
         var rect2 = selectBar.rect(0, 0, canvas.width, canvas.height);
         rect2.attr("fill", "#0f0");
         rect2.attr("stroke", "#000");
         var selectHeader = selectBar.text(60,100,"Choose a Poem");
         selectHeader.attr({font: "20px Fontin-Sans, Helvetica", fill: "#000", "text-anchor": "start"});

         poemList.forEach(function(e){
           j=0;
           selectBar.text(20,130+(200*j),e.data('poem').title);
           e.attr({font: "16px Fontin-Sans, Helvetica", fill: "#000", "text-anchor": "start"});
           j++;
         });
         */
         paper.clear();
         if(selected!=null){
           selected.attr("fill", deselectColor);
         }
          selected = this;
         this.attr("fill",selectColor);
         var rect1 = paper.rect(0, 0, canvas.width, canvas.height);
         rect1.attr("fill", displayColor);
         rect1.attr("stroke", "#000");
         this.data('poem').displayPoem();
       });
         poemList.push(toAdd);
     }
        poemList.attr({font: "12px Fontin-Sans, Helvetica", fill: deselectColor, "text-anchor": "start"});
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
  var lineSpacing = 12;
  var header = paper.text(buffer,buffer,this.title);
  header.attr({font: "16px Fontin-Sans, Helvetica", fill: deselectColor, "text-anchor": "start"});
  var lines = [];//array of lines (set of text boxes)
  var i,j;
  //lines.attr({font: "16px Fontin-Sans, Helvetica", fill: "#000", "text-anchor": "start"});
  for(i=0;i<this.lines.length;i++){//go through every lines
    var thisLine = paper.set();//set of text boxes (words)
    var x = buffer;//starting position for each line
    for(j=0;j<this.lines[i].line.length;j++){//for every word in this lines
      thisLine.push(paper.text(x,(buffer*2.2)+(lineSpacing*i),this.lines[i].line[j]));

      thisLine[j].attr({font: "10px Fontin-Sans, Helvetica", fill: deselectColor, "text-anchor": "start"});
      //create new text box to be displayed at x position, constant y for this line, with text from next word of this line of poem
      //console.log(this.lines[i].line[j]);
      x += thisLine[j].node.getBBox().width+5;
    }
    lines.push(thisLine);
    lines[i].attr({font: "10px Fontin-Sans, Helvetica", fill: deselectColor, "text-anchor": "start"});
  }
}

Poem.prototype.printPoem = function(){
  console.log(this.title);

  for(var h=0;h<this.lines.length;h++){
    console.log(this.lines[h].line);
  }
}

function Line(poem,line){
  this.poem = poem;
  this.line = line.split(" ");
}

$(document).ready(function() {
    init();
});
