var poemContext;
var poemCanvas;
var poemPaper;
var treePaper;
var graphPaper;

var poems = [];
var context;
var poemPaper;
var treejson = {};

var canvasBuffer = 30;
var buffer = 20; //border buffer
var ratio = 2.1; //ratio between poem list screen and poem display screen
var selected = null; //selected poem

//Colors
var listColor = "aabae2"; //background left
var poemColor = "FFFDFC"; //background right
var treeColor = "D7C9E2";
var graphColor = "4DC0C7";

var treeStroke = "B2A7BC";

var deselectColor = "#000"; //font color of all writing
var selectColor = "#fff"; //font color of selected poem
var containsColor = "d12e22"; //font color of selected word

var lineSpacing = 12;
var time = 80;
var poemList; //list of poem name raphael objects
var listY = buffer + lineSpacing; //y coordinate of poem list names
var currWord = ""; //current selected word
var insigWords = ["of", "a", "the", "in", "over", "to", "is",
"was", "and", "or", "its", "it", "for", "my", "your", "his", "though",
"can", "at", "but", "from", "have", "has", "on", "as", "how", "her",
"she", "they", "we", "i", "ii", "iii", "iv", "v", "vi", "vii", "viii",
"do","not","go","come","here","into","that","so","an","shall","no","by",
"who","he","had","you","one","oh","all","with","out","through", "",
"let","if","\n","'all","i'll","me","'no","would","nor","o","are",
"going","this","their","up","last","must","any","further","down","after",
"other","there","about","were","among","their","like","once","then","need",
"only","high","him","when","are","than","be","will","should","till"];

var head;
var dist = 2;
var maxWidth = 300;
var maxWidthList = 100;
var maxHeight =300;
var center = null;
var graph;
var tree;
var edges = [];




//initializes canvases
function init() {
    poemPaper = new Raphael('poem','100%','100%');
    selectBar = new Raphael('list','100%','100%');
    //treePaper = new Raphael('tree','100%','100%');
    //graphPaper = new Raphael('graph','100%','100%');

    var rect1 = poemPaper.rect(0, 0, '100%','100%');
    rect1.attr("fill", poemColor);
        rect1.attr("stroke", poemColor);

    var rect2 = selectBar.rect(0, 0, '100%', '100%');
    rect2.attr("fill", listColor);
        rect2.attr("stroke", listColor);

    poemList = selectBar.set();
    document.getElementById('files').addEventListener('change', handleFileSelect, false);
    head = null;

    // d3.json("miserables.json",function(data){
    // return data;
    // });
    graph = {};
    graph.nodes = [];
    graph.links = [];
    //graph = Utils.loadJSON("miserables.json");

    //console.log(graph);
   makeGraph(graph);//initial test graph
}


function adjustSizes(){
  poemPaper.setSize(maxWidth*1.3, maxHeight+(buffer*10));
  $(poemPaper.canvas).parent().height("400px");

  selectBar.setSize(maxWidth, maxHeight+(buffer*10));
  $(selectBar.canvas).parent().height("400px");
}

function handleFileSelect(evt) {
    var files = evt.target.files;
    var numFiles = 5;
    for(var i=0;i<files.length;i+=numFiles){
      if(i+numFiles<files.length){
        scanFiles(files,i,i+numFiles);
      }
      else{
        scanFiles(files,i,files.length);
      }
    }
}

function addToGraph(){
  //edges - w1,w2
  //graph - links (source,target,value(1)),nodes
  for(var i=0;i<edges.length;i++){
    if(!nodeInGraph(edges[i].w1)){//if w1 not in graph yet, create new node
      var newNode = {};
      newNode.name = edges[i].w1;
      newNode.group = 1;
      graph.nodes.push(newNode);
      //console.log("Create new node 1");
    }
    if(!nodeInGraph(edges[i].w2)){//if w2 not in graph yet, create new nodeInGraph
      var newNode = {};
      newNode.name = edges[i].w2;
      newNode.group = 1;
      graph.nodes.push(newNode);
      //console.log("Create new node 2");
    }
    if(!edgeInGraph(edges[i])){//if no link exists between already, create new link
      var link = {};
      link.source=findIndex(edges[i].w1);
      link.target=findIndex(edges[i].w2);
      graph.links.push(link);
    }
  }
  makeGraph(graph);
  //console.log(edges);
  //console.log(graph);
}

function nodeInGraph(node){
  //console.log("Searching for " + node);
  for(var j=0;j<graph.nodes.length;j++){
    //console.log(graph.nodes[j]+"!="+node);
    if(graph.nodes[j].name==node){
      //console.log(node +" already in graph");
      return true;
    }
  }
  return false;
}

function edgeInGraph(edge){
  for(var j=0;j<graph.links;j++){
    if((source==findIndex(edge.w1) && target==findIndex(edge.w2)) || (source==findIndex(edge.w1) && target==findIndex(edge.w2))){
      return true;
    }
  }
  return false;
}

function findIndex(name){
  for(var i=0;i<graph.nodes.length;i++){
    if(graph.nodes[i].name==name) return i;
  }
  return -1;
}

function deleteFromEdges(deleteWord){
  for(var i=0;i<edges.length;i++){
    if(edges[i].w1==deleteWord || edges[i].w2==deleteWord){
      edges.splice(i,1);
    }
  }
  console.log(edges);
}

function scanFiles(files,i,j){
  var output = [];
  var f;
  for (;i<j; i++) { //read every file
      f = files[i];
      var reader = new FileReader();
      var result;
      reader.onload = function(e) {
          var text = e.target.result;
          var lines = text.split("\n");

          for (var i = 0; i < lines.length; i++) { //scan the whole text file
              output.push(lines[i]);
          }
          var thisPoem = new Poem(output); //make a new poem with the file contents
          var item = selectBar.text(buffer, listY, output[0]); //this is the poem name in the select bar
          output = []; //clear data buffer

          item.attr({
              font: "12px Fontin-Sans, Helvetica",
              fill: deselectColor,
              "text-anchor": "start"
          });
          listY += lineSpacing + 2;
          item.data("poem", thisPoem); //link actual Poem object to clickable raphael object
          poemList.push(item); //add it to the list
          item.click(function() { //click function for poem name
              if (selected != null) { //if other poem was selected before this
                  selected.data('poem').hidePoem(); //hide this poem
                  if (selected.data('poem').contains()) selected.attr("fill", containsColor); //if contains the current word, red
                  else selected.attr("fill", deselectColor); //else black
              }
              selected = this; //now this one is selected
              this.attr("fill", selectColor); //change the color of this item
              this.data('poem').showPoem(); //and show its poem
          });
      };
      reader.readAsText(f, "UTF-8");
      reader.onloadend = function(e){
        adjustSizes();
      };
  }
}

//creates a new Poem object
function Poem(data) {
    var localWidth = 0;
    var y = buffer; //y coordinate for title and lines
    this.title = poemPaper.text(buffer, y, data[0]); //poem title text
    this.title.attr({
        font: "16px Fontin-Sans, Helvetica",
        fill: deselectColor,
        "text-anchor": "start"
    });
    this.sigWords = []; //list of significant words (clickable, searchable words)
    this.words = []; //all words of this poem (for displaying purposes)
    this.title.hide(); //Poem created on load, start with poem hidden
    y += lineSpacing; //move y coordinate down for first line

    for (var i = 1; i < data.length; i++) { //go through every line
        var splitLine = data[i].split(" "); //split the line into an array of words
        x = buffer; //start on the left
        var building = "";
        for (var j = 0; j < splitLine.length; j++) { //go through every word
            var w = normalize(splitLine[j]);
            if(isInList(w,insigWords)){
              building+=splitLine[j] + " ";
            }
            else{
              //console.log(w);


              if(building!=""){
                var prevWord = poemPaper.text(x,y,building);
                prevWord.attr({
                  font: "10px Fontin-Sans, Helvetica",
                  fill: deselectColor,
                  "text-anchor":"start"
                });
                x+= prevWord.node.getBBox().width+5;
                this.words.push(prevWord);
                prevWord.hide();
              }

              var thisWord = poemPaper.text(x,y,splitLine[j]);
              thisWord.attr({
                font: "10px Fontin-Sans, Helvetica",
                fill: deselectColor,
                "text-anchor":"start"
              });
              thisWord.click(function(){
                currWord = normalize(this.attr("text"));
                searchPoems();
              });
              this.sigWords.push(thisWord);
              this.words.push(thisWord);
              x += thisWord.node.getBBox().width+3;
              thisWord.hide();
              building="";
            }
          }
          if(x>localWidth) localWidth = x;
          y+=lineSpacing;
        }
        if(localWidth>maxWidth) maxWidth = localWidth;
        if(y>maxHeight) maxHeight = y;

}

//hides entire poem
Poem.prototype.hidePoem = function() {
    this.title.hide(); //hide the title
    for (var i = 0; i < this.words.length; i++) { //hide every word of this poem
        this.words[i].hide();
    }
}


//displays entire poem
Poem.prototype.showPoem = function() {
    this.title.show(); //display title
    for (var i = 0; i < this.words.length; i++) { //display every word of this poem
        this.words[i].show();
    }
}

//searches all poems for the currently selected word and changes highlighting appropriately
function searchPoems() {
  edges = [];
  var foundLeft = [];
  var foundRight = [];
  var foundAll = [];
    for (var i = 0; i < poemList.length; i++) { //go through every poem
        var p = poemList[i].data('poem'); //grab its respective poem
        var found = false; //marks whether we found the word in the poem
        for (var j = 0; j < p.sigWords.length; j++) { //go through every word in this poem
            var w = normalize(p.sigWords[j].attr('text')); //get rid of case and punctuation
            if (w == currWord) { //this is the word we're looking for
                p.sigWords[j].attr("fill", containsColor); //color it
                found = true; //and remember that you found one

                for(var d = j-dist; d<=j+dist; d++){
                  if(d>=0 && d<p.sigWords.length){
                  var word = normalize(p.sigWords[d].attr('text'));
                  if(!isInList(word,foundAll) && word != "" && word!=currWord){
                    if(!isEdge(currWord,word)){
                      foundAll.push(word);
                      edges.push(new Edge(currWord,word));
                    }

                  }
                }
              }
            } else {
                p.sigWords[j].attr("fill", deselectColor); //make sure its unselected
            }
        }
        if (found) { //found the current word in this poem
            if (poemList[i] == selected) poemList[i].attr("fill", selectColor); //if this is the currently selected poem, selected color
            else poemList[i].attr("fill", containsColor); //highlight this poem if we found it
        } else {
            poemList[i].attr("fill", deselectColor); //did not find the word in this poem
        }
    }
    treejson.name = currWord;
    treejson.children = [];
    for(var h=0;h<foundAll.length;h++){
      //console.log(foundAll[h]);
        treejson.children[h] = {"name" : foundAll[h],"children":[]};
    }
    //treejson.children = foundAll;

    makeTree(treejson);

    //JSON.stringify(treejson);
    //console.log(treejson);

    //saveAsFile(this,treejson,"tree");
    //saveAs(treejson,"tree.json");
    //var next = new Node(headWord,connLeft,connRight,head);
    //head = next;
    //displayTree();
}

function isEdge(word1,word2){
  for(var m = 0;m<edges.length;m++){
    if(edges[m]==null) continue;
    if((word1==edges[m].w1 && word2==edges[m].w2) || (word1==edges[m].w2 && word2==edges[m].w1)) return true;
  }
  return false;

}
function saveAsFile(link, content, filename) {
    var blob = new Blob([content], {type: "text/text"});
    var url  = URL.createObjectURL(blob);

    // update link to new 'url'
    link.download    = filename + ".json";
    link.href        = url;

    console.log("save");
}

function Edge(w1,w2){
  this.w1 = w1;
  this.w2 = w2;
}

function findConnections(word){
  currWord = word;
  var foundLeft = [];
  var foundRight = [];
  var foundAll = [];
    for (var i = 0; i < poemList.length; i++) { //go through every poem
        var p = poemList[i].data('poem'); //grab its respective poem
        var found = false; //marks whether we found the word in the poem
        for (var j = 0; j < p.sigWords.length; j++) { //go through every word in this poem
            var w = normalize(p.sigWords[j].attr('text')); //get rid of case and punctuation
            if (w == currWord) { //this is the word we're looking for
                p.sigWords[j].attr("fill", containsColor); //color it
                found = true; //and remember that you found one


                for(var d = j-dist; d<=j+dist; d++){
                  if(d>=0 && d<p.sigWords.length){
                  var word = normalize(p.sigWords[d].attr('text'));
                  if(!isInList(word,foundAll) && word != "" && word!=currWord){
                    if(!isEdge(currWord,word)){
                      foundAll.push(word);
                      edges.push(new Edge(currWord,word));
                      //console.log(edges[edges.length-1]);

                    }
                  }
                }
              }

            } else {
                p.sigWords[j].attr("fill", deselectColor); //make sure its unselected
            }
        }
        if (found) { //found the current word in this poem
            if (poemList[i] == selected) poemList[i].attr("fill", selectColor); //if this is the currently selected poem, selected color
            else poemList[i].attr("fill", containsColor); //highlight this poem if we found it
        } else {
            poemList[i].attr("fill", deselectColor); //did not find the word in this poem
        }
    }
    var children = [];
    for(var h=0;h<foundAll.length;h++){
        children[h] = {"name" : foundAll[h],"children":[]};
    }
    return children;
}


//saveAsFile(this, "YourContent", "HelloWorldFile");

//returns whether this poem contains the current word
Poem.prototype.contains = function() {
    if (currWord == "") return 0; //no selected word
    for (var i = 0; i < this.words.length; i++) { //for every line in this poem
        var w = normalize(this.words[i].attr('text')); //get rid of case and punctuation
        if (w == currWord) { //found one
            return 1;
        }
    }
    return 0; //couldn't find one
}

//gets rid of casing and punctuation
function normalize(w) {
    w = w.toLowerCase();
    var c = has(w);
    while(c!=""){
        var index = w.indexOf(c);
        if(index==0) w = w.substring(1,w.length);
        else if(index==w.length-1) w = w.substring(0,w.length-1);
        else w = w.substring(0,index) + w.substring(index+1,w.length);
        c = has(w);
    }
    return w;

}

function has(w){
  if(w.includes('\'')) return ('\'');
  if(w.includes(',')) return (',');
  if(w.includes('.')) return ('.');
  if(w.includes('?')) return ('?');
  if(w.includes('!')) return ('!');
  if(w.includes(';')) return (';');
  if(w.includes(',')) return (',');
  if(w.includes(':')) return (':');

  return "";
}

//Searches list of insignificant words (defined globally) and returns whether it is insignificant
function isInList(e,list) {
    for (var i = 0; i < list.length; i++) {
        if (list[i] == e) return true;
    }
    return false;
}

function clearChildren(name){
  for(var m = 0;m<edges.length;m++){

    if(edges[m]==null) continue;
    if(edges[m].w1 == name){
      edges[m] = null;
    }
  }
}

function displayTree(){
  if(head.prev!=null){
    head.prev.thisWord.hide();
    for(var i=0;i<head.prev.connLeft.length;i++){
      head.prev.connLeft[i].hide();
    }
    for(var i=0;i<head.prev.connRight.length;i++){
      head.prev.connRight[i].hide();
    }
  }
  head.thisWord.attr({'font-size':18});
  head.thisWord.show();
  for(var j=0;j<head.connLeft.length;j++){
    head.connLeft[j].show();
  }
  for(var j=0;j<head.connRight.length;j++){
    head.connRight[j].show();
  }
}


function Node(thisWord,left,right,prev){
  this.thisWord = thisWord;//Raph
  this.connLeft = left;//Raph
  this.connRight = right;
  this.prev = prev;//Node
}


//when the page is done loading, initialize
$(document).ready(function() {
    init();
});
