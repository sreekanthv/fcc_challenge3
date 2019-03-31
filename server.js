'use strict';

var express = require('express');
var mongo = require('mongodb');
var mongoose = require('mongoose');

var cors = require('cors');

var app = express();

// Basic Configuration 
var port = process.env.PORT || 3000;

/** this project needs a db !! **/ 
// mongoose.connect(process.env.MONGOLAB_URI);

app.use(cors());

/** this project needs to parse POST bodies **/
// you should mount the body-parser here

app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});

  
// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});

//paths
var ROOT_PATH = '/';
var SHORTEN_URL_PATH = ROOT_PATH + 'api/shorturl/new';

function processPostedUrl(req,res) {
  var originalUrl = req.body.url_input;
  return res.json({original_url: originalUrl}); 
}

app.post(SHORTEN_URL_PATH,processPostedUrl);

app.listen(port, function () {
  console.log('Node.js listening ...');
});