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
var graphColor = "4DC0C7"

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
"who","he","had","you","one","oh","all","with","out"];

var head;
var dist = 2;
var maxWidth = 300;
var maxWidthList = 100;
var maxHeight =300;
var center = null;
var graph;
var tree;

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
    //var rect3 = treePaper.rect(0, 0, '100%', '100%');
    //rect3.attr("fill", treeColor);
    //rect3.attr("stroke-width", 10);
    //rect3.attr("stroke", treeStroke);

    //var rect4 = graphPaper.rect(0,0,'100%','100%');
    //rect4.attr("fill",graphColor);
    //rect4.attr("stroke",graphColor);

    poemList = selectBar.set();
    document.getElementById('files').addEventListener('change', handleFileSelect, false);
    head = null;
// <<<<<<< Updated upstream
// =======
//     drawGraph();
//
// >>>>>>> Stashed changes
}

function drawGraph(){



  }

function adjustSizes(){
  poemPaper.setSize(maxWidth*1.3, maxHeight+(buffer*2));
  $(poemPaper.canvas).parent().height("400px");

  selectBar.setSize(maxWidth, maxHeight+(buffer*2));
  $(selectBar.canvas).parent().height("400px");

// <<<<<<< Updated upstream
//   treePaper.setSize('100%', maxHeight);
//   $(treePaper.canvas).parent().height("400px");
// =======
//   //treePaper.setSize('100%', maxWidth);
// //  $(treePaper.canvas).parent().height("400px");
// >>>>>>> Stashed changes
  //document.getElementById('tree').style.height = maxHeight+(buffer*2);
  //document.getElementById('tree').style.width = maxWidth;

  //$(treePaper.canvas).parent().height("400px");
}

function handleFileSelect(evt) {
    var files = evt.target.files;
    var output = [];

    for (var i = 0, f; f = files[i]; i++) { //read every file
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
    //console.log(maxWidth);
    //console.log(maxHeight);
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
        for (var j = 0; j < splitLine.length; j++) { //go through every word
            var thisWord = poemPaper.text(x, y, splitLine[j]); //make a new text box
            thisWord.attr({
                font: "10px Fontin-Sans, Helvetica",
                fill: deselectColor,
                "text-anchor": "start"
            });
            var w = normalize(splitLine[j]); //get rid of case and punctuation to check word
            if (!isInList(w,insigWords)) { //if this word is a significant word
                thisWord.click(function() { //make it clickable
                    var word = normalize(this.attr("text")); //get rid of case and punctuation
                    currWord = word; //this is now the selected word
                    searchPoems(); //search all the poems for this word


                    //displayTree();
                });
                this.sigWords.push(thisWord); //add this word to the searchable word list
            }
            this.words.push(thisWord); //and no matter what, add this word to the complete word list
            x += thisWord.node.getBBox().width + 5; //move the x coordinate over by the length of this word box
            thisWord.hide(); //when word is created, start hidden
        };
        y += lineSpacing; //move to the next line
        if(x>localWidth) localWidth = x;
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
                  if(!isInList(word,foundAll) && word != "" && word!=currWord) foundAll.push(word);
                }
              }
                // for(var d = j-dist; d<j; d++){
                //   if(d>=0){
                //     var word = normalize(p.sigWords[d].attr('text'));
                //     if(!isInList(word,foundLeft) && word != "")
                //     foundLeft.push(word);
                //     foundAll.push(word);
                //   }
                // }
                // for(var d = j+1; d<j+dist; d++){
                //   if(d<p.sigWords.length){
                //     var word = normalize(p.sigWords[d].attr('text'));
                //     if(!isInList(word,foundRight) && word != "")
                //       foundRight.push(word);
                //       foundAll.push(word);
                //   }
                // }

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
    //console.log(foundWords);
    //+++++++++++++++++
    //this is where tree displaying stuff should happen vvv
    //+++++++++++++++++
    // var treeWidth = $("#tree").width();
    // var treeHeight = $("#tree").height();
    // var connLeft = treePaper.set();
    // var connRight = treePaper.set();
    // var headX = treeWidth/2;
    // var headY = treeHeight/2;
    // var temp = treePaper.text(headX, headY, currWord);
    // if(center==null){
    //   center = treePaper.ellipse(headX, headY, temp.node.getBBox().width+5, temp.node.getBBox().height+5);
    //   center.attr("fill", 'FFFFFF');
    //   center.attr("stroke", 'FFFFFF');
    // }
    // else{
    //   center.animate({rx: temp.node.getBBox().width+5},time);
    // //  center.rx = headWord.node.getBBox().width;
    //   //center.ry = headWord.node.getBBox().height;
    // }
    // temp.hide();
    // var headWord = treePaper.text(headX,headY,currWord);
    //
    // var x = headX - buffer*5;
    // var y = headY-(foundLeft.length/2*lineSpacing);
    // for(var k=0; k<foundLeft.length; k++){
    //   var thisWord = treePaper.text(x,y,foundLeft[k]);
    //   thisWord.click(function() { //make it clickable
    //       //var word = normalize(this.attr("text")); //get rid of case and punctuation
    //       currWord = this.attr('text'); //this is now the selected word
    //       searchPoems(); //search all the poems for this word
    //   });
    //   connLeft.push(thisWord);
    //   y += lineSpacing;
    // }
    // x = headX+ (buffer*5);
    // y = headY-(foundRight.length/2*lineSpacing);
    // for(var k=0; k<foundRight.length; k++){
    //   var thisWord = treePaper.text(x,y,foundRight[k]);
    //   thisWord.click(function() { //make it clickable
    //       //var word = normalize(this.attr("text")); //get rid of case and punctuation
    //       currWord = this.attr('text'); //this is now the selected word
    //       searchPoems(); //search all the poems for this word
    //   });
    //   connRight.push(thisWord);
    //   y += lineSpacing;
    // }
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
function saveAsFile(link, content, filename) {
    var blob = new Blob([content], {type: "text/text"});
    var url  = URL.createObjectURL(blob);

    // update link to new 'url'
    link.download    = filename + ".json";
    link.href        = url;

    console.log("save");
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
                  if(!isInList(word,foundAll) && word != "" && word!=currWord) foundAll.push(word);
                }
              }
                // for(var d = j-dist; d<j; d++){
                //   if(d>=0){
                //     var word = normalize(p.sigWords[d].attr('text'));
                //     if(!isInList(word,foundLeft) && word != "")
                //     foundLeft.push(word);
                //     foundAll.push(word);
                //   }
                // }
                // for(var d = j+1; d<j+dist; d++){
                //   if(d<p.sigWords.length){
                //     var word = normalize(p.sigWords[d].attr('text'));
                //     if(!isInList(word,foundRight) && word != "")
                //       foundRight.push(word);
                //       foundAll.push(word);
                //   }
                // }

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
    if (w.includes(',') || w.includes('.') || w.includes('?') || w.includes('!') || w.includes(';') || w.includes(':')) {
        w = w.substring(0, w.length - 1);
    }
    return w;
}

//Searches list of insignificant words (defined globally) and returns whether it is insignificant
function isInList(e,list) {
    for (var i = 0; i < list.length; i++) {
        if (list[i] == e) return true;
    }
    return false;
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
