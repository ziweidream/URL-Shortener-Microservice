// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();

var alphabet = "0123456789";
var base = alphabet.length; // base is the length of the alphabet (58 in this case)
// utility function to convert base 10 integer to base 58 string
function shortenUrl(str){
  var shortened = '';
  
  return shortened;
}

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

app.get("/new/:url", function (request, response) {
 
  var myobj = {};
  myobj.originalUrl = request.params.url;
  myobj.shortUrl = encode(request.params.url);
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
