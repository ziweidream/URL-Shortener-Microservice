// server.js
// where your node app starts
var MongoClient = require('mongodb').MongoClient;

// init project
var express = require('express');
var app = express();

function shortenUrl(originalUrl){ 
  var shortened = 'https://supreme-save.glitch.me/' + random() + random() + random() + random();
  function random() {
    var num = Math.floor(Math.random() * 10);
    return num.toString();
  }
  if (isInDb('short', shortened)) {
    shortened = 'https://supreme-save.glitch.me/' + random() + random() + random() + random();
  } 
  var url = "mongodb://vivi:123@ds229918.mlab.com:29918/urlmicroservice";
  if (isInDb('original', originalUrl) === false) {
  MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("urlmicroservice");    
  var obj = { original: originalUrl, short: shortened };
  dbo.collection("urls").insertOne(obj, function(err, res) {
    if (err) throw err;   
    db.close();
  });
});
  } else {
  MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("urlmicroservice");    
 
  dbo.collection("urls").findOne({original: originalUrl}, function(err, doc) {
    if (doc) {
      shortened = doc.short;
    };   
    db.close();
  });
});
  }
  return shortened;
}

function isUrlValid(str) {
    var res = str.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
    if(res == null)
        return false;
    else
        return true;
}

function isInDb(a, str) {
  var url = "mongodb://vivi:123@ds229918.mlab.com:29918/urlmicroservice";
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("urlmicroservice");    	
    dbo.collection("urls").findOne({a: str},function(err, doc) {
    if (doc) {
	    return true;
    } else {
	    return false;
	  }    
    db.close();     
    });    
  });   
}
// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

app.get("/new/*", function (request, response) { 
  var myobj = {};
  if (request.params[0].substring(0, 4) === "http" && isUrlValid(request.params[0])) {
    myobj.originalUrl = request.params[0];
    myobj.shortUrl = shortenUrl(request.params[0]);
  } else {
    myobj.error = "Wrong url format, please make sure you have a valid protocol and real site."
  }
  response.send(myobj);
});

app.get("/:num", function (request, response) {   
  var q = request.params.num;
  var url = "mongodb://vivi:123@ds229918.mlab.com:29918/urlmicroservice";
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
