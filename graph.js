function makeGraph(newGraph) {
  $("#graph").empty();
  var graph = newGraph;
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

  // var force = d3.layout.force()
  //     .charge(-120)
  //     .linkDistance(30)
  //     .size([width, height]);

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

  // force
  //     .nodes(graph.nodes)
  //     .links(graph.links)
  //     .start();
  //
  //
  //     var link = svg.selectAll(".graphLink")
  //          .data(graph.links)
  //        .enter().append("line")
  //          .attr("class", "graphLink")
  //          .style("stroke-width", function(d) { return Math.sqrt(d.value); });
  //
  //
  //          var node = svg.selectAll(".graphNode")
  //                .data(graph.nodes);
  //            var elemEnter = node.enter();
  //            //
  //            // var circle = elemEnter.append("circle")
  //            //     .attr("class", "node")
  //            //     .attr("r", 5)
  //            //     .style("fill", function(d) { return color(d.group); })
  //            //     .call(force.drag);
  //
  //            elemEnter.append("text")
  //              .text(function(d){return d.name})
  //              .attr({
  //                "font-size":10
  //              })
  //              .call(force.drag);
  //
  //            node.append("title")
  //                .text(function(d) { return d.name; })
  //                .attr("dx",function(d){return d.dx;})
  //                .attr("dy",function(d){return d.dy;});
  //
  //
  //   //        var node = svg.selectAll(".graphNode")
  //   //    .data(graph.nodes)
  //   //  .enter().append("text")
  //   //   .text(function(d){return d.name})
  //   //    .attr({
  //   //      "font-size":10
  //   //     })
  //   //    .call(force.drag);
  //
  //               //  node.append("text")
  //               //  .text(function(d) {return d.name;});
  //
  //         // var elemEnter = node.enter();
  //         // var text = elemEnter.append("text")
  //         // .text(function(d){return d.name;})
  //         // .attr({
  //         //   "font-size":10
  //         // });
  //         // var node = svg.selectAll(".graphNode")
  //         //       .data(graph.nodes);
  //         //   var nodeEnter = node.enter()
  //         //     .append("g")
  //         //     .call(force.drag)
  //         //     .attr("class", "node");
  //         //   //
  //         //   nodeEnter.append("circle")
  //         //       .attr('class', 'nodeCircle')
  //         //       .attr("r", 5)
  //         //       .style("fill", "red");
  //         //
  //         //   nodeEnter.append("text")
  //         //       .attr('class', 'nodeText')
  //         //       .text(function(d) {
  //         //           return d.name;
  //         //       });
  //
  //
  //
  //
  //           // var circle = elemEnter.append("circle")
  //           //     .attr("class", "node")
  //           //     .attr("r", 5)
  //           //     .style("fill", function(d) { return color(d.group); })
  //           //     .call(force.drag);
  //
  //           // elemEnter.append("text")
  //           //   .text(function(d){return d.name})
  //           //   .attr({
  //           //     "font-size":10
  //           //   })
  //           //   .call(force.drag);
  //
  //             node.append("title")
  //                   .text(function(d) { return d.name; })
  //                   .attr("dx",function(d){return d.dx;})
  //                   .attr("dy",function(d){return d.dy;});
  //
  //     force.on("tick", function() {
  //       link.attr("x1", function(d) { return d.source.x; })
  //           .attr("y1", function(d) { return d.source.y; })
  //           .attr("x2", function(d) { return d.target.x; })
  //           .attr("y2", function(d) { return d.target.y; });
  //
  //       node.attr("cx", function(d) { return d.x; })
  //           .attr("cy", function(d) { return d.y; });
  //     });


  force
        .nodes(graph.nodes)
        .links(graph.links)
        .start();

    var link = svg.selectAll(".graphLink")
        .data(graph.links)
      .enter().append("line")
        .attr("class", "graphLink")
        .style("stroke-width", function(d) { return Math.sqrt(d.value); })
        .attr('pointer-events', 'click')
        .on("click", function(link) {

//          console.log(link.source.name+","+link.target.name);
        showConnections(link.source.name,link.target.name);
          //  console.log("Link was clicked between ["+link.source.name+"] and ["+link.target.name+"] .");
        });

    var node = svg.selectAll(".graphNode")
        .data(graph.nodes)
      .enter().append("text")
        //.attr("class", "graphNode")
        //.attr("r", 5)
        //.style("fill", function(d) { return color(d.group); })
        .text(function(d){return d.name;})
        .attr({
          "font-size" :10
        })
        .call(force.drag);


        // elemEnter.append("text")
        //           //   .text(function(d){return d.name})
        //           //   .attr({
        //           //     "font-size":10
        //           //   })
        //           //   .call(force.drag);

    node.append("title")
        .text(function(d) { return d.name; });

    force.on("tick", function() {
      link.attr("x1", function(d) { if(d.source.x== NaN) return 0; return d.source.x; })
          .attr("y1", function(d) { if(d.source.y== NaN) return 0; return d.source.y; })
          .attr("x2", function(d) { if(d.target.x== NaN) return 0; return d.target.x; })
          .attr("y2", function(d) { if(d.target.y== NaN) return 0; return d.target.y; });

      node.attr("x", function(d) { return d.x; })
          .attr("y", function(d) { return d.y; });
    });

//  var link = svg.selectAll(".graphLink")
 //     .data(graph.links)
 //   .enter().append("line")
 //     .attr("class", "link")
 //     .style("stroke-width", function(d) { return Math.sqrt(d.value); });
 //
 // var node = svg.selectAll(".graphNode")
 //     .data(graph.nodes)
 //   .enter().append("circle")
 //     .attr("class", "node")
 //     .attr("r", 5)
 //     .style("fill", function(d) { return color(d.group); })
 //     .call(force.drag);
 //
 // node.append("title")
 //     .text(function(d) { return d.name; });
 //
 // force.on("tick", function() {
 //   link.attr("x1", function(d) { return d.source.x; })
 //       .attr("y1", function(d) { return d.source.y; })
 //       .attr("x2", function(d) { return d.target.x; })
 //       .attr("y2", function(d) { return d.target.y; });
 //
 //   node.attr("cx", function(d) { return d.x; })
 //       .attr("cy", function(d) { return d.y; });
 // });
}
