var express = require('express');
var bodyparser = require('body-parser');
var pg = require('pg').native;
var cors = require('cors');

var app = express();
var port = process.env.PORT || 8080;

<<<<<<< HEAD
var client = new pg.Client('postgres://cfrdcdkekkltda:t5I8lgC9oRPRLMOCozVughDWR7@ec2-54-243-55-26.compute-1.amazonaws.com:5432/d8gouv7ilgaoe9');
=======
var client = new pg.Client("postgres://cfrdcdkekkltda:t5I8lgC9oRPRLMOCozVughDWR7@ec2-54-243-55-26.compute-1.amazonaws.com:5432/d8gouv7ilgaoe9");
>>>>>>> 21af2187db1e019a3fac30a85a85673500a92ab7
client.connect();

app.use(bodyparser.json());
app.use(bodyparser.urlencoded());
app.use(cors());

<<<<<<< HEAD
app.get('/get', function(req,res,next){
	console.log(req);
	console.log(req.pass);
	
	client.query('select * from users;');
});
=======
// app.use(function(req,res,next){
//   //webiste you wish to allow to connect
//   res.setHeader('Access-Control-Allow-Origin','*')
//   //request methods you wish to allows
//   res.setHeader('Access-Control-Allow-Methods','GET,POST,OPTIONS,PUT,PATCH,DELETE');
//   //request headers you wish to allow
//   res.setHeader('Access-Control-Allow-Headers','Content-Type,Access-Control-Allow-Headers');
//   //pass next layer of middleware
//   next();
// });
>>>>>>> 21af2187db1e019a3fac30a85a85673500a92ab7

app.post('/post/', function(req,res,next){

	var username = req.body.name;
	var password = req.body.pass;

	var query = client.query('select * from usersr where name = \'' +username +'\';');

	var results = [];

	query.on('row', function(row){
		results.push(row);
	});

	query.on('end', function(){
		var found = false;
		results.forEach(function(data){

			if(data.name == username && data.pass == password && !found){
				res.send(JSON.stringify({outcome : 'correct'}));
				found = true;
			}
			else if(data.name == username && data.pass != password && !found){
				res.send(JSON.stringify({outcome : 'badpw'}));
				found = true;
			}
		});
	if(!found){
		res.send(JSON.stringify({outcome : 'incorrect'}));
	}
	})




	//query.on('end', function(){
	//	console.log(res.json(results))
	//})

});

app.post('/register/', function(req,res,next) {
	var r_data = req.body.register_data;
	console.log(r_data);
	console.log(r_data.title);
	res.send("done");
});


/*app.post('/post/', function(req,res,next){
	console.log(req.body.name);
	console.log(req.body.pass);
	
	client.query('select * from users;');

	console.log(client.query('insert into users (name, pass) values (\'reuben\', \'pass\')').text);

	res.sendStatus(200);
});*/

app.listen(port, function () {
	console.log('Example app listening on port ' + port);
});

