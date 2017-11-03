var express = require('express');
var auchan = require('./auchan');

var app = express();

app.use('/auchan', auchan);

//var port = 3000;

//app.listen(port, function() {'Server running on port ' + port});

module.exports = app;
