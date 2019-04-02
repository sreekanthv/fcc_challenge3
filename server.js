'use strict';

var express = require('express');
var mongo = require('mongodb');
var mongoose = require('mongoose');
var app = express();

var bodyParser = require('body-parser');
var bodyParse = bodyParser.urlencoded({extended: false});

//paths
var ROOT_PATH = '/';
var SHORTEN_URL_PATH = ROOT_PATH + 'api/shorturl/new';
app.use(ROOT_PATH,bodyParse);

var cors = require('cors');



// Basic Configuration 
var port = process.env.PORT || 3000;

/** this project needs a db !! **/ 
mongoose.connect(process.env.MONGOLAB_URI,{ useNewUrlParser: true });

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

//db details
var Schema = mongoose.Schema;

var urlSchema = new Schema({
  id: {type: Number, required: true},
  originalUrl: String,
  shortUrl: String});

var Url = mongoose.model('Url',urlSchema);

function getNextId(callback){
  var currentId = 0;
  var findQuery = Url.find().sort({id:-1}).limit(1);
  findQuery.exec(function(err, maxResult){
      if (err) {console.log('initial record');}
      else {
        currentId = parseInt(maxResult[0]['id']);
      }

  }); 
 if(!isNaN(currentId)) {
   console.log('got max id ' + currentId);
   callback(null,++currentId)
 }
 else {
   console.log('invalid id  ' + currentId);
   callback(null,0);
 }
}
function createAndSaveUrl (urlStr,res,callback) {
 var nextId = getNextId(SaveUrl);// get the id
};
function SaveUrl(urlStr,res) {
 var shortUrl = 'https://spectrum-soybean.glitch.me/api/shorturl/' + nextId;
 var url = new Url({id: nextId, originalUrl: urlStr,shortUrl: shortUrl});
 url.save((err, data)=>{
  if (err){console.log('failed to create url'); return undefined};
  return shortUrl;
  })
          }

function returnResponse(urlStr,res,callback) {
  let shortUrl = '';
  var findQuery = Url.findOne({originalUrl: urlStr});
  findQuery.exec((err, data)=>{
  if (err || !data) {
    console.log('failed to fetch url'); 
    callback(err);
  }
  else {
    console.log('fetched from db ' + data['shortUrl']);
    console.log( typeof (data['shortUrl']));
    shortUrl = data['shortUrl'];
    console.log(shortUrl);
    callback(null,urlStr,shortUrl,res);
  }
 });
}; 

function returnUrl(originalUrl,dbUrl,res) {
  var result = {original_url: originalUrl,short_url: dbUrl};
  if(dbUrl !== '' || dbUrl !== undefined) {    
    result.short_url = dbUrl;
  }
  else {    
    console.log('doesnot exist');
    result.short_url  = createAndSaveUrl(originalUrl);       
  }
  return res.json(result); ;
}

var validateURL = require('./utils.js').validateURL;
function processPostedInput(req,res) {  
  //console.log(req);
  var originalUrl = req.body.url;
  if(!validateURL(originalUrl)) {
     return res.json({"error":"invalid URL"});
  }    
  return returnResponse(originalUrl,res,returnUrl);    
}


app.route(SHORTEN_URL_PATH).post(processPostedInput);

app.listen(port, function () {
  console.log('Node.js listening ...');
});