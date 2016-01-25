
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
      result = reader.result;

    }
    reader.readAsText(files[i]);
    console.log(result);
    //var contents = evt.target.result;

    // Code to execute for every file selected
   }
 }

function Poem(file){
  var reader = new FileReader();
  reader.onload = function () {
    var fileContents = this.result;
    console.log(fileContents);

  };

  reader.readAsText(file);

  console.log(this.result);


}


function Line(poem,line){
  this.line = line;
  this.poem = poem;
}

$(document).ready(function() {
    init();
});
