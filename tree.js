//treeJSON = d3.json("flare.json", function(error, treeData) {
    // = treejson;
    // Calculate total nodes, max label length
var nodes;

  var tree = null;
  mode = "norm"
  function makeTree(treeData){
    $("#tree").empty();
    tree = null;

    var totalNodes = 0;
    var maxLabelLength = 0;

    // variables for drag/drop
    var selectedNode = null;
    var draggingNode = null;
    // panning variables
    var panSpeed = 100;
    var panBoundary = 100; // Within 20px from edges will pan when dragging.
    // Misc. variables
    var i = 0;
    var duration = 750;
    var root;

    // size of the diagram
    // var viewerWidth = $("tree").width();
    // var viewerHeight = $("tree").height();
    var viewerHeight = document.getElementById("toprow").offsetHeight;
    var viewerWidth = document.getElementById("tree").offsetWidth;
    tree = d3.layout.tree()
        .size([viewerHeight, viewerWidth]);
    // define a d3 diagonal projection for use by the node paths later on.
    var diagonal = d3.svg.diagonal()
        .projection(function(d) {
            return [d.y, d.x];
        });

    // A recursive helper function for performing some setup by walking through all nodes

    function visit(parent, visitFn, childrenFn) {
        if (!parent) return;

        visitFn(parent);

        var children = childrenFn(parent);
        if (children) {
            var count = children.length;
            for (var i = 0; i < count; i++) {
                visit(children[i], visitFn, childrenFn);
            }
        }
    }

    // Call visit function to establish maxLabelLength
    visit(treeData, function(d) {
      //console.log("d:"+d);
        totalNodes++;
        maxLabelLength = Math.max(d.name.length, maxLabelLength);

    }, function(d) {
        return d.children && d.children.length > 0 ? d.children : null;
    });


    // sort the tree according to the node names

    function sortTree() {
        tree.sort(function(a, b) {
            return b.name.toLowerCase() < a.name.toLowerCase() ? 1 : -1;
        });
    }
    // Sort the tree initially incase the JSON isn't in a sorted order.
    sortTree();

    // TODO: Pan function, can be better implemented.

    function pan(domNode, direction) {
        var speed = panSpeed;
        if (panTimer) {
            clearTimeout(panTimer);
            translateCoords = d3.transform(svgGroup.attr("transform"));
            if (direction == 'left' || direction == 'right') {
                translateX = direction == 'left' ? translateCoords.translate[0] + speed : translateCoords.translate[0] - speed;
                translateY = translateCoords.translate[1];
            } else if (direction == 'up' || direction == 'down') {
                translateX = translateCoords.translate[0];
                translateY = direction == 'up' ? translateCoords.translate[1] + speed : translateCoords.translate[1] - speed;
            }
            scaleX = translateCoords.scale[0];
            scaleY = translateCoords.scale[1];
            scale = zoomListener.scale();
            svgGroup.transition().attr("transform", "translate(" + translateX + "," + translateY + ")scale(" + scale + ")");
            d3.select(domNode).select('g.node').attr("transform", "translate(" + translateX + "," + translateY + ")");
            zoomListener.scale(zoomListener.scale());
            zoomListener.translate([translateX, translateY]);
            panTimer = setTimeout(function() {
                pan(domNode, speed, direction);
            }, 50);
        }
    }

    // Define the zoom function for the zoomable tree

    function zoom() {
        svgGroup.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
    }


    function displayTrashIcon(){
      var icon = changeTrashColor();
      document.getElementById("icon_1").innerHTML = icon;
      var pos = document.getElementById("tree").getBoundingClientRect();
      document.getElementById("icon_1").style.top = 0;
      document.getElementById("icon_1").style.left = pos.left-20;
      document.getElementById("icon_1").addEventListener("click", trashClick);

    }
    function displayGraphIcon(){
      var icon = changeGraphColor();
      document.getElementById("icon_2").innerHTML = icon;
      var pos = document.getElementById("tree").getBoundingClientRect();
      document.getElementById("icon_2").style.top = 0;
      document.getElementById("icon_2").style.left = pos.left+20;
      document.getElementById("icon_2").addEventListener("click", graphClick);
    }

    displayGraphIcon();
    displayTrashIcon();

    function changeTrashColor(){
      var color = "gray";
      if(mode === "del"){
        var color = "red";
      }
      return "<svg width='50' height='50' version='1.1' id='trashicon' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px'viewBox='0 0 24 24' enable-background='new 0 0 24 24' xml:space='preserve'><style>path,polygon{fill:"+color+";}</style><path d='M6,8L6,8c0-1.1,0.9-2,2-2h2l1-1h2l1,1h2c1.1,0,2,0.9,2,2v0H6z'/><polygon points='7,9 17,9 16,20 8,20 '/></svg>"
    }
    function trashClick(){
      if(mode == "norm") mode = "del";
      else if (mode == "del") mode = "norm";
      displayTrashIcon();
    }

    function graphClick(){
      addToGraph();

      // if(mode === "norm") mode = "graph";
      // else if (mode === "graph") mode = "norm";
      // displayGraphIcon();
    }

    function changeGraphColor(){
      var color = "gray";
      return "<svg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' version='1.1' class='' pageAlignment='none' x='0px' y='0px' width='50px' height='50px' viewBox='0 0 150 125' enable-background='new 0 0 150 125' xml:space='preserve'><defs/><g type='LAYER' name='workspace' id='workspace' locked='true'/><g type='LAYER' name='Layer 01' id='Layer 01'><path transform='matrix(1 0 0 1 62.93055555555978 32.36111111111106)' width='46.27777777777777' height='46.27777777777777' stroke-width='7' stroke-miterlimit='3' stroke='#000000' fill='#FFFFFF' d='M0,23.138888888888886 C0,10.359632266666665 10.359632266666665,0 23.138888888888886,0 C35.918145511111106,0 46.27777777777777,10.359632266666665 46.27777777777777,23.138888888888886 C46.27777777777777,35.918145511111106 35.918145511111106,46.27777777777777 23.138888888888886,46.27777777777777 C10.359632266666665,46.27777777777777 0,35.918145511111106 0,23.138888888888886 Z '/><path transform='matrix(1 0 0 1 37.037037037040704 98.47222222222149)' width='23.1388888888888' height='23.1388888888888' stroke-width='3.499999999999992' stroke-miterlimit='3' stroke='#000000' fill='#000000' d='M0,11.569444444444429 C0,5.179816133333333 5.179816133333304,2.842170943040401e-14 11.569444444444343,2.842170943040401e-14 C17.95907275555544,2.842170943040401e-14 23.1388888888888,5.179816133333333 23.1388888888888,11.569444444444429 C23.1388888888888,17.959072755555525 17.95907275555544,23.13888888888883 11.569444444444343,23.13888888888883 C5.179816133333304,23.13888888888883 0,17.959072755555525 0,11.569444444444429 Z '/><path transform='matrix(1 0 0 1 117.47222222222565 2.0601851851847197)' width='29.199074074074133' height='29.199074074074133' stroke-width='4.416666666666681' stroke-miterlimit='3' stroke='#000000' fill='#FFFFFF' d='M0,14.599537037037038 C0,6.536434644444427 6.536434644444398,-2.842170943040401e-14 14.599537037037067,-2.842170943040401e-14 C22.66263942962962,-2.842170943040401e-14 29.199074074074133,6.536434644444427 29.199074074074133,14.599537037037038 C29.199074074074133,22.662639429629678 22.66263942962962,29.199074074074105 14.599537037037067,29.199074074074105 C6.536434644444398,29.199074074074105 0,22.662639429629678 0,14.599537037037038 Z '/><path transform='matrix(1 0 0 1 2.8796296296329515 25.199074074073646)' width='33.60648148148147' height='33.60648148148155' stroke-width='5.0833333333333455' stroke-miterlimit='3' stroke='#000000' fill='#FFFFFF' d='M1.1368683772161603e-13,16.803240740740762 C1.1368683772161603e-13,7.523066288888828 7.523066288888913,-8.526512829121202e-14 16.803240740740762,-8.526512829121202e-14 C26.08341519259261,-8.526512829121202e-14 33.60648148148158,7.523066288888828 33.60648148148158,16.803240740740762 C33.60648148148158,26.08341519259264 26.08341519259261,33.60648148148147 16.803240740740762,33.60648148148147 C7.523066288888913,33.60648148148147 1.1368683772161603e-13,26.08341519259264 1.1368683772161603e-13,16.803240740740762 Z '/><path transform='matrix(1 0 0 1 64.03240740741165 51.09259259259244)' width='28.15910158681288' height='4.577837819227682' stroke-width='4' stroke-miterlimit='3' stroke='#000000' fill='#FFFFFF' d='M0,0 L-28.15910158681288,-4.577837819227682 '/><path transform='matrix(1 0 0 1 106.09823096449539 43.9054711059387)' width='15.38204786872467' height='17.197467719487236' stroke-width='5' stroke-miterlimit='3' stroke='#000000' fill='#FFFFFF' d='M0,0 L15.38204786872467,-17.197467719487236 '/><path transform='matrix(1 0 0 1 77.473757860549 76.98969981548896)' width='22.209834450410597' height='26.065149760156544' stroke-width='5' stroke-miterlimit='3' stroke='"+color+"' fill='none' d='M0,0 L-22.209834450410597,26.065149760156544 '/></g></svg>"
    }

    // define the zoomListener which calls the zoom function on the "zoom" event constrained within the scaleExtents
    var zoomListener = d3.behavior.zoom().scaleExtent([0.1, 3]).on("zoom", zoom);

    function initiateDrag(d, domNode) {
        draggingNode = d;
        d3.select(domNode).attr('class', 'node activeDrag');

        svgGroup.selectAll("g.node").sort(function(a, b) { // select the parent and sort the path's
            if (a.id != draggingNode.id) return 1; // a is not the hovered element, send "a" to the back
            else return -1; // a is the hovered element, bring "a" to the front
        });
        // if nodes has children, remove the links and nodes
        if (nodes.length > 1) {
            // remove link paths
            links = tree.links(nodes);
            nodePaths = svgGroup.selectAll("path.link")
                .data(links, function(d) {
                    return d.target.id;
                }).remove();
            // remove child nodes
            nodesExit = svgGroup.selectAll("g.node")
                .data(nodes, function(d) {
                    return d.id;
                }).filter(function(d, i) {
                    if (d.id == draggingNode.id) {
                        return false;
                    }
                    return true;
                }).remove();
        }

        // remove parent link
        parentLink = tree.links(tree.nodes(draggingNode.parent));
        svgGroup.selectAll('path.link').filter(function(d, i) {
            if (d.target.id == draggingNode.id) {
                return true;
            }
            return false;
        }).remove();

        dragStarted = null;
    }
    // define the baseSvg, attaching a class for styling and the zoomListener
    var baseSvg = d3.select("#tree").append("svg")
        .attr("width", viewerWidth)
        .attr("height", viewerHeight)
        .attr("class", "overlay")
        .call(zoomListener);
    // Define the drag listeners for drag/drop behaviour of nodes.
    dragListener = d3.behavior.drag()
        .on("dragstart", function(d) {
          //Do nothing if the node is root
            if (d == root) {
                return;
            }
            dragStarted = true;
            nodes = tree.nodes(d);
            d3.event.sourceEvent.stopPropagation();
            // it's important that we suppress the mouseover event on the node being dragged. Otherwise it will absorb the mouseover event and the underlying node will not detect it d3.select(this).attr('pointer-events', 'none');
        })
        .on("drag", function(d) {
            if (d == root) {
                return;
            }
            if (dragStarted) {
                domNode = this;
                initiateDrag(d, domNode);
            }

            d.x0 += d3.event.dy;
            d.y0 += d3.event.dx;
            var node = d3.select(this);
            node.attr("transform", "translate(" + d.y0 + "," + d.x0 + ")");


        }).on("dragend", function(d) {
            if (d == root) {
                return;
            }
            domNode = this;
            if (selectedNode) {
                sortTree();
                endDrag();
            } else {
                endDrag();
            }
        });

    function endDrag() {
        selectedNode = null;
        d3.selectAll('.ghostCircle').attr('class', 'ghostCircle');
        d3.select(domNode).attr('class', 'node');
        // now restore the mouseover event or we won't be able to drag a 2nd time
        d3.select(domNode).select('.ghostCircle').attr('pointer-events', '');
        if (draggingNode !== null) {
            update(root);
            centerNode(draggingNode);
            draggingNode = null;
        }
    }

    // Helper functions for collapsing and expanding nodes.

    function collapse(d) {
        if (d.children) {
            d._children = d.children;
            d._children.forEach(collapse);
            d.children = null;
        }
    }

    function expand(d) {
      //console.log("expand");

        if (d._children) {
            d.children = d._children;
            d.children.forEach(expand);
            d._children = null;
        }
    }

    var overCircle = function(d) {
        selectedNode = d;
        updateTempConnector();
    };
    var outCircle = function(d) {
        selectedNode = null;
        updateTempConnector();
    };

    // Function to update the temporary connector indicating dragging affiliation
    var updateTempConnector = function() {
        var data = [];
        if (draggingNode !== null && selectedNode !== null) {
            // have to flip the source coordinates since we did this for the existing connectors on the original tree
            data = [{
                source: {
                    x: selectedNode.y0,
                    y: selectedNode.x0
                },
                target: {
                    x: draggingNode.y0,
                    y: draggingNode.x0
                }
            }];
        }
        var link = svgGroup.selectAll(".templink").data(data);

        link.enter().append("path")
            .attr("class", "templink")
            .attr("d", d3.svg.diagonal())
            .attr('pointer-events', 'none');

        link.attr("d", d3.svg.diagonal());

        link.exit().remove();
    };

    // Function to center node when clicked/dropped so node doesn't get lost when collapsing/moving with large amount of children.

    function centerNode(source) {
        scale = zoomListener.scale();
        x = -source.y0;
        y = -source.x0;
        x = x * scale + viewerWidth / 2;
        y = y * scale + viewerHeight / 2;
        d3.select('g').transition()
            .duration(duration)
            .attr("transform", "translate(" + x + "," + y + ")scale(" + scale + ")");
        zoomListener.scale(scale);
        zoomListener.translate([x, y]);
    }

    // Toggle children function

    function toggleChildren(d) {
      //console.log("toggle children");
      //d.children = findConnections(d.name);
      //console.log(d);

      if(d.children == [] || d.children == null){
        //console.log("none");
        d.children = findConnections(d.name);
      }
      else{
        //console.log("has children");
        clearChildren(d.name);
        d.children = [];
      }


      // console.log(d.children);
      //   if (d.children) {
      //       d._children = d.children;
      //       d.children = null;
      //   } else if (d._children) {
      //       d.children = d._children;
      //       d._children = null;
      //   }
        return d;
    }

    // Toggle children on click.

    function click(d) {
      console.log(d3.select(this).node().parentNode.data);
              if (d3.event.defaultPrevented) return; // click suppressed
        if(currentMode() == "del"){
          deleteFroxmEdges(d.name);
          //console.log(this);
          //TODO tree.delete d
          //this.select("circle.nodeCircle");//.attr('class','nodeCircle');

          //this.s.attr('class','nodeCircle');
          console.log('delete '+d.name);
        } else{
        d = toggleChildren(d);
        update(d);
        centerNode(d);
      }
    }

    function currentMode(){
      return mode;
    }

    function update(source) {
        // Compute the new height, function counts total children of root node and sets tree height accordingly.
        // This prevents the layout looking squashed when new nodes are made visible or looking sparse when nodes are removed
        // This makes the layout more consistent.
        var levelWidth = [1];
        var childCount = function(level, n) {

            if (n.children && n.children.length > 0) {
                if (levelWidth.length <= level + 1) levelWidth.push(0);

                levelWidth[level + 1] += n.children.length;
                n.children.forEach(function(d) {
                    childCount(level + 1, d);
                });
            }
        };
        childCount(0, root);
        var newHeight = d3.max(levelWidth) * 25; // 25 pixels per line
        tree = tree.size([newHeight, viewerWidth]);

        // Compute the new tree layout.
          nodes = tree.nodes(root).reverse(),
            links = tree.links(nodes);

        // Set widths between levels based on maxLabelLength.
        nodes.forEach(function(d) {
            d.y = (d.depth * (maxLabelLength * 10)); //maxLabelLength * 10px
            // alternatively to keep a fixed scale one can set a fixed depth per level
            // Normalize for fixed-depth by commenting out below line
            // d.y = (d.depth * 500); //500px per level.
        });

        // Update the nodes…
        node = svgGroup.selectAll("g.node")
            .data(nodes, function(d) {
                return d.id || (d.id = ++i);
            });

        // Enter any new nodes at the parent's previous position.
        var nodeEnter = node.enter().append("g")
            .call(dragListener)
            .attr("class", "node")
            .attr("transform", function(d) {
                return "translate(" + source.y0 + "," + source.x0 + ")";
            })
            .on('click', click);

        nodeEnter.append("circle")
            .attr('class', 'nodeCircle')
            .attr("r", 0)
            .style("fill", function(d) {
                return d._children ? "lightsteelblue" : "#fff";
            });

        nodeEnter.append("text")
            .attr("x", function(d) {
                return d.children || d._children ? -10 : 10;
            })
            .attr("dy", ".35em")
            .attr('class', 'nodeText')
            .attr("text-anchor", function(d) {
                return d.children || d._children ? "end" : "start";
            })
            .text(function(d) {
                return d.name;
            })
            .style("fill-opacity", 0);

        // phantom node to give us mouseover in a radius around it
        nodeEnter.append("circle")
            .attr('class', 'ghostCircle')
            .attr("r", 30)
            .attr("opacity", 0.2) // change this to zero to hide the target area
        .style("fill", "red")
            .attr('pointer-events', 'mouseover')
            .on("mouseover", function(node) {
                overCircle(node);
            })
            .on("mouseout", function(node) {
                outCircle(node);
            });

        // Update the text to reflect whether node has children or not.
        node.select('text')
            .attr("x", function(d) {
                return d.children || d._children ? -10 : 10;
            })
            .attr("text-anchor", function(d) {
                return d.children || d._children ? "end" : "start";
            })
            .text(function(d) {
                return d.name;
            });

        // Change the circle fill depending on whether it has children and is collapsed
        node.select("circle.nodeCircle")
            .attr("r", 4.5)
            .style("fill", function(d) {
                return d._children ? "lightsteelblue" : "#fff";
            });

        // Transition nodes to their new position.
        var nodeUpdate = node.transition()
            .duration(duration)
            .attr("transform", function(d) {
                return "translate(" + d.y + "," + d.x + ")";
            });

        // Fade the text in
        nodeUpdate.select("text")
            .style("fill-opacity", 1);

        // Transition exiting nodes to the parent's new position.
        var nodeExit = node.exit().transition()
            .duration(duration)
            .attr("transform", function(d) {
                return "translate(" + source.y + "," + source.x + ")";
            })
            .remove();

        nodeExit.select("circle")
            .attr("r", 0);

        nodeExit.select("text")
            .style("fill-opacity", 0);

        // Update the links…
        var link = svgGroup.selectAll("path.link")
            .data(links, function(d) {
                return d.target.id;
            });

        // Enter any new links at the parent's previous position.
        link.enter().insert("path", "g")
            .attr("class", "link")
            .attr("d", function(d) {
                var o = {
                    x: source.x0,
                    y: source.y0
                };
                return diagonal({
                    source: o,
                    target: o
                });
            });

        // Transition links to their new position.
        link.transition()
            .duration(duration)
            .attr("d", diagonal);

        // Transition exiting nodes to the parent's new position.
        link.exit().transition()
            .duration(duration)
            .attr("d", function(d) {
                var o = {
                    x: source.x,
                    y: source.y
                };
                return diagonal({
                    source: o,
                    target: o
                });
            })
            .remove();

        // Stash the old positions for transition.
        nodes.forEach(function(d) {
            d.x0 = d.x;
            d.y0 = d.y;
        });
    }

    // Append a group which holds all nodes and which the zoom Listener can act upon.
    var svgGroup = baseSvg.append("g");

    // Define the root
    root = treeData;
    root.x0 = viewerHeight / 5;
    root.y0 = 0;
    //update(root);
    // Layout the tree initially and center on the root node.

    update(root);
    centerNode(root);

  //  document.getElementById('tree');
    //if(treeData.children!=null) centerNode(treeData.children[0]);

}
