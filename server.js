/**
* Server.js 
* 
*/

var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var request = require('request');
var url = require('url');

var rankData = require('./public/resources/ranking.json');
var humor = require('./public/resources/humor.json');


app.set('port', 3000);

app.use('/', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/leaderboard', function(req, res) {
  var payload = _.extend(rankData, humor);
  res.json(payload);
});


app.listen(app.get('port'), function() {
  console.log('Server started: http://localhost:' + app.get('port') + '/');
});



};