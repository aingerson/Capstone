
function makeGraph() {
  $("#graph").empty();
  //console.log(graph);

  var width = document.getElementById("graph").offsetWidth;
  var height = document.getElementById("graph").offsetHeight;

  var color = d3.scale.category20();

  var force = d3.layout.force()
      .linkDistance(70)
      .linkStrength(0.1)
      .friction(0.5)
      .charge(-100)
      .size([width, height]);

  var svg = d3.select("#graph").append("svg")
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
                    d.fixed = true; // of course set the node to fixed so the force doesn't include the node in its auto positioning stuff
                    force.resume();
                }
                function releasenode(d) {
                    d.fixed = false; // of course set the node to fixed so the force doesn't include the node in its auto positioning stuff
                    force.resume();
                }

    var link = svg.selectAll(".graphLink")
        .data(graph.links)
      .enter().append("line")
        .attr("class", "graphLink")
        .style("stroke-width", function(d) { return Math.sqrt(d.value); })
        .attr('pointer-events', 'click')
        .on("click", function(link) {
          showConnections(link.source.name,link.target.name);
        });

    var node = svg.selectAll(".graphNode")
        .data(graph.nodes)
      .enter().append("text")
        .attr("class", "graphNode")
        .text(function(d){return d.name;})
        .attr({
          "font-size" :10
        })
        .on("click",function(node){
          deleteFromGraph(node.name);
        })
        .on('dblclick', releasenode)
        .on('mouseover',connectedNodes)
        .on('mouseout',connectedNodes) //Added code
        .call(node_drag);


    node.append("title")
        .text(function(d) { return d.name; });

    force.on("tick", function() {
      link.attr("x1", function(d) {return d.source.x; })
          .attr("y1", function(d) {return d.source.y; })
          .attr("x2", function(d) {return d.target.x; })
          .attr("y2", function(d) {return d.target.y; });

      node.attr("x", function(d) {return d.x; })
          .attr("y", function(d) {return d.y; });
      //node.each(collide(0.5)); //Added
    });


    //Toggle stores whether the highlighting is on
    var toggle = 0;
    //Create an array logging what is connected to what
    var linkedByIndex = {};
    for (i = 0; i < graph.nodes.length; i++) {
        linkedByIndex[i + "," + i] = 1;
    };
    graph.links.forEach(function (d) {
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
            // node.style("opacity", function (o) {
            //     return neighboring(d, o) | neighboring(o, d) ? 1 : 0.1;
            // });
            link.style("opacity", function (o) {
                return d.index==o.source.index | d.index==o.target.index ? 1 : 0.2;
            });
            //Reduce the op
            toggle = 1;
        } else {
            //Put them back to opacity=1
            //node.style("opacity", 1);
            link.style("opacity", 1);
            toggle = 0;
        }
    }
    var foundCycles = findCycles();
    displayCycles(foundCycles);
}


function displayCycles(cycs){
  var select = document.getElementById('cycles');
  var length = select.options.length;
  for(var i=0;i<length;i++){
    select.options[i] = null;
  }
  if(cycs.length==0){
    var cyc = printCycle(cycs[i]);
    var opt = document.createElement('none');
    opt.value = "No cycles detected";
    select.appendChild(opt);
  }
  for(var i=0;i<cycs.length;i++){
    var cyc = printCycle(cycs[i]);
    var opt = document.createElement('option');
    opt.value = ""+ cyc;
    //opt.innerHTML = i;
    select.appendChild(opt);
  }
}

function deleteFromGraph(n){
  if(currentMode()=="del"){
    //prevGraph = copyGraph(graph);
    //lastAction = stateGraph;
    var newNodes = [];
    var newLinks = [];
    for(var p=0;p<graph.nodes.length;p++){
      if(graph.nodes[p].name!=n) newNodes.push(graph.nodes[p]);
    }
    for(var k=0;k<graph.links.length;k++){
      if(graph.links[k].source.name!=n && graph.links[k].target.name!=n) newLinks.push(graph.links[k]);
    }
    graph.nodes = newNodes;
    graph.links =newLinks;
    //updateGraph(graph);
    makeGraph();
  }
}

function copyGraph(toCopy){
//   var ret = {};
//   ret.nodes = [];
//   ret.links = [];
//
//   for(var t=0;t<toCopy.nodes.length;t++){
//     var newNode = {};
//     newNode.name = toCopy.nodes[t].name;
//     newNode.group = toCopy.nodes[t].group;
//     ret.nodes.push(toCopy.nodes);
//   }
var newLinks = [];
  for(var m=0;m<toCopy.links.length;m++){
    if(typeof(toCopy.links[m])=='undefined') continue;
    var newLink = {};
    newLink.source = toCopy.nodes[m].source;
    newLink.target = toCopy.nodes[m].target;
    newLink.value = toCopy.nodes[m].value;
    newLinks.push(newLink);
  }
// console.log(toCopy);
// console.log(ret);
// return ret;
var ret = JSON.parse(JSON.stringify(toCopy));
ret.links = newLinks;

//console.log(toCopy);
//console.log(ret);
return ret;
}



function clearGraph(){
  graph = {};
  graph.nodes = [];
  graph.links = [];
  $("#graph").empty();

}
