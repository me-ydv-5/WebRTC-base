var express = require("express");
var path    = require("path");
var multer = require("multer");
var upload = multer();

var app = express();
app.use('/scripts', express.static(__dirname + '/scripts'));
app.use('/styles', express.static(__dirname + '/styles'));


app.get("/", (req, res) => {
   res.sendFile(path.join(__dirname+'/index.html'));
});
// http.createServer(function (request, response) {
//    // Send the HTTP header 
//    // HTTP Status: 200 : OK
//    // Content Type: text/plain
//    response.writeHead(200, {'Content-Type': 'text/plain'});
   
//    // Send the response body as "Hello World"
//    response.end('Hello World\n');
// }).listen(8081);
app.listen(8081, '::');

console.log('Server running at http://127.0.0.1:8081/');