// server.js
// where your node app starts
var https = require('https');
// init project
var express = require('express');
var app = express();

function shortenUrl(){ 
  var shortened = 'https://supreme-save.glitch.me/' + random() + random() + random() + random();
  function random() {
    var num = Math.floor(Math.random() * 10);
    return num.toString();
  }
  return shortened;
}

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

app.get("/:url", function (request, response) {
 
  var myobj = {};
  
  myobj.originalUrl = decodeURIComponent(request.params.url);
  myobj.shortUrl = shortenUrl();
  response.send(myobj);
});

// could also use the POST body instead of query string: http://expressjs.com/en/api.html#req.body
app.post("/dreams", function (request, response) {
  dreams.push(request.query.dream);
  response.sendStatus(200);
});

// Simple in-memory store for now
var dreams = [
  "Find and count some sheep",
  "Climb a really tall mountain",
  "Wash the dishes"
];

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
