var express = require('express');
var bodyparser = require('body-parser');
var pg = require('pg').native;
var cors = require('cors');

var app = express();
var port = process.env.PORT || 8080;

var client = new pg.Client("postgres://cfrdcdkekkltda:t5I8lgC9oRPRLMOCozVughDWR7@ec2-54-243-55-26.compute-1.amazonaws.com:5432/d8gouv7ilgaoe9");
client.connect();

app.use(bodyparser.json());
app.use(bodyparser.urlencoded());
app.use(cors());

app.post('/post/', function(req,res,next){

	var username = req.body.name;
	var password = req.body.pass;

	var query = client.query('select * from usersr where name = \'' +username +'\';');

	var results = [];

	query.on('row', function(row){
		results.push(row);
	});

	query.on('end', function(){
		results.forEach(function(data){

			if(data.pass == password){
				console.log('correct');
				res.send(JSON.stringify({outcome : true}));
			}
			else{
				console.log('incorrect');
				res.send(JSON.stringify({outcome : false}));

			}
		});
	})




	//query.on('end', function(){
	//	console.log(res.json(results))
	//})

});

/*app.post('/post/', function(req,res,next){
	console.log(req.body.name);
	console.log(req.body.pass);

	console.log(client.query('insert into users (name, pass) values (\'reuben\', \'pass\')').text);

	res.sendStatus(200);
});*/

app.listen(port, function () {
	console.log('Example app listening on port ' + port);
});

