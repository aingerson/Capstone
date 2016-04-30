var visited;
//var onStack = [];
var cycles;
var prev;
var currCycle;
var visitedEdges;

function findCycles(){
  visited = [];
  cycles = [];
  prev = -1;
  currCycle = [];
  visitedEdges = [];
  for(var j=0;j<graph.nodes.length;j++){
    visited.push(0);
  //  onStack.push(0);
  }
  for(var j=0;j<graph.links.length;j++){
    visitedEdges.push(0);
  }
  for(var g=0;g<graph.nodes.length;g++){
    dfs(g);
  }
  sortCycles();
//  printAllCycles();
  return cycles;
}
//
// function printAllCycles(){
//   for(var j=0;j<cycles.length;j++){
//     printCycle(cycles[j]);
//   }
// }

function sortCycles(){
  var count = 0;
  var ret = [];
  var i = 3;
  while(count<cycles.length){
    for(var h=0;h<cycles.length;h++){
      if(cycles[h].length==i){
        ret.push(cycles[h]);
        count++;
      }
    }
    i++;
  }
  cycles = ret;
}

function dfs(current){
  //curr = current;
  //console.log("Current: " + graph.nodes[current].name);
  if(current>graph.nodes.length-1) return;
  //onStack[current] = 1;
  visited[current] = 1;
  var nexts = getNext(current);
  var nextIndex = getLinkIndex(current,nexts);
  //console.log("Next:");
  //printCycle(nexts);
  currCycle.push(current);
  for(var k=0;k<nexts.length;k++){
    var nextVal = nexts[k];
      if(nextVal==currCycle[0]){
      //  printCycle(currCycle);
        cycles.push(copyCycle(currCycle));
      }
      else if(visited[nextVal] == 0 && visitedEdges[nextIndex[k]] == 0){
        prev = current;
        visitedEdges[nextIndex[k]] = 1;
        dfs(nextVal);
        visitedEdges[nextIndex[k]] = 0;
      }
  }
  currCycle.splice(currCycle.length-1,1);
}

function copyCycle(cyc){
  var newCyc = [];
  for(var t=0;t<cyc.length;t++){
    newCyc.push(cyc[t]);
  }
  return newCyc;
}

function printCycle(cyc){
  var print = "";
  for(var p=0;p<cyc.length;p++){
    print += graph.nodes[cyc[p]].name;
    if(p!=cyc.length-1){
      print+="->";
    }
  }
  return print;
}


function getNext(val){
  var ret = [];
  for(var j=0;j<graph.links.length;j++){
    //console.log(graph.nodes[graph.links[j].source.index].name+":"+graph.nodes[graph.links[j].target.index].name);
    if(graph.links[j].source.index==val){
      if(prev < 0 || (prev>=0 && graph.links[j].target.index != prev)){
        ret.push(graph.links[j].target.index);
      }
    }
    else if(graph.links[j].target.index==val){
      if(prev < 0 || (prev>=0 && graph.links[j].source.index != prev)){
        ret.push(graph.links[j].source.index);
      }
    }
  }
  return ret;
}

function getLinkIndex(wordIndex,nextIndex){
  var ret = [];
  for(var r=0;r<graph.links.length;r++){
    for(var r2=0;r2<nextIndex.length;r2++){
      if(graph.links[r].target.index==wordIndex && nextIndex[r2]){
        ret.push(r);
      }
      else if(graph.links[r].source.index==wordIndex && nextIndex[r2]){
        ret.push(r);
      }
    }
  }
  return ret;
}


// int visited[NUM_NODE + 1];
// int onStack[NUM_NODE + 1];
//
// void dfs(Node * current){
//         if(!current) return;
//         onStack[current->value] = true;
//         visited[current->value] = true;
//         Node *temp = current->next;
//         while(temp){
//                 if(onStack[temp->value] == true){
//                         printf("\n Cycle detected at node %d", temp->value);
//                 }
//                 else if(visited[temp->value] != true){
//                         dfs(graph[temp->value]);
//                 }
//                 temp = temp->next;
//         }
//         onStack[current->value] = false;
// }
// //Driver program
// int main(){
//
//         int i;
//         for(i=1; i<=NUM_NODE; i++){
//                 graph[i] = create_node(i);
//         }
//         add_edge_1(1,2);
//         add_edge_1(1,5);
//         add_edge_1(2,3);
//         add_edge_1(2,4);
//         add_edge_1(4,1);
//         add_edge_1(3,4);
//         add_edge_1(4,6);
//         add_edge_1(5,4);
//         add_edge_1(5,6);
//
//         for(i=1; i<=NUM_NODE; i++){
//                 visited[i] = false;
//         }
//         dfs(graph[1]);
//
//         return 0;
// }
