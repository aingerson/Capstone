var poemContext;
var poemCanvas;
var poemPaper;

var poems = [];
var context;
var poemCanvas;
var poemPaper;

var canvasBuffer = 30;
var buffer = 20; //border buffer
var ratio = 2.1; //ratio between poem list screen and poem display screen
var selected = null; //selected poem
var selectBarColor = "#b1cdd1"; //background left
var displayColor = "#93d0d1"; //background right
var deselectColor = "#000"; //font color of all writing
var selectColor = "#fff"; //font color of selected poem
var containsColor = "d12e22"; //font color of selected word
var lineSpacing = 12;

/*
function init(){
  poemCanvas = $('#poemdiv')[0];
  poemPaper = new Raphael('poem',poemCanvas.width,poemCanvas.height);
  //poemPaper = new Raphael(canvasBuffer+(poemCanvas.width/ratio), canvasBuffer, 2*(poemCanvas.width/ratio), poemCanvas.height);

  selectBarCanvas = $('#list')[0];
  selectBar = new Raphael('sidebar',sidebarW,sidebarH);
  //selectBar = new Raphael(canvasBuffer, canvasBuffer, poemCanvas.width/ratio, poemCanvas.height);

  var rect1 = poemPaper.rect(0, 0, poemCanvas.width, poemCanvas.height);
  rect1.attr("fill", displayColor);
  rect1.attr("stroke", "#000");

  var rect2 = selectBar.rect(0, 0, sidebarW, sidebarH);
  rect2.attr("fill", selectBarColor);
  rect2.attr("stroke", "#000");

*/
var poemList; //list of poem name raphael objects
var listY = buffer + lineSpacing; //y coordinate of poem list names
var currWord = ""; //current selected word
var insigWords = ["of", "a", "the", "in", "over", "to", "is", "was", "and", "or", "its", "it", "for", "my", "your", "his", "though", "can", "at", "but", "from", "have", "has"];


//initializes canvases
function init() {
    /*canvas = $('#canvas')[0];
    context = canvas.getContext("2d");
    poemPaper = new Raphael(canvasBuffer + (canvas.width / ratio), canvasBuffer, 2 * (canvas.width / ratio), canvas.height);
    selectBar = new Raphael(canvasBuffer, canvasBuffer, canvas.width / ratio, canvas.height);
    var rect1 = poemPaper.rect(0, 0, canvas.width, canvas.height);
    rect1.attr("fill", displayColor);
    rect1.attr("stroke", "#000");
    var rect2 = selectBar.rect(0, 0, canvas.width, canvas.height);
    rect2.attr("fill", selectBarColor);
    rect2.attr("stroke", "#000");
    */
    poemCanvas = $('#poem')[0];
    poemPaper = new Raphael('poemdiv','100%',"100%");
    console.log(poemPaper.width);
    //poemPaper = new Raphael(canvasBuffer+(poemCanvas.width/ratio), canvasBuffer, 2*(poemCanvas.width/ratio), poemCanvas.height);

    selectBarCanvas = $('#list')[0];
    selectBar = new Raphael('listdiv','100%','100%');
    //selectBar = new Raphael(canvasBuffer, canvasBuffer, poemCanvas.width/ratio, poemCanvas.height);

    var rect1 = poemPaper.rect(0, 0, '100%', '100%');
    rect1.attr("fill", displayColor);
    rect1.attr("stroke", "#000");

    var rect2 = selectBar.rect(0, 0, '100%', '100%');
    rect2.attr("fill", selectBarColor);
    rect2.attr("stroke", "#000");
    poemList = selectBar.set();
    document.getElementById('files').addEventListener('change', handleFileSelect, false);
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
    }

}


//creates a new Poem object
function Poem(data) {
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
            if (!isInsig(w)) { //if this word is a significant word
                thisWord.click(function() { //make it clickable
                    var word = normalize(this.attr("text")); //get rid of case and punctuation
                    currWord = word; //this is now the selected word
                    searchPoems(); //search all the poems for this word
                });
                this.sigWords.push(thisWord); //add this word to the searchable word list
            }
            this.words.push(thisWord); //and no matter what, add this word to the complete word list
            x += thisWord.node.getBBox().width + 5; //move the x coordinate over by the length of this word box
            thisWord.hide(); //when word is created, start hidden
        };
        y += lineSpacing; //move to the next line
    }
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
    for (var i = 0; i < poemList.length; i++) { //go through every poem
        var p = poemList[i].data('poem'); //grab its respective poem
        var found = false; //marks whether we found the word in the poem
        for (var j = 0; j < p.sigWords.length; j++) { //go through every word in this poem
            var w = normalize(p.sigWords[j].attr('text')); //get rid of case and punctuation
            if (w == currWord) { //this is the word we're looking for
                p.sigWords[j].attr("fill", containsColor); //color it
                found = true; //and remember that you found one
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
}

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
    if (w.includes(',') || w.includes('.') || w.includes('?') || w.includes('!')) {
        w = w.substring(0, w.length - 1);
    }
    return w;
}

//Searches list of insignificant words (defined globally) and returns whether it is insignificant
function isInsig(e) {
    for (var i = 0; i < insigWords.length; i++) {
        if (insigWords[i] == e) return true;
    }
    return false;
}

//when the page is done loading, initialize
$(document).ready(function() {
    init();
});
