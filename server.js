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

function isUrlValid(url) {
    var res = url.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
    if(res == null)
        return false;
    else
        return true;
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
    myobj.shortUrl = shortenUrl();
  } else {
    myobj.error = "Wrong url format, make sure you have a valid protocol and real site."
  }
  response.send(myobj);
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
