'use strict';

var express = require('express');
var mongo = require('mongodb');
var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
var app = express();

var bodyParser = require('body-parser');
var bodyParse = bodyParser.urlencoded({extended: false});

var utils = require('./utils.js');

//paths
var ROOT_PATH = '/';
var SHORTEN_URL_PATH = ROOT_PATH + 'api/shorturl/new';
app.use(ROOT_PATH,bodyParse);

var SHORT_URL_PATH = ROOT_PATH + 'api/shorturl/:id';

var cors = require('cors');

var result ;

// Basic Configuration 
var port = process.env.PORT || 3000;
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


/** this project needs a db !! **/ 
mongoose.connect(process.env.MONGOLAB_URI,{ useNewUrlParser: true });

//db details
var Schema = mongoose.Schema;

var urlSchema = new Schema({
  id: {type: Number, required: true},
  originalUrl: String});

var Url = mongoose.model('Url',urlSchema);
var response;


function shortenURL(req,res) {
  var result = {error : 'Invalid URL'};
  var inputURL  = req.body.url;
  var isValidURL = utils.validateURL(inputURL);
  if(isValidURL) {
    Url.findOne({originalUrl: inputURL},
                               function (err,data){
                               if(err || !data ) {insertAndReturn(inputURL);}
                               else { console.log(data); res.json({original_url: inputURL, short_url: data['id']});}}
    );
    function insertAndReturn(inputUrl) {
      var randomID = Math.floor(Math.random() * 10000);
      var inputDoc = {originalUrl: inputUrl,id: randomID};
      var result = {original_url: inputUrl,short_url: randomID};
      var url = new Url(inputDoc);
       url.save((err, data)=>{
       if (err){console.log('failed to create url'),console.log(err);}
       else {res.json(inputDoc);}
       });
    }
  }
  else {
    res.json(result);
  }
}
app.route(SHORTEN_URL_PATH).post(shortenURL);

function redirectURL(req,res) {
  console.log(req.params.id);
 Url.findOne({id : req.params.id},
                               function (err,data){
                               if(err || !data ) {res.json({error: 'Invalid Url'});}
                               else { console.log(data); 
                                     res.writeHead(301,{Location: data['originalUrl']});res.end();}}
    ); 
}

app.route(SHORT_URL_PATH).get(redirectURL);

app.listen(port, function () {
  console.log('Node.js listening ...');
});