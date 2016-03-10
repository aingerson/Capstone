
function scanFiles(files,i,j){
  var output = [];
  var f;
  for (;i<j; i++) { //read every file
      f = files[i];
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
      reader.onloadend = function(e){
        adjustSizes();
      };
  }
}
