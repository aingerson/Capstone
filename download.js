$(document).ready(function() {
    initializeDownload();
});

function initializeDownload(){
  (function () {
var textFile = null,
  makeTextFile = function (text) {
    var data = new Blob([text], {type: 'text/plain'});

    // If we are replacing a previously generated file we need to
    // manually revoke the object URL to avoid memory leaks.
    if (textFile !== null) {
      window.URL.revokeObjectURL(textFile);
    }

    textFile = window.URL.createObjectURL(data);

    return textFile;
  };


  var create = document.getElementById('create');
  //  textbox = document.getElementById('textbox');
document.getElementById('upload').addEventListener('change', upload, false);
  create.addEventListener('click', function () {
    var link = document.getElementById('downloadlink');
    link.href = makeTextFile(saveState());
    link.style.display = 'block';
  }, false);
})();
}


function upload(evt){
  var f = evt.target.files[0];
  //console.log(f);

  if(!txtExtension(f.name)) return;

  var reader = new FileReader();
  var result;
  reader.onload = function(e) {
      var text = e.target.result;
      var json = JSON.parse(text);
      restoreNewState(json);
  };
  reader.readAsText(f, "UTF-8");





}
