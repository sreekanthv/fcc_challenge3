function validateURL(url) {
  var urlRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
  if(url.match(urlRegex)) {
     //console.log(url + " matches");
    return true;
  }
  else {
     //console.log(url + " not matches");
    return false;
  }
}


exports.validateURL= validateURL;