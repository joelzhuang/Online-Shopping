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


 app.use(function(req,res,next){
   //webiste you wish to allow to connect
   res.setHeader('Access-Control-Allow-Origin','*')
   //request methods you wish to allows
   res.setHeader('Access-Control-Allow-Methods','GET,POST,OPTIONS,PUT,PATCH,DELETE');
   //request headers you wish to allow
   res.setHeader('Access-Control-Allow-Headers','Content-Type,Access-Control-Allow-Headers');
   //pass next layer of middleware
   next();
 });

// app.get('/',function(req,res,next){
// 	res.send(__dirname);
// });



app.post('/login/', function(req,res,next){

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

			console.log(data);
			console.log('hey')

			if(data.email == username && data.password == password && !found){
				res.send(JSON.stringify({outcome : 'correct'}));
				//req.session.user_id
				req.session.user_id = username;
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

app.get('/user/', function(req,res,next){
	console.log(req);
	res.sendStatus(200);
});

app.post('/register/', function(req,res,next) {
	var r_data = req.body.register_data;
	// client.query("INSERT into users (title,gender,first_name,last_name,email,password,phone,address,city,country,birth_day,birth_month,birth_year) VALUES ('" + r_data.title  + "','" + r_data.gender  + "','" + r_data.fname  + "','" + r_data.lname  + "','" + r_data.email  + "','" + r_data.password  + "','" + r_data.phone  + "','" + r_data.address  + "','" + r_data.city  + "','" + r_data.country  + "'," + r_data.day  + "," + r_data.month  + "," + r_data.year + ");");
	res.send("done");
});

function checkAuth(req, res, next) {
  if (!req.session.user_id) {
    res.send('You are not authorized to view this page');
  } else {
    next();
  }
}


/*app.post('/post/', function(req,res,next){
	console.log(req.body.name);
	console.log(req.body.pass);
	
	client.query('select * from users;');

	console.log(client.query('insert into users (name, pass) values (\'reuben\', \'pass\')').text);

	res.sendStatus(200);
});*/

/** */

var item_table = "items";
var user_table = "users";
var cart_table = "cart";
//var connectionString = "postgres://mckayvick:dragons@depot:5432/mckayvick_nodejs";
//var client = new pg.Client(connectionString);
//client.connect(); 

// getting around the ole cross-site scripting issue
app.use(function(req,res,next) {
  res.setHeader('Access-Control-Allow-Origin','*') // this seems unsafe somehow
  res.setHeader('Access-Control-Allow-Methods','GET,POST,OPTIONS,PUT,PATCH,DELETE');
  // from the cors website:
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

/* add a new item to the cart */
app.post('/add', function (req, res) { 
    res.json("Add request");
    console.log("Add request");
  if (req.body == undefined || req.body.length <= 0) {
     console.log("invalid cart-add request, ignoring @ "+ new Date().getTime());
  }
  console.log('request from '+ ("get client name") +' to server to buy item '+ req.item_id);
  // checks to make sure the post comes from a logged-in user here
  if (req.body.id == undefined || req.body.uid == undefined) {
    console.log("invalid cart request "+ req.body);
  }
  var query = client.query('SELECT * FROM '+items_table+' where id is '+ req.body.id);
  var result;
  query.on('row',function(row) {
    console.log(row);
    result = row;
    query = client.query('INSERT INTO '+cart_table+' values');
  });
  
  query.on('end',function() {
    res.json(row);
  });
});
 
//Accessible at localhost:8080/ 
app.get('/all', function (req, res) { 
  res.json("all request");
  console.log("all request");
  var query = client.query('SELECT * FROM '+item_table+';');
  var results = [];
  query.on('row',function(row) {
    console.log(row);
    results.push(row);
  });
  query.on('end',function() {
    res.json(results);
  });
});

app.listen(port, function () {
	console.log('Example app listening on port ' + port);
});

