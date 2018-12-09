var express = require("express");
var app = express();

var request = require("request");
var path    = require("path");
var favicon = require('serve-favicon');
// var bodyParser = require('body-parser');
// app.use(bodyParser.json());

var appUtil = require('./appUtil.js');

var channelName = "";
var handleFail = appUtil.handleFail;

// Route the scripts and styles to their resp directories as
// express cannot resolve absolute path for resources.
app.use('/scripts', express.static(__dirname + '/public/scripts'));
app.use('/styles', express.static(__dirname + '/public/styles'));
app.use(favicon(__dirname + '/public/images/favicon.ico'));

// Get the channel name on landing
app.get("/", (req, res) => {
   res.sendFile(path.join(__dirname+'/landing.html'));
}, handleFail);

// Send the parameter to Agora API for starting a new Channel
// or continue with an already existing channel
app.post("/sendChannel", (req, res) => {
   // req = JSON.parse(req);
   var POST = {};
   req.on('data', function(data) {
      data = data.toString();
      data = data.split('&');
      for (var i = 0; i < data.length; i++) {
          var _data = data[i].split("=");
          POST[_data[0]] = _data[1];
      }

      var postData = {
         secret: appUtil.CAPTCHA_SECRET,
         response: POST['g-recaptcha-response']
      }
      var options = {
            uri: appUtil.GOOGLE_CAPTCHA_URL,
            headers:{
               'content-type' : 'application/x-www-form-urlencoded'
            },
            body: require('querystring').stringify(postData)
      };
      
      request.post(options, (err, response, body) => {
         if (err){
            console.log(err);
         }else{
            var body = JSON.parse(body);
            if(body['success'] !== true){
               console.log('Error in processing captcha! Entry Denied.');
            }else{
               channelName = req.query.channelName;
               
               res.redirect("/show");
            }
         }
      });
   });
}, handleFail);

app.get("/show", (req, res) => {
   res.sendFile(path.join(__dirname+'/index.html'));
});

app.get("/getChannel", (req, res) => {
   res.end(channelName);
}, handleFail);

app.listen(8081);

console.log('Server running at http://127.0.0.1:8081/');