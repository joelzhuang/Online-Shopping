var express = require('express');
var session = require('express-session');
var pgSession = require('connect-pg-simple')(session);
var bodyparser = require('body-parser');
var pg = require('pg').native;
var cors = require('cors');

var app = express();
var port = process.env.PORT || 8080;

var connectionString = 'postgres://cfrdcdkekkltda:t5I8lgC9oRPRLMOCozVughDWR7@ec2-54-243-55-26.compute-1.amazonaws.com:5432/d8gouv7ilgaoe9';
var client = new pg.Client(connectionString);

client.connect();

// SESSION/COOKIE STUFF
app.use(session({
	secret: 'keyboard cat',
	resave: false,
	saveUninitialized: false,
  	cookie: {
  		maxAge: 360000,
  		httpOnly: false,
  		secure: false 
  	}
}));

// JSON STUFF
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

/*
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
 */

// app.get('/',function(req,res,next){
// 	res.send(__dirname);
// });


app.get('/checkLogin/', function(req,res,next){

	console.log(req.session)

	if(req.session && req.session.loggedIn){
		console.log('found')
		res.send('found')
	}
	else{
		console.log('not found')
		res.send('not found')

}

})

app.get('/logout', function(req, res, next){

	console.log(req.session)
	if(req.session){
	req.session.loggedIn = false;
	req.session.destroy();

	res.send('200');

}

})

app.post('/googleLogin/', function(req, res, next){

	var username = req.body.name;

	var query = client.query('select * from users where email = \'' +username +'\';');

	var results = [];

	query.on('row', function(row){
		results.push(row);
	});

	query.on('end', function(){
		var found = false;
		results.forEach(function(data){

			if(data.email == username &&!found){
				req.session.loggedIn = true;
				req.session.email = data.email;
				res.send(JSON.stringify({outcome : 'correct'}));
				found = true;
			}

		});

	if(!found){
		res.send(JSON.stringify({outcome : 'incorrect'}));
	}

	console.log(req.session)
	
	})

	//query.on('end', function(){
	//	console.log(res.json(results))
	//})



})



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

			if(data.email == username && data.password == password && !found){
				req.session.loggedIn = true;
				req.session.email = data.email;
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

	console.log(req.session)
	
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
var size_table = "sizes";
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


/* add a new item to the cart 
TODO: return correct HTTP code on fail, check is logged in
*/
app.post('/add', function (req, res) {
  // check the response has a body
  if (req.body == undefined || req.body.length <= 0) {
     console.log("invalid cart-add request: no body");
     res.status(400).send('Bad Request');
  }
  // checks to make sure the post comes from a logged-in user here
  if (req.body.iid == undefined || req.body.uid == undefined
      // this line is where the logged-in check goes!
     ) {
    console.log("invalid cart request: no identifying information\n\t"+ req.body);
    res.status(400).send('Bad Request'); //res.status(500).json({ error: 'message' })
  }
  // check the size request is valid
  
  
  // is the id in the item table?
  var has = client.query('SELECT 1 FROM '+ item_table +' WHERE iid = '+ req.body.iid +';');
  if (has == 1) {
    console.log("found iid "+iid);
    // given all these are valid, checks if the user already has an entry in the checkout table
//    var size = client.query('SELECT 1 from '+ size_table +' WHERE size='+ req.body.size +';');

    // for now, assume we have the size & the client has no other items in the checkout table
    client.query("INSERT INTO "+ cart_table +" values("+ req.body.uid +", "+ req.body.iid +", 'Medium', 1");
  } else {
    console.log(has);
  }
  /*
  var if_request = "IF EXISTS (SELECT * FROM "+ item_table +" WHERE iid = "+ req.body.iid +")";
      if_request+= "BEGIN"
        if_request+= 
      if_request+= "END"; */
  
  // if so, increments the number of items they have ordered of this type and size
  // if not, adds a new row to the checkout table

  query.on('end',function() {
    res.json(row).send('Bad Request');
  });
});
 

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

app.get('/men', function (req, res) { 
  query.on('end',function() {
    res.json(getCategory('men'));
  });
});

var getCategory = new function(category) {
  console.log(category +" request");
  var query = client.query("SELECT * FROM "+item_table+" WHERE category='"+category+"';");
  var results = [];
  query.on('row',function(row) {
    console.log(row);
    results.push(row);
  });
};

app.listen(port, function () {
	console.log('Example app listening on port ' + port);
});

