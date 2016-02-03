
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
var poemList; // collection of raphael text (titles)
var lineSpacing = 12;
var listY = buffer+lineSpacing;

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

      var thisPoem = new Poem(output);
      poems.push(thisPoem);

      var item = selectBar.text(buffer,listY,output[0]);
      item.attr({font: "12px Fontin-Sans, Helvetica", fill: deselectColor, "text-anchor": "start"});
      //console.log(item);
  //    item.attr("anchor","start");
      listY += lineSpacing+2;
      item.data("poem",thisPoem);
      item.click(function(){
        if(selected!=null){
          selected.attr("fill", deselectColor);
          selected.data('poem').hidePoem();
          //hide poem
        }
        selected = this;
        //console.log(this.data('poem'));
        this.attr("fill"),selectColor;
        this.data('poem').showPoem();
      });

      output = [];


    };
    reader.readAsText(f,"UTF-8");

   }

 //   reader.onloadend = function(e){
 //     var selectHeader = selectBar.text(buffer,buffer,"Choose a Poem");
 //     selectHeader.attr({font: "20px Fontin-Sans, Helvetica", fill: deselectColor, "text-anchor": "start"});
 //
 //     poemList = selectBar.set();
 //     for(var j=0;j<poems.length;j++){
 //         toAdd = selectBar.text(buffer,(buffer*2)+(15*j),poems[j].titleString);
 //         toAdd.data('poem',poems[j]);
 //         toAdd.click(function(){
 //         if(selected!=null){
 //           selected.attr("fill", deselectColor);
 //           this.data('poem').hidePoem();
 //         }
 //          selected = this;
 //         this.attr("fill",selectColor);
 //
 //         this.data('poem').showPoem();
 //       });
 //         poemList.push(toAdd);
 //     }
 //        poemList.attr({font: "12px Fontin-Sans, Helvetica", fill: deselectColor, "text-anchor": "start"});
 // };
 }



function Poem(data){
  var y = buffer;
  this.titleString= data[0];
  this.title = paper.text(buffer,y,data[0]);
  this.title.attr({font: "16px Fontin-Sans, Helvetica", fill: deselectColor, "text-anchor": "start"});
  this.lines = [];//array of lines
  this.title.hide();
  y += lineSpacing;
  for(var i = 1; i<data.length;i++){
    this.lines.push(new Line(this.title,data[i],y));
    y += lineSpacing;
  }
}

Poem.prototype.hidePoem = function(){
  this.title.hide();
  for(var i =0 ;i<this.lines.length;i++){
    for(var j=0; j<this.lines[i].line.length;j++){
      this.lines[i].line[j].hide();
    }
  }
}

Poem.prototype.showPoem = function(){
  this.title.show();
  for(var i =0 ;i<this.lines.length;i++){
    for(var j=0; j<this.lines[i].line.length;j++){
      this.lines[i].line[j].show();
    }
  }
}

function Line(poem,line,y){
  this.poem = poem;
  var splitLine = line.split(" ");
  this.line = paper.set();
  x = buffer;
  for(var j=0;j<splitLine.length;j++){
    //console.log(splitLine[j]);
    this.line.push(paper.text(x,y,splitLine[j]));
    this.line[j].attr({font: "10px Fontin-Sans, Helvetica", fill: deselectColor, "text-anchor": "start"});
    x += this.line[j].node.getBBox().width+5;
    this.line[j].hide();
  }
}

$(document).ready(function() {
    init();
});
