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
var conn = mongoose.createConnection(process.env.MONGOLAB_URI,{ useNewUrlParser: true });
autoIncrement.initialize(conn);


//db details
var Schema = mongoose.Schema;

var urlSchema = new Schema({
  id: {type: Number, required: true},
  originalUrl: String});

urlSchema.plugin(autoIncrement.plugin, 'id');

var Url = conn.model('Url',urlSchema);
var response;



function processPostedInput(req,res) {  
  //console.log(req);
 
  
}
function findInDB(urlStr,callback) {
  let shortUrl = '';
  var findQuery = Url.findOne({originalUrl: urlStr});
  findQuery.exec((err, data)=>{
  if (err || !data) {
    console.log('failed to fetch url'); 
    return callback(err);
  }
  else {
    return callback(null,urlStr,data);
  }
 });
};

function returnUrl(originalUrl,urlRec) {
  if(urlRec !== undefined) {    
    console.log('no errors');
    formResult(originalUrl,urlRec['id'])
  }
  else {    
    console.log('doesnot exist');
    createAndSaveUrl(originalUrl,formResult);       
  }
}

function createAndSaveUrl(urlStr,callback) {
 var url = new Url({originalUrl: urlStr});
 url.save((err, data)=>{
  if (err){console.log('failed to create url'); callback(err)}
  else {
    console.log(data);
    callback(null,data['id']);}
  });
}

function formResult(err,originalUrl,id,callback) {
  if(err) {
    return {error : 'Invalid URL'};
  } else{
    result = {original_url: originalUrl,short_url: id};
   return result;
  };
}


function shortenURL(req,res) {
  var result = {error : 'Invalid URL'};
  var inputURL  = 
  var isValidURL = utils.validateURL(req.body.url);
  if(isValidURL) {
    var findQuery = Url.findOne({originalUrl: })
  }
  else {
    var isExisting = 
    res.json(result);
  }
}
app.route(SHORTEN_URL_PATH).post(shortenURL);

app.listen(port, function () {
  console.log('Node.js listening ...');
});