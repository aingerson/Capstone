//Canvases
var selectBar; //raphael canvas for disaplaying list of poems
var root = {}; //tree JSON object

//Misc values
var buffer = 20; //border buffer for divs/canvas
var lineSpacing = 12; //line spacing

//Font colors
var deselectColor = "#000"; //default (black) color
var selectColor = "#4AA9F2"; //font color of selected poem
var containsColor = "red"; //font color of poems containing selection

var poemList; //list of poem name raphael objects
var listY = buffer + lineSpacing; //y coordinate of poem list names
var currWord = ""; //current selected word
var selected = null; //current selected poem
var insigWords = ["of", "a", "the", "in", "over", "to", "is",
    "was", "and", "or", "its", "it", "for", "my", "your", "his", "though",
    "can", "at", "but", "from", "have", "has", "on", "as", "how", "her",
    "she", "they", "we", "i", "ii", "iii", "iv", "v", "vi", "vii", "viii",
    "do", "not", "go", "come", "here", "into", "that", "so", "an", "shall", "no", "by",
    "who", "he", "had", "you", "one", "oh", "all", "with", "out", "through", "",
    "let", "if", "\n", "'all", "i'll", "me", "'no", "would", "nor", "o", "are",
    "going", "this", "their", "up", "last", "must", "any", "further", "down", "after",
    "other", "there", "about", "were", "among", "their", "like", "once", "then", "need",
    "only", "high", "him", "when", "are", "than", "be", "will", "should", "till"
];
var dist = 2; //"significant" distance
var maxWidth = 300; //max display width (poem display)
var maxWidthList = 100; //max display width (poem list)
var maxHeight = 300; //maximum list and poem height
var graph; //graph JSON (nodes and links)
var edges = []; //list of currently disaplyed edges in tree (for adding to graph)
var stateTree = 0; //last action was tree removal (for undoing)
var stateGraph = 1; //last action was graph removal (for undoing) - not implemented yet
var prevGraph = {}; //previous graph (for undoing) - not implemented yet
var prevTree = {}; //previous tree (for undoing)
var prevEdges = []; //previously displayed edges in tree (for undoing)
var lastAction = -1; //what the last action was (stateTree/stateGraph)
var mode = "norm"; //"norm" or "del" (deletion in progress)
var currEdge; //currently selected edge

/*
 * Initialization
 */
function init() {
    //Raphael canvas for poem list
    selectBar = new Raphael('list', '100%', '100%');
    poemList = selectBar.set();

    document.getElementById('files').addEventListener('change', handleFileSelect, false);

    graph = {};
    graph.nodes = [];
    graph.links = [];
    adjustSizes();
    makeTree();
}

/*
 * Adjusts the select bar size
 */
function adjustSizes() {
    var selectHeight = poemList.length * 15;
    var newHeight = Math.max(350, selectHeight);
    selectBar.setSize(maxWidth, newHeight);
    $(selectBar.canvas).parent().height("350px");
    $("poem").height(maxHeight);
}

/*
 * Handles file selection for loading poems
 */
function handleFileSelect(evt) {
    var files = evt.target.files;
    var numFiles = 5; //loads 5 files in at a time
    for (var i = 0; i < files.length; i += numFiles) {
        if (i + numFiles < files.length) {
            scanFiles(files, i, i + numFiles);
        } else {
            scanFiles(files, i, files.length);
        }
    }
}

/*
 * Adds currently displayed edges to the graph
 */
function addToGraph() {
    var newGraph = {}; //new graph with added edges
    newGraph.nodes = [];
    newGraph.links = [];
    for (var p = 0; p < graph.nodes.length; p++) { //add in all of the old nodes
        var newNode = {};
        newNode.name = graph.nodes[p].name;
        newNode.group = graph.nodes[p].group;
        newGraph.nodes.push(newNode);
    }
    for (var p = 0; p < graph.links.length; p++) { //add in all of the old links
        var newLink = {};
        newLink.source = findIndex(graph.links[p].source.name, newGraph);
        newLink.target = findIndex(graph.links[p].target.name, newGraph);
        newGraph.links.push(newLink);
    }

    for (var i = 0; i < edges.length; i++) { //go through all of the edges in tree
        if (edges[i] == null) continue; //edge might have been deleted
        if (!nodeInGraph(edges[i].w1, newGraph)) { //if w1 not in graph yet, create new node
            var newNode = {};
            newNode.name = edges[i].w1;
            newNode.group = 1;
            newGraph.nodes.push(newNode);
        }
        if (!nodeInGraph(edges[i].w2, newGraph)) { //if w2 not in graph yet, create new nodeInGraph
            var newNode = {};
            newNode.name = edges[i].w2;
            newNode.group = 1;
            newGraph.nodes.push(newNode);
        }
        if (!edgeInGraph(edges[i], newGraph)) { //if no link exists between already, create new link
            var newLink = {};
            newLink.source = findIndex(edges[i].w1, newGraph);
            newLink.target = findIndex(edges[i].w2, newGraph);
            newGraph.links.push(newLink);
        }
    }
    graph = newGraph; //set old graph to be new one with all additions
    makeGraph(); //redraw graph
}

/*
 * Restore the last state (undo)
 */
function restore() {
    //TODO fix undo graph function
    if (lastAction == stateGraph) {
        graph = prevGraph;
        //makeGraph();
    } else if (lastAction == stateTree) { //last action was deletion from tree
        root = prevTree; //reset tree
        edges = prevEdges; //reset edges
        makeTree(); //redraw tree
    }
    lastAction = -1; //last action is invalid (undo is only 1 step back)
}

/*
 * Deals with key commands
 */
function KeyPress(e) {
    var evtobj = window.event ? event : e
    if (evtobj.keyCode == 90 && evtobj.ctrlKey) { //CTRL-Z --> undo
        restore();
    } else if (evtobj.keyCode == 68) { //hold d --> undo mode
        mode = "del";
    } else if (evtobj.keyCode == 65) { //press a --> add to graph
        addToGraph();
    } else if (evtobj.keyCode == 88 && evtobj.ctrlKey) { //CTRL-X --> clear graph
        var r = confirm("Are you sure you want to clear the graph?"); //confirmation
        if (r == true) clearGraph();
    }
}

/*
 * Not pressing a key (set to normal mode)
 */
function KeyUp(e) {
    mode = "norm";
}

/*
 * Returns whether the node is already in the graph
 */
function nodeInGraph(node, aGraph) {
    for (var j = 0; j < aGraph.nodes.length; j++) {
        if (aGraph.nodes[j].name == node) {
            return true;
        }
    }
    return false;
}

/*
 * Returns whether the edge is already in the graph
 */
function edgeInGraph(edge, aGraph) {
    for (var j = 0; j < aGraph.links.length; j++) {
        if (typeof(aGraph.links[j] == 'undefined')) continue;
        if ((aGraph.links[j].source.name == edge.w1 && aGraph.links[j].target.name == edge.w2) || (aGraph.links[j].source.name == edge.w1 && aGraph.links[j].target.name == edge.w2)) {
            return true;
        }
    }
    return false;
}

/*
 * Returns the index of a node (by name) in the graph nodes list
 */
function findIndex(name, aGraph) {
    for (var i = 0; i < aGraph.nodes.length; i++) {
        if (aGraph.nodes[i].name == name) return i;
    }
    return -1;
    d
}

/*
 * Deletes any occurrence of a word from the list of edges
 */
function deleteFromEdges(deleteWord) {
    prevEdges = []; //for saving the last state of edges
    for (var i = 0; i < edges.length; i++) {
        prevEdges.push(edges[i]); //save it as old state
        if (edges[i] == null) continue; //was already deleted
        if (edges[i].w1 == deleteWord || edges[i].w2 == deleteWord) {
            edges.splice(i, 1); //delete from actual edges
        }
    }
}

/*
 * Returns whether the file is a .txt file
 */
function txtExtension(fileName) {
    var c = fileName.indexOf(".");
    var w = fileName.substring(c + 1, fileName.length);
    if (w != "txt") return false;
    return true;
}

/*
 * Scans files[i] through files[j] and loads them in as poems
 */
function scanFiles(files, i, j) {
    //var output = [];//buffer array for reading file (array of lines)
    var f;
    for (; i < j; i++) { //read every file
        f = files[i]; //currently reading this file
        if (!txtExtension(f.name)) continue;
        var reader = new FileReader();
        var result;
        reader.onload = function(e) { //done loading
            var lines = e.target.result.split("\n");
            var thisPoem = new Poem(lines); //make a new poem with the file contents
            var item = selectBar.text(buffer, listY, lines[0]); //this is the poem name in the select bar
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
                    if (selected.data('poem').contains()) { //currently selected word is in the poem
                        selected.attr("fill", containsColor)
                    } else selected.attr("fill", deselectColor);
                }
                selected = this; //now this one is selected
                this.attr("fill", selectColor); //change the color of this item
                this.data('poem').showPoem(); //and show its poem
            });
        };
        reader.readAsText(f, "UTF-8");
        reader.onloadend = function(e) {
            adjustSizes();
        };
    }
}

/*
 * Handles click of a word
 */
function wordClick(word) {
    currEdge = null;
    toDeselect = $(".currWord");
    if (toDeselect != null) {
        for (var y = 0; y < toDeselect.length; y++) {
            toDeselect[y].classList.remove("currWord");
        }
    }
    currWord = word;
    searchPoems(word);

    //weird bug workaround:
    prevTree = copyTree(root); //save this as old tree
    prevEdges = edges; //save this as old edges
    lastAction = stateTree; //mark for tree undo
    restore(); //undo
}

/*
 * Creates a new poem object with a list of lines
 */
function Poem(data) {
    this.title = data[0];
    this.allSigWords = [];
    this.lines = [];

    var rawLines = data.slice(2); //get rid of title
    for (var i = 0; i < rawLines.length; i++) {
        var splitLine = rawLines[i].split(" "); //all lines split into array of words
        for (var j = 0; j < splitLine.length; j++) { //go through each word
            if (j === 0) {
                this.lines[i] = [];
            }
            this.lines[i].push(splitLine[j]);
            var w = normalize(splitLine[j]); //normalize the word
            if (isInList(w, insigWords)) continue; //insignificant so skip it
            else this.allSigWords.push(w); //add it to the list of all significant words
        }
    }
}

/*
 * Hides the poem
 */
Poem.prototype.hidePoem = function() {
    document.getElementById("poem").innerHTML = "";
}


/*
 * Displays the entire poem
 */
Poem.prototype.showPoem = function() {
    //Header for poem section
    var html = "<h2 class='poemtitle'>" + this.title + "</h2><ul class='poemlines'>"
        //For each line:
    for (var i = 0; i < this.lines.length; i++) {
        var l = this.lines[i];
        //Check if a blank line: if blank, add a break and continue
        if (l == "") {
            l = "<li>&nbsp;</li>";
            html = html + l;
            continue;
        } else {
            var lineID = "line_" + i;
            html = html + "<li class='line' id=" + lineID + ">";
            for (var w = 0; w < l.length; w++) {
                var newHtml = "";
                var n = normalize(l[w]);
                if (!isInList(n, insigWords)) {
                    var wordID = "word_" + n;
                    newHtml = "<span class=" + wordID + " onclick=wordClick('" + n + "')>";
                    if (currWord == n) {
                        newHtml = "<span class='" + wordID + " currWord' onclick=wordClick('" + n + "')>";
                    }
                    if (currEdge != null) {
                        if (currEdge.w1 == n || currEdge.w2 == n) {
                            newHtml = "<span class='" + wordID + " connection' onclick=wordClick('" + n + "')>";
                        }
                    }
                    newHtml = newHtml + l[w];
                    newHtml = newHtml + "</span> "
                } else {
                    newHtml = newHtml + l[w] + " ";
                }
                html = html + newHtml;
            }
            html = html + "</li>";
        }
    }
    html = html + "</ul>";
    document.getElementById("poem").innerHTML = html;
}

/*
 * Returns the id of a word
 */
function idOf(word) {
    return ".word_" + word;
}

/*
 * Searches all poems for the currently selected word and changes highlighting appropriately
 * Differrent from findConnections because clears edges/tree (currWord=root.name)
 */
function searchPoems() {
    edges = [];
    var foundAll = []; //list of all of the connected words that were found
    for (var i = 0; i < poemList.length; i++) { //go through every poem
        var p = poemList[i].data('poem'); //grab its respective poem
        var poemTitle = poemList[i];
        var found = false; //marks whether we found the word in the poem
        for (var j = 0; j < p.allSigWords.length; j++) { //go through every significant word in this poem
            var w = p.allSigWords[j];
            if (w == currWord) { //this is the word we're looking for
                toSelect = $(idOf(w));
                for (var y = 0; y < toSelect.length; y++) {
                    toSelect[y].classList.add("currWord");
                }
                found = true; //and remember that you found one
                for (var d = j - dist; d <= j + dist; d++) {
                    if (d >= 0 && d < p.allSigWords.length) {
                        var word = p.allSigWords[d];
                        if (!isInList(word, foundAll) && word != "" && word != currWord) {
                            if (!isEdge(currWord, word)) { //no edge already exists
                                foundAll.push(word); //add it to the list of found words
                                edges.push(new Edge(currWord, word, poemTitle)); //add it to the overall list of edges
                            } else {
                                var thisEdge = getEdge(currWord, word); //already an edge, remember the poem you found it in for later
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

    //building the tree from the root
    root.name = currWord;
    root.children = [];
    for (var h = 0; h < foundAll.length; h++) {
        root.children[h] = {
            "name": foundAll[h],
            "children": []
        };
    }
    makeTree(); //draw the new tree
}

function research(word1,word2){
      for (var i = 0; i < poemList.length; i++) { //go through every poem
      var poemTitle = poemList[i];
      var p = poemList[i].data('poem'); //grab its respective poem
  for (var d = j - dist; d <= j + dist; d++) {
      if (d >= 0 && d < p.allSigWords.length) {
          var word = p.allSigWords[d];
          if (!isEdge(word1, word2)) {
            edges.push(new Edge(word1, word2, poemTitle)); //add it to the overall list of edges
          }
          if(!isGraphEdge(word1,word2)){
            
          }
              } else {
                  var thisEdge = getEdge(currWord, word); //already an edge, remember the poem you found it in for later
                  thisEdge.addPoem(poemTitle);
              }
          }
      }
    }

/*
 * Displays word1 and word2 where connected
 */
function showConnections(word1, word2) {
    var e = getEdge(word1, word2);
    if (e == null) return;

    currEdge = e;
    selected.data('poem').hidePoem();

    for (var j = 0; j < poemList.length; j++) {
        poemList[j].attr("fill", deselectColor);
    }

    for (var j = 0; j < e.poems.length; j++) {
        e.poems[j].attr("fill", containsColor);
    }

    if (e.poems.length == 1) {
        selected = e.poems[0];
        selected.data('poem').showPoem();
        selected.attr("fill", selectColor);
    }

}

/*
 * Returns whether an edge between word1 and word2 already exists in edges
 */
function isEdge(word1, word2) {
    for (var m = 0; m < edges.length; m++) {
        if (edges[m] == null) continue;
        if ((word1 == edges[m].w1 && word2 == edges[m].w2) || (word1 == edges[m].w2 && word2 == edges[m].w1)) return true;
    }
    return false;
}

/*
 * Compiles all saved data and returns it to save to file and download
 */
function saveState(fileName) {
    var state = {}; //will be complete state JSON
    var newGraph = copyGraph(); //copied graph object
    var newTree = copyTree(root); //copied tree object

    state.tree = JSON.parse(JSON.stringify(newTree));
    state.graph = JSON.parse(JSON.stringify(newGraph));
    state.dist = dist; //save significant distance setting
    state.insigWords = insigWords; //save list of insignificant words
    var toWrite = JSON.stringify(state); //stringify complete JSON for writing to file

    return toWrite;
}

/*
 * Restores state of program to a new (uploaded) state
 */
function restoreNewState(newState) {
    root = newState.tree; //reset tree
    graph = newState.graph; //reset graph
    dist = newState.dist; //reset distance
    insigWords = newState.insigWords; //reset insignificant word list
    makeTree(); //redraw tree
    makeGraph(); //redraw graph
}

/*
 * Represents edge (connection between words)
 */
function Edge(w1, w2, p) {
    this.w1 = w1;
    this.w2 = w2;
    this.poems = []; //list of poems where this connection happens
    this.poems.push(p);
}

/*
 * Returns children nodes after search all poems for the word
 * Can be merged into searchPoems (future work)
 */
function findConnections(word) {
    currWord = word; //set currently selected word
    var foundAll = []; //list of all words that are connected to the selected word
    for (var i = 0; i < poemList.length; i++) { //go through every poem
        var p = poemList[i].data('poem'); //grab its respective poem
        var poemTitle = poemList[i];
        var found = false; //marks whether we found the word in the poem
        for (var j = 0; j < p.allSigWords.length; j++) { //go through every line in this poem
            var w = p.allSigWords[j];
            if (w == currWord) { //this is the word we're looking for
                toDeselect = $(".currWord");
                if (toDeselect != null) {
                    for (var y = 0; y < toDeselect.length; y++) {
                        toDeselect[y].classList.remove("currWord");
                    }
                }
                toSelect = $(idOf(w));
                for (var y = 0; y < toSelect.length; y++) {
                    toSelect[y].classList.add("currWord");
                }
                found = true; //and remember that you found one
                for (var d = j - dist; d <= j + dist; d++) {
                    if (d >= 0 && d < p.allSigWords.length) {
                        var word = p.allSigWords[d];
                        if (!isInList(word, foundAll) && word != "" && word != currWord) {
                            if (!isEdge(currWord, word)) {
                                foundAll.push(word);
                                edges.push(new Edge(currWord, word, poemTitle));
                            } else {
                                var thisEdge = getEdge(currWord, word);
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
    var children = [];
    for (var h = 0; h < foundAll.length; h++) {
        children[h] = {
            "name": foundAll[h],
            "children": []
        };
    }
    return children;
}

/*
 * Returns whether this poem contains the currently selected word
 */
Poem.prototype.contains = function() {
    if (currWord == "") return 0; //no selected word
    for (var i = 0; i < this.allSigWords.length; i++) { //for every line in this poem
        if (currWord == this.allSigWords[i]) {
            return 1;
        }
    }
    return 0; //couldn't find one
}

/*
 * Returns the edge between the two words (if one exists)
 */
function getEdge(word1, word2) {
    for (var g = 0; g < edges.length; g++) {
        if (edges[g] == null) continue;
        if ((edges[g].w1 == word1 && edges[g].w2 == word2) || (edges[g].w1 == word2 && edges[g].w2 == word1)) {
            return edges[g];
        }
    }
    return null;
}

/*
 * Adds another poem to list of poems where this edge occurs
 */
Edge.prototype.addPoem = function(p) {
    this.poems.push(p);
}

/*
 * Normalizes a word by getting rid of any punctuation
 */
function normalize(w) {
    w = w.toLowerCase();
    var c = has(w);
    while (c != "") { //keep getting rid of punctuation as long as it has it
        var index = w.indexOf(c);
        if (index == 0) w = w.substring(1, w.length);
        else if (index == w.length - 1) w = w.substring(0, w.length - 1);
        else w = w.substring(0, index) + w.substring(index + 1, w.length);
        c = has(w);
    }
    return w;

}

/*
 * Returns punctuation that this word contains.
 */
function has(w) {
    if (w.includes('\'')) return ('\'');
    if (w.includes(',')) return (',');
    if (w.includes('.')) return ('.');
    if (w.includes('?')) return ('?');
    if (w.includes('!')) return ('!');
    if (w.includes(';')) return (';');
    if (w.includes(',')) return (',');
    if (w.includes(':')) return (':');

    return ""; //no punctuation found
}

/*
 * Searches list words and returns whether it is in the list
 */
function isInList(e, list) {
    for (var i = 0; i < list.length; i++) {
        if (list[i] == e) return true;
    }
    return false;
}

/*
 * When the page is done loading, initialize
 */
$(document).ready(function() {
    init();
});

//define document key up and down functions
document.onkeydown = KeyPress;
document.onkeyup = KeyUp;
