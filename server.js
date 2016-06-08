var express = require('express');
var bodyparser = require('body-parser');
var pg = require('pg').native;
var cors = require('cors');

var app = express();
var port = process.env.PORT || 8080;

var client = new pg.Client('postgres://cfrdcdkekkltda:t5I8lgC9oRPRLMOCozVughDWR7@ec2-54-243-55-26.compute-1.amazonaws.com:5432/d8gouv7ilgaoe9');

client.connect();

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: true}));
app.use(cors());


app.get('/get', function(req,res,next){
	console.log(req);
	console.log(req.pass);
	
	client.query('select * from users;');
});
app.use(express.static(__dirname + '/public/'));
//app.use(express.static(__dirname+'/'));


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

// app.get('/',function(req,res,next){
// 	res.send(__dirname);
// });

app.post('/post/', function(req,res,next){

	var username = req.body.name;
	var password = req.body.pass;

	var query = client.query('select * from users where email = \'' +username +'\';');

	var results = [];

	query.on('row', function(row){
		results.push(row);
	});

	query.on('end', function(){
		var found = false;
		results.forEach(function(data){

			if(data.email == username && data.password == password && !found){
				res.send(JSON.stringify({outcome : 'correct'}));
				found = true;
			}
			else if(data.email == username && data.password != password && !found){
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
	// client.query("INSERT into users (title,gender,first_name,last_name,email,password,phone,address,city,country,birth_day,birth_month,birth_year) VALUES ('" + r_data.title  + "','" + r_data.gender  + "','" + r_data.fname  + "','" + r_data.lname  + "','" + r_data.email  + "','" + r_data.password  + "','" + r_data.phone  + "','" + r_data.address  + "','" + r_data.city  + "','" + r_data.country  + "'," + r_data.day  + "," + r_data.month  + "," + r_data.year + ");");
	res.send("done");
});


/*app.post('/post/', function(req,res,next){
	console.log(req.body.name);
	console.log(req.body.pass);
	
	client.query('select * from users;');

	console.log(client.query('insert into users (name, pass) values (\'reuben\', \'pass\')').text);

	res.sendStatus(200);
});*/

app.post('/register', function(req,res,next){
	console.log("jadfaef");
	console.log(req.body.register_data);
	res.sendStatus(200);
});

app.listen(port, function () {
	console.log('Example app listening on port ' + port);
});

