var express = require('express');
var bodyparser = require('body-parser');
var pg = require('pg').native;
var cors = require('cors');

var app = express();
var port = process.env.PORT || 8080;

var client = new pg.Client("postgres://localhost:5432");
client.connect();

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({
	extended: true
}));
app.use(cors());

app.get('/get', function(req,res,next){
	console.log(req.name);
	console.log(req.pass);
});

app.post('/post', function(req,res,next){
	console.log(req.name);
	console.log(req.pass);
});

app.listen(port, function () {
	console.log('Example app listening on port ' + port);
});

