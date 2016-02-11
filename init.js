
var poemContext;
var poemCanvas;
var poemPaper;

var poems = [];
var canvasBuffer = 30;
var buffer = 20;
var ratio = 2.1;
var selected = null;
var selectBarColor = "#b1cdd1";//background left
var displayColor = "#93d0d1";//background right
var deselectColor = "#000";//font color of all writing
var selectColor = "#fff";//font color of selected poem
var containsColor = "d12e22";
var lineSpacing = 12;
var poemList;
var listY = buffer+lineSpacing;
var currWord = "";

function init(){
  poemCanvas = $('#poem')[0];
  poemContext = poemCanvas.getContext("2d");
  poemPaper = new Raphael(poemCanvas.width,canvasBuffer,poemCanvas.width,poemCanvas.height);
  //poemPaper = new Raphael(canvasBuffer+(poemCanvas.width/ratio), canvasBuffer, 2*(poemCanvas.width/ratio), poemCanvas.height);

  selectBarCanvas = $('#list')[0];
  selectContext = selectBarCanvas.getContext("2d");
  selectBar = new Raphael(canvasBuffer,canvasBuffer,selectBarCanvas.width,selectBarCanvas.height);
  //selectBar = new Raphael(canvasBuffer, canvasBuffer, poemCanvas.width/ratio, poemCanvas.height);
  var rect1 = poemPaper.rect(0, 0, poemCanvas.width, poemCanvas.height);
  rect1.attr("fill", displayColor);
  rect1.attr("stroke", "#000");
  var rect2 = selectBar.rect(0, 0, poemCanvas.width, poemCanvas.height);
  rect2.attr("fill", selectBarColor);
  rect2.attr("stroke", "#000");
  poemList = selectBar.set();
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
      poemList.push(item);
      item.click(function(){
        if(selected!=null){
          selected.attr("fill", deselectColor);
          selected.data('poem').hidePoem();
          if(selected.data('poem').contains()) selected.attr("fill",containsColor);
          //hide poem
        }


        selected = this;

        selected.data('poem').searchPoem();

        //console.log(this.data('poem'));
        this.attr("fill",selectColor);
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
  this.title = poemPaper.text(buffer,y,data[0]);
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

function searchList(){
  // word = word.toLowerCase();
  // if(word.includes(',') || word.includes('.') || word.includes('?') || word.includes('!')){
  //   word = word.substring(0,word.length-1);
  // }
  var found;
  for(var i=0;i<poemList.length;i++){
    found = 0;
    if(poemList[i]==selected){

      continue;
    }
    for(var j=0;j<poemList[i].data('poem').lines.length;j++){
    //  console.log(poemList[i].data('poem').lines[j].length);

      for(var k=0;k<poemList[i].data('poem').lines[j].line.length;k++){
        var w = poemList[i].data('poem').lines[j].line[k].attr('text').toLowerCase();
        if(w.includes(',') || w.includes('.') || w.includes('?') || w.includes('!')){
          w = w.substring(0,w.length-1);
        }
        //console.log(w);
        if(w == currWord){
          //console.log("found match");
          poemList[i].attr("fill",containsColor);
          poems[i].searchPoem();
          found = 1;
          //break;
          //this.lines[i].line[j].attr("fill", selectColor);
        }
        // else{
        //   poemList[i].attr("fill", deselectColor);
        // }

      }
      if(!found) poemList[i].attr("fill",deselectColor);
      //if(found) break;
    }



  }



}


Poem.prototype.searchPoem = function(){
  if(currWord == "") return;
  // word = word.toLowerCase();
  // if(word.includes(',') || word.includes('.') || word.includes('?') || word.includes('!')){
  //   word = word.substring(0,word.length-1);
  // }
  for(var i = 0; i<this.lines.length;i++){//for every line in this poem
    for(var j=0; j<this.lines[i].line.length;j++){//for every word in this line

      var w = this.lines[i].line[j].attr('text').toLowerCase();
      if(w.includes(',') || w.includes('.') || w.includes('?') || w.includes('!')){
        w = w.substring(0,w.length-1);
      }
      if(w == currWord){
        this.lines[i].line[j].attr("fill", containsColor);
      }
      else{
        this.lines[i].line[j].attr("fill", deselectColor);
      }
    }
  }
}

Poem.prototype.contains = function(){
  if(currWord == "") return;
  // word = word.toLowerCase();
  // if(word.includes(',') || word.includes('.') || word.includes('?') || word.includes('!')){
  //   word = word.substring(0,word.length-1);
  // }
  for(var i = 0; i<this.lines.length;i++){//for every line in this poem
    for(var j=0; j<this.lines[i].line.length;j++){//for every word in this line

      var w = this.lines[i].line[j].attr('text').toLowerCase();
      if(w.includes(',') || w.includes('.') || w.includes('?') || w.includes('!')){
        w = w.substring(0,w.length-1);
      }
      if(w == currWord){
        return 1;
      }
    }
  }

  return 0;
}




function Line(poem,line,y){
  this.poem = poem;
  var splitLine = line.split(" ");
  this.line = poemPaper.set();
  x = buffer;
  for(var j=0;j<splitLine.length;j++){
    //console.log(splitLine[j]);
    this.line.push(poemPaper.text(x,y,splitLine[j]));
    this.line[j].attr({font: "10px Fontin-Sans, Helvetica", fill: deselectColor, "text-anchor": "start"});



    this.line[j].click(function(){
    //  console.log(this.attr('text'));

      var w = this.attr('text').toLowerCase();
      if(w.includes(',') || w.includes('.') || w.includes('?') || w.includes('!')){
        w = w.substring(0,w.length-1);
      }
      currWord = w;

      //selected.data('poem').searchPoem(this.attr('text'));
      selected.data('poem').searchPoem();
      searchList();

    });


    x += this.line[j].node.getBBox().width+5;
    this.line[j].hide();
  }
}

$(document).ready(function() {
    init();
});
