var express = require("express");
var app = express();
var cors = require('cors');
var fs = require('fs');
var https = require('https');

var key = fs.readFileSync('private.key');
let options = {
	key
}

var request = require("request");
var favicon = require('serve-favicon');
var ejs = require('ejs');
// var bodyParser = require('body-parser');
// app.use(bodyParser.json());

var appUtil = require('./appUtil.js');

var channelName = "";

/**
 * @name handleFail
 * @param err Error thrown by any function
 * @description Helper function to handle errors
 */
let handleFail = function(err, code){
   console.log("Error : ", err);
};
app.use(cors());

// Route the scripts and styles to their resp directories as
// express cannot resolve absolute path for resources.
app.use('/scripts', express.static(__dirname + '/public/scripts'));
app.use('/styles', express.static(__dirname + '/public/styles'));
app.use(favicon(__dirname + '/public/images/favicon.ico'));

// Send the parameter to Agora API for starting a new Channel
// or continue with an already existing channel
app.get('/',(req, res) =>{
	res.send('connected')
})

app.post("/sendChannel", (req, res) => {
   var POST = {};
   req.on('data', function(data) {
      data = data.toString();
      data = data.split('&');
      for (var i = 0; i < data.length; i++) {
          var _data = data[i].split("=");
          POST[_data[0]] = _data[1];
      }

      var options = {
            uri: appUtil.GOOGLE_CAPTCHA_URL,
            headers:{
               'content-type' : 'application/x-www-form-urlencoded'
            },
            body: require('querystring').stringify({
               secret: appUtil.CAPTCHA_SECRET,
               response: POST['response']
            })
      };
      
      request.post(options, (err, response, body) => {
         if (err){
            console.log("Error occured while calling captcha url: ", err);
         }else{
         	console.log(body)
            var body = JSON.parse(body);
            if(body['success'] !== true){
               console.log('Error in processing captcha! Entry Denied.');
               ejs.renderFile("./404.ejs", {code: response.statusCode, 
                  string: "Psst! Some problem has occured!"},
                  {client: true},(err, str) =>{
                     if(err)
                        console.log(err);
                     else{
                        res.render(str);
                     }
                  });
            }else{
               console.log(POST);
               channelName = POST['channelName'];
               console.log("POST channel name "+ channelName);
               res.send({success: true});
            }
         }
      });
   });
}, handleFail);

app.use(function(req, res, next) {
   let err = new Error('Page Not Found');
   err.statusCode = 404;
   next(err);   
});

app.use(function(error, req, res, next) {
   ejs.renderFile("./404.ejs", {code: error.statusCode, 
      string: "It's okay to come here, it's not a cardinal sin. But now, "},
      {client: true},(err, str) =>{
         if(err)
            console.log(err);
         else{
            res.end(str);
         }
      });
});

https.createServer(options, app).listen(8081);
console.log('Server running at http://127.0.0.1:8081/');
