/*
* Initializes download tools when document is loaded
*/
$(document).ready(function() {
    initializeDownload();
});

/*
* Initializes download tools
*/
function initializeDownload() {
    (function() {
        var textFile = null,
            makeTextFile = function(text) {
                var data = new Blob([text], {
                    type: 'text/plain'
                });
                // If we are replacing a previously generated file we need to
                // manually revoke the object URL to avoid memory leaks.
                if (textFile !== null) {
                    window.URL.revokeObjectURL(textFile);
                }
                textFile = window.URL.createObjectURL(data);
                return textFile;
            };
        var create = document.getElementById('create');
        document.getElementById('upload').addEventListener('change', upload, false);
        create.addEventListener('click', function() {
            var link = document.getElementById('downloadlink');
            link.href = makeTextFile(saveState());
            link.style.display = 'block';
        }, false);
    })();
}

/*
* Deals with upload of new state
*/
function upload(evt) {
    var f = evt.target.files[0];
    if (!txtExtension(f.name)) return;//not appropriate file
    var reader = new FileReader();
    var result;
    reader.onload = function(e) {
        var text = e.target.result;
        var json = JSON.parse(text);//read in text as JSON
        restoreNewState(json);//restore the state
    };
    reader.readAsText(f, "UTF-8");
}
