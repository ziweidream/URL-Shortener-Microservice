var MongoClient = require('mongodb').MongoClient;
var express = require('express');
var app = express();

function shortenUrl(originalUrl){  
  var shortened = 'https://supreme-save.glitch.me/' + random() + random() + random() + random();  
  function random() {
    var num = Math.floor(Math.random() * 10);
    return num.toString();
  }
  if (isInDb(shortened)) {
    shortened = 'https://supreme-save.glitch.me/' + random() + random() + random() + random();
  } 
  var url = process.env.MONGODB_URI; 
  MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("urlmicroservice");    
  var obj = { original: originalUrl, short: shortened }; 
  dbo.collection("urls").insertOne(obj, function(err, res) {
    if (err) throw err;   
    db.close();
  });
});  
  return shortened;
}

function isInDb(str) {
  var url = process.env.MONGODB_URI;
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("urlmicroservice");    	
    dbo.collection("urls").findOne({short: str},function(err, doc) {
    if (doc) {
	    return true;
    } else {
	    return false;
	  }    
    db.close();     
    });    
  });   
}

function isUrlValid(str) {
    var result = str.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
    if(result == null)
        return false;
    else
        return true;
}

app.use(express.static('public'));

app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

app.get("/new/*", function (request, response) { 
  var myobj = {};
  if ((request.params[0].substring(0, 6) === "http:/" || request.params[0].substring(0, 6) === "https:") && isUrlValid(request.params[0])) {
    myobj.originalUrl = request.params[0];
    myobj.shortUrl = shortenUrl(request.params[0]);
  } else {
    myobj.error = "Wrong url format, please make sure you have a valid protocol and real site."
  }
  response.send(myobj);
});

app.get("/:num", function (request, response) {   
  var q = request.params.num;
  var url = process.env.MONGODB_URI;
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("urlmicroservice");    	
    dbo.collection("urls").findOne({short: "https://supreme-save.glitch.me/" + q},function(err, doc) {
    if (doc) {
	    response.redirect(doc.original);
    } else {
	    response.redirect('/');
	  }    
    db.close();     
    });    
  });    
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
