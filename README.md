The metaphor mapper is a tool designed for easy exploration of common word connections and associations within a poet's work.

To begin, upload any desired files by selecting the file chooser next to the "Upload Files" option. You may upload as many files as you like. Only files with a .txt extension will be uploaded. It is assumed that the first line of the file is the title of the poem and will, therefore, not be analyzed.

After upload, you may navigate and view each poem by selecting its title in the display on the far left. The poem currenly in view in the middle of the screen is shown in blue font on the left panel. Clicking on a word will search all poems for that word and display any found connections or associations on the right panel in the form of a tree structure. All poems that contain the selected word will show up in red font on the left panel.

*Note about insignificant words and significant distance:
As of right now, there is a pre-defined list of words designated as "insignificant." These words are not clickable and will be skipped when searching for connections. In addition, the "significant distance" defines the maximum number of significant words between the selected word and any connections. It is pre-defined as 2. To changes these varibles, one must either change the variable in the code or wait for the pending configurations menu for user-defined words and distance.

Once a tree exists in the right panel, the user can continue building the current tree by selecting any word in the tree to expand and collapse the structure. Clicking on any edge in the tree will display any poems that contain those two terms. A user can also delete any edges considered unimportant. Holding down the "D" key on the keyboard will cause the program to enter delete mode which will delete any term when clicked in the tree. The tree also contains the ability to undo the last deletion. Simply hit "CTRL-Z" and the tree will redraw how it was one step ago.

To start a new tree, simply select a new word from any of the uploaded poems. This will erase any existing tree structure.

Once a tree with significant connections exists in the right most panel, the user can hit the "A" key on the keyboard to add it to the bottom panel. This panel takes all of the currently displayed tree structure connections and adds them to a graph. Similar to the tree structure, the user can delete words by holding the "D" key or click on any edges to view poems containing that connection. Upon addition of new words, the graph will move to accomodate all new words. However, the user can drag any node to lock it into place. To unlock a node, simply double click on the node. Hovering over a node will highlight all edges coming out of that node.

Upon addition or deletion, the program runs a cycle detection algorithm to detect any cycles within the graph. These cycles are displayed to the right of the graph and are ordered from shortest to longest. Selecting any of the cycles will highlight that cycle within the graph.

To clear the entire graph and start over, hit "CTRL-Z" and confirm your choice.

Happy metaphoring!
