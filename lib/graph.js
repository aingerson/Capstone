var svg; //global svg

/*
 * Draws graph saved in graph variable
 */
function makeGraph() {
    $("#graph").empty(); //clear current graph
    var width = document.getElementById("graph").offsetWidth;
    var height = document.getElementById("graph").offsetHeight;
    var color = d3.scale.category20();
    var force = d3.layout.force() //forces of the graph
        .linkDistance(70)
        .linkStrength(0.1)
        .friction(0.5)
        .charge(-100)
        .size([width, height]);

    svg = d3.select("#graph").append("svg")
        .attr("width", width)
        .attr("height", height);

    force
        .nodes(graph.nodes)
        .links(graph.links)
        .start();


    var node_drag = d3.behavior.drag()
        .on("dragstart", dragstart)
        .on("drag", dragmove)
        .on("dragend", dragend);

    function dragstart(d, i) {
        force.stop() // stops the force auto positioning before you start dragging
    }

    function dragmove(d, i) {
        d.px += d3.event.dx;
        d.py += d3.event.dy;
        d.x += d3.event.dx;
        d.y += d3.event.dy;
    }

    function dragend(d, i) {
        d.fixed = true; //set the node to fixed
        force.resume();
    }

    function releasenode(d) {
        d.fixed = false; //set the node to fixed
        force.resume();
    }

    var link = svg.selectAll(".graphLink")
        .data(graph.links)
        .enter().append("line")
        .attr("class", "graphLink")
        .style("stroke-width", function(d) {
            return Math.sqrt(d.value);
        })
        .attr('pointer-events', 'click')
        .on("click", function(link) {
            showConnections(link.source.name, link.target.name);
        });

    var node = svg.selectAll(".graphNode")
        .data(graph.nodes)
        .enter().append("text")
        .attr("class", "graphNode")
        .text(function(d) {
            return d.name;
        })
        .attr({
            "font-size": 10
        })
        .on("click", function(node) {
            deleteFromGraph(node.name);
        })
        .on('dblclick', releasenode)
        .on('mouseover', connectedNodes)
        .on('mouseout', connectedNodes) //Added code
        .call(node_drag);


    node.append("title")
        .text(function(d) {
            return d.name;
        });

    force.on("tick", function() {
        link.attr("x1", function(d) {
                return d.source.x;
            })
            .attr("y1", function(d) {
                return d.source.y;
            })
            .attr("x2", function(d) {
                return d.target.x;
            })
            .attr("y2", function(d) {
                return d.target.y;
            });

        node.attr("x", function(d) {
                return d.x;
            })
            .attr("y", function(d) {
                return d.y;
            });
    });


    //Toggle stores whether the highlighting is on
    var toggle = 0;
    //Create an array logging what is connected to what
    var linkedByIndex = {};
    for (i = 0; i < graph.nodes.length; i++) {
        linkedByIndex[i + "," + i] = 1;
    };
    graph.links.forEach(function(d) {
        linkedByIndex[d.source.index + "," + d.target.index] = 1;
    });
    //This function looks up whether a pair are neighbours
    function neighboring(a, b) {
        return linkedByIndex[a.index + "," + b.index];
    }

    function connectedNodes() {
        if (toggle == 0) {
            //Reduce the opacity of all but the neighbouring nodes
            d = d3.select(this).node().__data__;
            link.style("opacity", function(o) {
                return d.index == o.source.index | d.index == o.target.index ? 1 : 0.2;
            });
            //Reduce the op
            toggle = 1;
        } else {
            //Put them back to opacity=1
            link.style("opacity", 1);
            toggle = 0;
        }
    }
    var foundCycles = findCycles(); //search for cycles
    displayCycles(foundCycles); //display them in the select bar

}

/*
 * Highlights the links in currently selected cycle
 */
function showCycle(e) {
    if (graph.nodes.length == 0) return "";
    var cyc = e.split(",");
    var link = svg.selectAll(".graphLink");
    link.style("stroke", function(d) {
        if (isInCycle(d.target.index, d.source.index)) {
            return "#4682B4";
        }
        return "#BBB";
    });

    /*
     * Returns whether the link between these two nodes is in the current cycle
     */
    function isInCycle(target, source) {
        var t;
        for (t = 0; t < cyc.length - 1; t++) {
            if ((cyc[t] == target && cyc[t + 1] == source) || (cyc[t] == source && cyc[t + 1] == target)) return true;
        }
        if ((cyc[t] == target && cyc[0] == source) || (cyc[t] == source && cyc[0] == target)) return true;
        return false;
    }

}
/*
 * Displays all cycles in the select bar
 */
function displayCycles(cycs) {
    var select = document.getElementById('cycles');
    while (select.length > 0) { //delete all old cycles
        select.removeChild(select.options[0]);
    }
    if (cycs.length == 0) { //no cycles found
        var opt = document.createElement('none');
        opt.value = [];
        opt.innerHTML = "No cycles detected";
        select.appendChild(opt);
        return;
    }
    for (var i = 0; i < cycs.length; i++) {
        var cyc = printCycle(cycs[i]);
        var opt = document.createElement('option');
        opt.value = cycs[i];
        opt.innerHTML = cyc;
        select.appendChild(opt);
    }
}

function searchGraph(){
  for(var i=0;i<graph.links.length;i++){
    var w1 = graph.nodes[graph.links[i].taraget].name;
    var w2 = graph.nodes[graph.links[i].source].name;
    research(w1,w2,stateGraph);
  }

}

/*
 * Delete a node (and all of its links) from the graph
 */
function deleteFromGraph(n) {
    if (currentMode() == "del") { //only if we're in delete mode
        var newNodes = [];
        var newNewNodes = [];
        var newLinks = [];
        for (var p = 0; p < graph.nodes.length; p++) { //copy over all of the nodes that aren't this one
            if (graph.nodes[p].name != n) newNodes.push(graph.nodes[p]);
        }
        for (var k = 0; k < graph.links.length; k++) { //copy over all of the links that don't inlcude it
            if (graph.links[k].source.name != n && graph.links[k].target.name != n) newLinks.push(graph.links[k]);
        }

        graph.nodes = newNodes;
        graph.links = newLinks;
        makeGraph();
    }
}

/*
 * Returns a copy of the current graph
 */
function copyGraph() {
    var newGraph = {}; //copied graph object
    newGraph.nodes = [];
    newGraph.links = [];

    for (var p = 0; p < graph.nodes.length; p++) {
        var newNode = {};
        newNode.name = graph.nodes[p].name;
        //newNode.group = graph.nodes[p].group;
        newGraph.nodes.push(newNode);
    }
    for (var p = 0; p < graph.links.length; p++) {
        var newLink = {};
        newLink.source = findIndex(graph.links[p].source.name, newGraph);
        newLink.target = findIndex(graph.links[p].target.name, newGraph);
        newGraph.links.push(newLink);
    }
    return newGraph;
}

/*
 * Clears the graph and cycles
 */
function clearGraph() {
    graph = {};
    graph.nodes = [];
    graph.links = [];
    displayCycles([]);
    $("#graph").empty();
}
