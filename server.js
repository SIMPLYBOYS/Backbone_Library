var application_root = __dirname,
    express = require('express'),
    path = require('path'),
    knox = require('knox'),
    fs = require('fs'),
    icon_image_index = 0,
    mongoose = require('mongoose');
   
mongoose.connect('mongodb://localhost/library_database');

var client = knox.createClient({
    key: 'AKIAJGEW4YMGN7E6624Q'
  , secret: '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'
  , bucket: 'aaronchou'
});

var Keywords = new mongoose.Schema({
    keyword: String
});

var Book = new mongoose.Schema({
  coverImage: String,
  title: String,
  author: String,
  releaseDate: Date,
  keywords: [ Keywords ]
});

//Schema
var BookModel = mongoose.model('Book', Book);

var app = express();

app.configure(function(){
  app.use( express.bodyParser() );

  app.use( express.methodOverride() );

  app.use( app.router );

  app.use( express.static( path.join(application_root, 'site') ) );

  app.use( express.errorHandler({dumpExceptions: true, showStack: true }));

});

app.get('/', function(req, res){
  var path = __dirname + '/site/index.html'
  ,   html = fs.readFileSync(path)
  ,   type = 'text/html';
  
  console.log('===== Welcome to Backbone Library!!=======');
  res.writeHead(200, {'Content-Type': type});
  res.write(html);
  icon_image_index = 0; //reset icon indexa
  console.log('endpoint of s3 client: ' + client.endpoint);
  console.log('region of s3 client' + client.region);
  res.end();
});

app.get('/s3_put', function(req, res){
  console.log('s3_put test case!\n');
  var buffer = new Buffer('a string of data');
  var headers = {
    'Content-Type': 'text/plain'
  };
  client.putBuffer(buffer, '/string.txt', headers, function(err, res){
     console.log('buffering method: '+ res);
  });
  res.redirect('/');
});

app.get('/s3/:name', function(req, res){
  var file_name = req.params.name;  
  fs.stat('./site/img/' + file_name, function(err, stat){
    var s3req = client.put('/' + file_name,{
      'Content-Length': stat.size
    , 'Content-Type': 'text/plain'
    });
    fs.createReadStream('./site/img/' + file_name).pipe(s3req);
    s3req.on('response', function(s3res){
      console.log('get response: ' + s3res.statusCode);
      if(s3res.statusCode == 200){
        console.log('====== s3 upload end ====-\n\n'); 
        s3req.end('s3 upload finish');
        res.redirect('/');
      }
    });
  }); 
});

app.get('/s3list', function(req, res){
  client.list({prefix: ''}, function(err, data){
    console.log("===== s3 bucket list ====\n" + JSON.stringify(data));
  });
  res.redirect('/');
});

app.get('/s3del/:name', function(req, res){
  var file_name = req.params.name;
  client.del('/' + file_name).on('response', function(res){
    console.log(res.statusCode);
    console.log(res.headers + '\n ====== delete s3 file finished =======\n\n');
  }).end();  
  res.redirect('/');
});

app.get('/api', function(req, res){
  fs.stat('./site/img/learning_javascript_design_patterns.jpg', function(err, stat){
  // Be sure to handle `err`.

  var req = client.put('/Readme.md', {
        'Content-Length': stat.size
      , 'Content-Type': 'text/plain'
    });

    console.log('test' + JSON.stringify(req));

    fs.createReadStream('./Readme.md').pipe(req);

    req.on('response', function(s3res){
       console.log('get response!' + s3res); 
    });
  });
  res.send('Library API is running');
});

app.get('/api/books', function(req, res){
  return BookModel.find(function(err, books){
    if( !err ){
      console.log('\n\n20131206 ====' + JSON.stringify(books) + '===\n\n');
      return res.send(books);
    } else {
      return console.log(err);
    }
  });
});

app.get('/api/books/:id', function(req, res){
  console.log('Get a Book' + req.body.title);
  return BookModel.findById(req.params.id, function(err, book){
    if(!err){
      return res.send(book);
    } else {
      return console.log(err);
    }
  });
});

app.delete('/api/books/:id', function(req, res){
  console.log('Delete a Book');
  return BookModel.findById(req.params.id, function(err, book){
    return book.remove( function(err){
      if(!err){
        console.log('Book removed'); 
      } else {
        console.log(err);
      }
    });
  });
});

app.put('/api/books/:id', function(req, res){
  console.log('Update book' + req.body.id);
  return BookModel.findById(req.params.id, function(err, book){
    book.title = req.body.title;
    book.author = req.body.author;
    book.releaseDate = req.body.releaseDate;
    book.keywords = req.body.keywords;
    return book.save(function(err){
      if(!err){
        console.log('book update!');
      } else {
        console.log(err);
      }
      return res.send(book);
    });
  });
});

app.post('/api/books', function(req, res){
  var book = new BookModel({
    coverImage: req.body.coverImage,
    //coverImage: 'img/123456.png',
    title: req.body.title,
    author: req.body.author,
    releaseDate: req.body.releaseDate,
    keywords: req.body.keywords
  });
  console.log('aaron check: ' + req.body.coverImage + ' ' + book.title +'\n\n');
  console.log(JSON.stringify(book));
  book.save( function(err){
   if(!err) {
     return console.log('created!');
   } else {
     return console.log('err in created book process');
   }
   return res.send(book); 
  });
});

app.get('/coverimage', function(req, res){
  console.log('icon_image_index: ' + icon_image_index);
  console.log(__dirname);
  console.log('get coverimage!\n\n');
  res.end();
});

app.post('/coverimage', function(req, res){
  //console.log('req.files:' + JSON.stringify(req.files.images[0][1]));
  if(icon_image_index == 0){
    var tmp_path = req.files.images[0].path
    ,   target_path = './site/img/' + req.files.images[0].name;
    console.log(target_path);
  } else {
    var tmp_path = req.files.images[0][icon_image_index].path
    ,   target_path = './site/img/' + req.files.images[0][icon_image_index].name;
  }
  fs.rename(tmp_path, target_path, function(err){
     if(err) throw err;
     fs.unlink(tmp_path, function(){
       if (err) throw err;
       console.log('------ finish upload! ------\n\n');
     });
  });
  icon_image_index += 1;
  //var filename = req.files.images[0][icon_image_index].name;
  console.log(tmp_path);
  //console.log('req.files' + JSON.stringify(req.files));
  console.log('upload coverimage!!');
});

app.get('/hello', function(req, res){
  console.log('------- Testing model fetch ------');
});

var port = 4711;
app.listen(port, function(){
  console.log('Express server listening on port %d in %s mode', port, app.settings.env);
});
