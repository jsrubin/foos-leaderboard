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

var rankFILE = 'public/resources/ranking.json';
var rankingJSON = path.join(__dirname, 'public/resources/ranking.json');
var rankData = require('./public/resources/ranking.json');


app.set('port', 8080);

app.use('/', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/leaderboard', function(req, res) {
	fs.readFile(rankingJSON, function(err, data) {

	var payload = { "ranking": JSON.parse(data).payload };

  	res.json(payload);
  });
});

app.post('/leaderboard', function(req, res) {
	var payload = { "ranking": req.body.payload };

	fs.writeFile(rankFILE, JSON.stringify(req.body), function (err) {
	  if (err) return console.log(err)
	  console.log(JSON.stringify(payload))
	  console.log('writing to ' + rankFILE)
	});

  	res.json(payload);
});

app.listen(app.get('port'), function() {
  console.log('Server started: http://localhost:' + app.get('port') + '/');
});
