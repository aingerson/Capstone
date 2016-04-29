
//Canvases
var poemPaper;
var selectBar;
// Array of Poems
var poems = [];
// JSON for tree
var treejson = {};


//Misc values
var canvasBuffer = 30;
var buffer = 20; //border buffer
var ratio = 2.1; //ratio between poem list screen and poem display screen
var lineSpacing = 12;

//Background colors
var listColor = "aabae2"; //background left
var poemColor = "#fff"; //background right
//Font colors
var deselectColor = "#000"; //font color of all writing
var selectColor = "#fff"; //font color of selected poem
var containsColor = "d12e22"; //font color of selected word

var poemList; //list of poem name raphael objects
var listY = buffer + lineSpacing; //y coordinate of poem list names
var currWord = ""; //current selected word
var selected = null; //current selected poem
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
``
var head;
var dist = 2;
var maxWidth = 300;
var maxWidthList = 100;
var maxHeight =300;
var center = null;
var graph;
var tree;
var edges = [];

/*
//TODO ignore this i'm just testing some stuff
function setInsigWords(){
  console.log(document.getElementById("poem"));
  var temp = "test text<button>";
  document.getElementById("poem").innerHTML = temp;
  console.log(document.getElementById("poem"));

}
setInsigWords();
*/

//initializes canvases
function init() {
    //Raphael canvas for poem list
    selectBar = new Raphael('list','100%','100%');
    poemList = selectBar.set();

    //File select listener
    document.getElementById('files').addEventListener('change', handleFileSelect, false);
    head = null;

    graph = {};
    graph.nodes = [];
    graph.links = [];
    adjustSizes();
}


function adjustSizes(){
  var selectHeight = poemList.length*15;
  var newHeight = Math.max(400,selectHeight);
  selectBar.setSize(maxWidth, newHeight);
  $(selectBar.canvas).parent().height("400px");
  
  $("poem").height(maxHeight);
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
  //console.log(edges);
  for(var i=0;i<edges.length;i++){
    if(edges[i]==null) continue;
    if(!nodeInGraph(edges[i].w1)){//if w1 not in graph yet, create new node
    //  console.log("Adding "+edges[i].w1);
      var newNode = {};
      newNode.name = edges[i].w1;
      newNode.group = 1;
      graph.nodes.push(newNode);
      //console.log("Create new node 1");
    }
    if(!nodeInGraph(edges[i].w2)){//if w2 not in graph yet, create new nodeInGraph
    //  console.log("Adding "+edges[i].w2);

      var newNode = {};
      newNode.name = edges[i].w2;
      newNode.group = 1;
      graph.nodes.push(newNode);
      //console.log("Create new node 2");
    }
    if(!edgeInGraph(edges[i])){//if no link exists between already, create new link
      var newLink = {};
      newLink.source=findIndex(edges[i].w1);
      newLink.target=findIndex(edges[i].w2);
      graph.links.push(newLink);
    }
  }
  //console.log(graph);
  makeGraph(graph);
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
  for(var j=0;j<graph.links.length;j++){
    if((graph.links[j].source.name==edge.w1 && graph.links[j].target.name==edge.w2) || (graph.links[j].source.name==edge.w1 && graph.links[j].target.name==edge.w2)){
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
    if(edges[i]==null) continue;
    if(edges[i].w1==deleteWord || edges[i].w2==deleteWord){
      edges.splice(i,1);
    }
  }
//  console.log(edges);
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

function clickTest(word){
  toDeselect = $(idOf(currWord))
  for(var i=0;i<toDeselect.length;i++){
    toDeselect[i].classList.remove("currWord");
  }
  currWord = word;
  searchPoems(word);
}

//creates a new Poem object
function Poem(data) {
    this.title = data[0];

    this.sigWords = {};
    this.allSigWords = [];
    this.rawLines = data.slice(2);
    this.lines = [];

    for(var i = 0; i<this.rawLines.length;i++){
      var splitLine = this.rawLines[i].split(" ")
      //All of the lines split into an array

      var sigNormalized = [];
      //This will hold all of the normalized significant words in this line

      for (var j = 0; j < splitLine.length; j++) {
        if(j===0){
          this.lines[i] = [];
        }
          this.lines[i].push(splitLine[j]);

          var w = normalize(splitLine[j]);
          if(isInList(w,insigWords)){
            continue;
          }
          else{
            sigNormalized.push(w);
            this.allSigWords.push(w);
          }
      }
      this.sigWords[i] = sigNormalized;
      sigNormalized = [];
    }
}

//displays entire poem
Poem.prototype.showPoem = function() {
    //Header for poem section
    var html = "<h2 class='poemtitle'>"+this.title+"</h2><ul class='poemlines'>"
    //For each line:
    for (var i = 0; i<this.lines.length;i++){
      var l = this.lines[i];
      //Check if a blank line: if blank, add a break and continue
      if(l == ""){
        l = "<li>&nbsp;</li>";
        html = html+l;
        continue;
      } else{
      var lineID = "line_"+i;
      html = html + "<li class='line' id="+lineID+">";
      for(var w=0;w<l.length;w++){
        var newHtml = "";
        var n = normalize(l[w]);
        if(!isInList(n,insigWords)){
          var wordID = "word_"+n;
          newHtml = "<span class="+wordID+" onclick=clickTest('"+n+"')>";
          if(currWord == n){
            newHtml = "<span class='"+wordID+" currWord' onclick=clickTest('"+n+"')>";
          }
          newHtml = newHtml + l[w];
          newHtml = newHtml + "</span> "
        } else{
          newHtml = newHtml + l[w] + " ";
        }
        html = html+newHtml;
      }
      html = html + "</li>";
    }
  }
    html = html+"</ul>";
    document.getElementById("poem").innerHTML = html;
}

function idOf(word){
  return ".word_"+word;
}

//searches all poems for the currently selected word and changes highlighting appropriately
function searchPoems() {
  edges = [];
  var foundAll = [];
    for (var i = 0; i < poemList.length; i++) { //go through every poem
        var p = poemList[i].data('poem'); //grab its respective poem
        var poemTitle = poemList[i];
        var found = false; //marks whether we found the word in the poem
        for (var j = 0; j < p.allSigWords.length; j++) { //go through every line in this poem
              var w = p.allSigWords[j];
              if (w == currWord) { //this is the word we're looking for
                toSelect = $(idOf(w));
                for(var y=0;y<toSelect.length;y++){
                  toSelect[y].classList.add("currWord");
                }
                found = true; //and remember that you found one
          for(var d = j-dist; d<=j+dist; d++){
            if(d>=0 && d<p.allSigWords.length){
            var word = p.allSigWords[d];
            if(!isInList(word,foundAll) && word != "" && word!=currWord){
              if(!isEdge(currWord,word)){
                foundAll.push(word);
                edges.push(new Edge(currWord,word,poemTitle));
              }
              else{
                var thisEdge= getEdge(currWord,word);
                thisEdge.addPoem(poemTitle);
              }
            }
            }
          }
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
        treejson.children[h] = {"name" : foundAll[h],"children":[]};
    }
    makeTree(treejson);
  }

function showConnections(word1, word2){
  //console.log("Show "+word1+", "+word2);
  var e = getEdge(word1,word2);
  //console.log(e);
  //console.log(edges);
  if(e==null) return;
    selected.data('poem').hidePoem();
    for(var j = 0;j<poemList.length;j++){
      poemList[j].attr("fill",deselectColor);
    }
    for(var j = 0;j<e.poems.length;j++){
      e.poems[j].attr("fill",containsColor);
    }
    if(e.poems.length==1){
      selected = e.poems[0];
      selected.data('poem').showPoem();
      selected.attr("fill",selectColor);
    }
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

function Edge(w1,w2,p){
  this.w1 = w1;
  this.w2 = w2;
  this.poems = [];
  this.poems.push(p);
}

function findConnections(word){
  currWord = word;
  var foundLeft = [];
  var foundRight = [];
  var foundAll = [];
    for (var i = 0; i < poemList.length; i++) { //go through every poem
        var p = poemList[i].data('poem'); //grab its respective poem
        var poemTitle = poemList[i];
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
                      // foundAll.push(word);
                      // edges.push(new Edge(currWord,word));
                      //console.log(edges[edges.length-1]);
                      if(!isEdge(currWord,word)){
                        foundAll.push(word);
                        edges.push(new Edge(currWord,word,poemTitle));
                      }
                      else{
                        var thisEdge= getEdge(currWord,word);
                        thisEdge.addPoem(poemTitle);
                      }

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

function updateTree(newTree){
  tree = newTree;
}
//saveAsFile(this, "YourContent", "HelloWorldFile");

//returns whether this poem contains the current word
Poem.prototype.contains = function() {
    if (currWord == "") return 0; //no selected word
    for (var i = 0; i < this.lines.length; i++) { //for every line in this poem
        words = this.sigWords[i];
        if($.inArray(currWord, words)){
          return 1;
        }
    }
    return 0; //couldn't find one
}

function getEdge(word1,word2){
  for(var g = 0; g<edges.length;g++){
    if(edges[g]==null) continue;
    if((edges[g].w1==word1 && edges[g].w2==word2) || (edges[g].w1==word2 && edges[g].w2==word1)){
      return edges[g];
    }
  }
  return null;
}

//   var ret = [];
//   for(var t = 0;t<edges.length;t++){
//     if((edges[t].w1==word1 && edges[t].w2==word2) || (edges[t].w1==word2 && edges[t].w2==word1)){
//       ret.push(edges[t]);
//     }
//   }
//   return ret;
// }

Edge.prototype.addPoem = function(p){
  this.poems.add(p);
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
