var graph;


function makeGraph(newGraph) {
  $("#graph").empty();

  graph = newGraph;
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


  var nodes = graph.nodes.slice(),
      links = [],
      bilinks = [];

  graph.links.forEach(function(link) {
    //console.log(nodes);
    var s = nodes[link.source],
        t = nodes[link.target],
        i = {}; // intermediate node
    nodes.push(i);
    links.push({source: s, target: i}, {source: i, target: t});
    bilinks.push([s, i, t]);
  });

  force
      .nodes(nodes)
      .links(links)
      .start();

  var link = svg.selectAll(".graphLink")
      .data(bilinks)
    .enter().append("path")
      .attr("class", "link");



  var node = svg.selectAll(".graphNode")
      .data(graph.nodes);
  var elemEnter = node.enter();
  //
  // var circle = elemEnter.append("circle")
  //     .attr("class", "node")
  //     .attr("r", 5)
  //     .style("fill", function(d) { return color(d.group); })
  //     .call(force.drag);

  elemEnter.append("text")
    .text(function(d){return d.name})
    .attr({
      "font-size":10
    })
    .call(force.drag);

  node.append("title")
      .text(function(d) { return d.name; })
      .attr("dx",function(d){return d.dx;})
      .attr("dy",function(d){return d.dy;});


  force.on("tick", function() {
    link.attr("d", function(d) {
      return "M" + d[0].x + "," + d[0].y
          + "S" + d[1].x + "," + d[1].y
          + " " + d[2].x + "," + d[2].y;
    });
    node.attr("transform", function(d) {
      return "translate(" + d.x + "," + d.y + ")";
    });
  });
}
