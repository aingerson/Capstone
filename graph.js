function makeGraph(newGraph) {
  $("#graph").empty();

  var graph = newGraph;
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


  // var nodes = graph.nodes.slice(),
  //     links = [],
  //     bilinks = [];

  // graph.links.forEach(function(link) {
  //   //console.log(nodes);
  //   var s = nodes[link.source],
  //       t = nodes[link.target],
  //       i = {}; // intermediate node
  //   nodes.push(i);
  //   links.push({source: s, target: i}, {source: i, target: t});
  //   bilinks.push([s, i, t]);
  // });

  force
      .nodes(graph.nodes)
      .links(graph.links)
      .start();


      var link = svg.selectAll(".link")
           .data(graph.links)
         .enter().append("line")
           .attr("class", "link")
           .style("stroke-width", function(d) { return Math.sqrt(d.value); });

    //        var node = svg.selectAll(".node")
    //    .data(graph.nodes)
    //  .enter().append("circle")
    //    .attr("class", "node")
    //    .attr("r", 5)
    //    .style("fill", function(d) { return color(d.group); })
    //    .call(force.drag);

                //  node.append("text")
                //  .text(function(d) {return d.name;});

          // var elemEnter = node.enter();
          // var text = elemEnter.append("text")
          // .text(function(d){return d.name;})
          // .attr({
          //   "font-size":10
          // });
          var node = svg.selectAll(".graphNode")
                .data(graph.nodes);
            var elemEnter = node.enter();
            //
            var circle = elemEnter.append("circle")
                .attr("class", "node")
                .attr("r", 5)
                .style("fill", function(d) { return color(d.group); })
                .call(force.drag);

            // elemEnter.append("text")
            //   .text(function(d){return d.name})
            //   .attr({
            //     "font-size":10
            //   })
            //   .call(force.drag);

              node.append("title")
                    .text(function(d) { return d.name; })
                    .attr("dx",function(d){return d.dx;})
                    .attr("dy",function(d){return d.dy;});

      force.on("tick", function() {
        link.attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });

        node.attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; });
      });
}
