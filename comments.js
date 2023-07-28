//create a web server
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var path = require('path');
var fs = require('fs');
var http = require('http');
var https = require('https');
var privateKey  = fs.readFileSync('sslcert/private.pem', 'utf8');
var certificate = fs.readFileSync('sslcert/file.crt', 'utf8');
var credentials = {key: privateKey, cert: certificate};
var httpsServer = https.createServer(credentials, app);

var port = 3000;

//set up body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//set up static file path
app.use(express.static(path.join(__dirname, 'public')));

//set up default route
app.get('/', function(req, res){
	res.send('Hello World!');
});

//set up route for get request
app.get('/comments', function(req, res){
	//create a sample data
	var comments = [{author: 'Pete Hunt', text: 'This is one comment'},