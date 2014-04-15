var app = app || {}
,  SERVER_IP = '54.238.203.212';

$(function(){

	/*var books = [
        { title: 'JavaScript: The Good Parts', author: 'Douglas Crockford', releaseDate: '2008', keywords: 'JavaScript Programming' },
        { title: 'The Little Book on CoffeeScript', author: 'Alex MacCaw', releaseDate: '2012', keywords: 'CoffeeScript Programming' },
        { title: 'Scala for the Impatient', author: 'Cay S. Horstmann', releaseDate: '2012', keywords: 'Scala Programming' },
        { title: 'American Psycho', author: 'Bret Easton Ellis', releaseDate: '1991', keywords: 'Novel Splatter' },
        { title: 'Eloquent JavaScript', author: 'Marijn Haverbeke', releaseDate: '2011', keywords: 'JavaScript Programming' }
    ];*/

 $('#releaseDate').datepicker();
 new app.LibraryView(); 
 var coverimage = $('#coverImage')[0];
 var formdata = false;

 if (window.FormData) {
      formdata = new FormData();
 }
 /*var frm = $('#addBook')[0];
 

 frm.addEventListener('submit', function(e){
   console.log('submit event!');

   e.preventDefault();
   var file = coverimage.files[0];
   //if(file){
 
    console.log('send image');
    var xhr = new XMLHttpRequest();
    xhr.file = file;
    xhr.open('post', window.location, true);
    xhr.setRequestHeader("x-uploadedfilename", file.fileName || file.name);
    xhr.send(file);
    file = '';
    frm.reset();
   //}
 });*/
 
 coverimage.onchange = function(e){
   console.log('20131020 file changed!\n\n');
   e.preventDefault();
   $("#response").text('Uploading...');
   console.log('check' + JSON.stringify(this.files));
   var i = 0, len = this.files.length, img, reader, file;

   for (; i < len; i++){
     file = this.files[i];
     /*console.log(file.name);
     console.log(file.size);
     console.log(file.type);*/
     
     if (formdata) {
       formdata.append("images[]", file);
     }
      
   }
   
   var image = coverimage.files[0];
    $('#fname').text(image.name);
    $('#fsize').text(image.size);
    $('#ftype').text(image.type);

    if (formdata) {
      $.ajax({
        url: 'http://' + SERVER_IP + '/coverimage',
        type: "POST",
        data: formdata,
        processData: false,
        contentType: false,
        success: function (res) {
          document.getElementById("response").innerHTML = res; 
        }
      });
    }    
 }
 /*coverimage.ondrop = function(e){
 	e.preventDefault();
     
 	console.log('on drop!!\n\n');
    console.log(e);
    console.log(e.dataTransfer.files[0].name);
    console.log(e.dataTransfer.files[0].size);
    console.log(e.dataTransfer.files[0].type);
 	var file = e.dataTransfer.files[0];
 	var formData = new FormData();
    
    $('#fname').text(e.dataTransfer.files[0].name);
    $('#fsize').text(e.dataTransfer.files[0].size);
    $('#ftype').text(e.dataTransfer.files[0].type);
    //for(var i=0; i< file.length; i++){
    formData.append('file', file[0]);
    //}

    var xhr = new XMLHttpRequest();
    xhr.open('POST', '10.0.0.144:4711/coverimage', true);
    xhr.onload = function() {
      console.log('upload finished!');
    };

    xhr.upload.onprogress = function (event) {
      if (event.lengthComputable) {
        var complete = (event.loaded / event.total * 100 | 0);
        console.log('complete:' + complete);
        //progress.value = progress.innerHTML = complete;
      }
    }

    xhr.send(formData);
 }*/
});
