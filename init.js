
var context;
var canvas;
var paper;
var numPoems = 2;
var poems = [];



function init(){
  canvas = $('#canvas')[0];
  context = canvas.getContext("2d");
  paper = new Raphael(8, 8, canvas.width, canvas.height);
  var circle = paper.circle(50,40,10);
  circle.attr("fill","#f00");

  document.getElementById('files').addEventListener('change',handleFileSelect,false);

  // for (var j = 0; j < numPoems; j++) {
  //     poem = new Poem(new File([""],"poems/" + j + ".txt",null));
  //     poems.push(poem);
  // }
// if (window.File && window.FileReader && window.FileList && window.Blob) {
// var fileSelected = document.getElementById('fileToRead');
// var fileRead = fileSelected.files[0];
//   //Initialize the FileReader object to read the 2file
//     var fileReader = new FileReader();
//     fileReader.onload = function (e) {
//       var t = paper.text(50,50,fileReader.result);
//     }
//     //fileReader.readAsText(fileRead);
//   }
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
     //poems[0].printPoem();

     for(var j=0;j<poems.length;j++){


          //some sort of code that displays list of poems in poems[]
          //each poem will be clickable and will open entire list of lines

         poems[j].printPoem();
     }
   }



 }

function Poem(data){
  this.title = data[0];
  this.lines = [];
  for(var i = 1; i<data.length;i++){
    this.lines.push(new Line(this.title,data[i]));
  }
}

Poem.prototype.printPoem = function(){
  console.log(this.title);

  for(var h=0;h<this.lines.length;h++){
    console.log(this.lines[h].line);
  }
  //console.log(this.lines);
}

/*
var lines = paper.set();
for (line in poem){
	lines.push(paper.text(330, 100, line);
}
	lines.attr({font: "12px Fontin-Sans, Arial", fill: "#000", "text-anchor": "start"});
*/

function Line(poem,line){
  this.line = line;
  this.poem = poem;
}

$(document).ready(function() {
    init();
});
