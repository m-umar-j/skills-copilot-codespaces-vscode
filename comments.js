//create a web server
import express, { static } from 'express';
var app = express();
import { urlencoded, json } from 'body-parser';
import { join } from 'path';
import { readFileSync } from 'fs';
import http from 'http';
import { createServer } from 'https';
var privateKey  = readFileSync('sslcert/private.pem', 'utf8');
var certificate = readFileSync('sslcert/file.crt', 'utf8');
var credentials = {key: privateKey, cert: certificate};
var httpsServer = createServer(credentials, app);

var port = 3000;

//set up body parser
app.use(urlencoded({ extended: false }));
app.use(json());

//set up static file path
app.use(static(join(__dirname, 'public')));

//set up default route
app.get('/', function(req, res){
	res.send('Hello World!');
});

//set up route for get request
app.get('/comments', function(req, res){
	//create a sample data
	var comments = [{author: 'Pete Hunt', text: 'This is one comment'},];});