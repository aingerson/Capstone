var visited; //list of visited nodes
var cycles; //list of all currently found cycles
var prev; //previous node (for tracking)
var currCycle; //current cycle being searched (stack)

/*
 * Searches graph and returns all cycles
 */
function findCycles() {
    visited = []; //reset visited nodes
    cycles = []; //reset cycles
    prev = -1; //starting at beginning so no previous node
    currCycle = []; //reset current cycle
    for (var j = 0; j < graph.nodes.length; j++) {
        visited.push(0);
    }

    for (var g = 0; g < graph.nodes.length; g++) {
        for (var j = 0; j < visited.length; visited[j++] = 0); //reset visited nodes before searching
        dfs(g);
    }
    sortCycles(); //sort all of them from shortest to longest
    noDoubles(); //get rid of any doubles that we may have found
    return cycles;
}

/*
 * Gets rid of all double cycles
 */
function noDoubles() {
    for (var i = 0; i < cycles.length - 1; i++) {
        if (equals(cycles[i], cycles[i + 1])) {
            cycles.splice(i + 1, 1);
            i--;
        }
    }
}

/*
 * Returns whether two arrays are equal to each other
 */
function equals(a1, a2) {
    if (a1.length != a2.length) return false;
    for (var i = 0; i < a1.length; i++) {
        if (!contains(a2, a1[i])) return false;
    }
    return true;
}

/*
 * Returns whether an array contains an element
 */
function contains(a1, e) {
    for (var j = 0; j < a1.length; j++) {
        if (a1[j] == e) return true;
    }
    return false;
}

/*
 * Sorts cycles based on length
 */
function sortCycles() {
    var count = 0;
    var ret = [];
    var i = 3;
    while (count < cycles.length) {
        for (var h = 0; h < cycles.length; h++) {
            if (cycles[h].length == i) {
                ret.push(cycles[h]);
                count++;
            }
        }
        i++;
    }
    cycles = ret;
}

/*
 * Performs depth first search of graph starting at node current
 */
function dfs(current) {
    if (current > graph.nodes.length - 1) return;
    visited[current] = 1; //mark this node as visited
    var nexts = getNext(current); //list of connected nodes
    currCycle.push(current); //push onto cycle stack
    for (var k = 0; k < nexts.length; k++) {
        var nextVal = nexts[k];
        if (nextVal == currCycle[0]) { //got to the beginning so found a cycle
            cycles.push(copyCycle(currCycle)); //make a copy of cycle and save it
        } else if (visited[nextVal] == 0) { //haven't visited next connected node yet
            prev = current; //mark where we came from
            dfs(nextVal); //traverse down
        }
    }
    currCycle.splice(currCycle.length - 1, 1); //take this node off the stack
}

/*
 * Makes a copy of the cycle and returns it
 */
function copyCycle(cyc) {
    var newCyc = [];
    for (var t = 0; t < cyc.length; newCyc.push(cyc[t++]));
    return newCyc;
}

/*
 * Returns string representation of cycle (for display in select bar)
 */
function printCycle(cyc) {
    var print = "";
    for (var p = 0; p < cyc.length; p++) {
        print += graph.nodes[cyc[p]].name;
        if (p != cyc.length - 1) {
            print += "->";
        }
    }
    return print;
}

/*
 * Returns list of node indeces connceted to val
 */
function getNext(val) {
    var ret = [];
    for (var j = 0; j < graph.links.length; j++) { //go through every link
        if (graph.links[j].source.index == val) { //found edge coming from val
            if (prev < 0 || (prev >= 0 && graph.links[j].target.index != prev)) {
                ret.push(graph.links[j].target.index);
            }
        } else if (graph.links[j].target.index == val) { //found edge going to val
            if (prev < 0 || (prev >= 0 && graph.links[j].source.index != prev)) {
                ret.push(graph.links[j].source.index);
            }
        }
    }
    return ret;
}
