//
// A static file server using express.js to avoid CORs errors for development
//
var express = require('express');
var app = express();
app.use(express.static(__dirname + '/public'));
app.listen(3000, function () {
  console.log('listening')
});
