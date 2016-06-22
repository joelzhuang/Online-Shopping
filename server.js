var express = require('express');
var session = require('express-session');
var pgSession = require('connect-pg-simple')(session);
var bodyparser = require('body-parser');
var pg = require('pg').native;
var cors = require('cors');

var app = express();
var port = process.env.PORT || 8080;

//var connectionString = process.env.DATABASE_URL?ssl=true;
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

app.use(function(req,res,next) {
  res.setHeader('Access-Control-Allow-Origin','*') // this seems unsafe somehow
  res.setHeader('Access-Control-Allow-Methods','GET,POST,OPTIONS,PUT,PATCH,DELETE');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

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

/** ======================== database ======================== */

var item_table = "items";
var user_table = "users";
var cart_table = "cart";
var size_table = "sizes";
var cat_table = "categories";
var subcat_table = "subcategories";

/* Add a new item to the cart 
  TODO: return correct HTTP code on fail, check the sender is logged in
*/
app.post('/:iid/:size', function (req, res) {
  console.log(req.body);
  /*
  if (req.body == undefined || req.body.length == 0
    // this line is where the logged-in check goes!
  ) {
    console.log("invalid cart request: no identifying information\n\t"+ req.body);
    res.status(400).send('Bad request: ');
    return;
  } */
  // TODO: check validity of size, iid and uid
  var query = client.query('INSERT INTO '+cart_table+' values('+ req.params.uid +', '+ req.params.iid +', \''+ req.params.size +'\', 1)', function(err, result) {
    if(err) {
      console.error('error running query', err);
      res.status(400).send('Bad request: the database does not contain entries for the given values.');
    }
  });
  query.on('row', function() {
    console.log("row successfully returned");
  });
  // next('route');
  query.on('end',function() {
    // done
    res.json({ added:true });
  });
  client.end();
});

/** Get all the items in the database */
app.get('/all', function (req, res) {
  var query = client.query('SELECT * FROM '+item_table+';');
  var results = [];
  query.on('row',function(row) {
    results.push(row);
  });
  query.on('end',function() {
    res.json(results);
  });
});

/** Get all the items in quiet-bastio-96093.herokuapp.com/category/ */
app.get('/:category', function (req, res) {
  if (req.params.category == undefined) {
    console.log("cannot find an undefined category");
    next('route');
  }
  console.log(req.params.category); 
  var arr = getCategory(req.params.category); 
  res.json(arr);
});

/** Get all the items in quiet-bastio-96093.herokuapp.com/category/subcategory */
app.get('/:category/:subcategory', function (req, res) {
  if (req.params.category == undefined) {
    console.log("cannot find an undefined subcategory");
    next('route');
  }
  console.log(req.params.category +", "+req.params.subcategory); 
  var arr = getCategory(req.params.category,req.params.subcategory); 
  res.json(arr);
});

app.listen(port, function () {
	console.log('Local app listening on port ' + port);
});


/** ======================== helper functions ======================== */
var getCategory = function(category) {
  console.log("Finding the category "+ category);
  var query = client.query("SELECT * FROM "+item_table+" WHERE category='"+category+"';");
  var results = [];
  query.on('row',function(row) {
    results.push(row);
    console.log(row);
  });
  
  query.on('end',function() {
    return results;
  });
};

var getSubcategory = function(category,subcategory) {
  console.log("Finding the subcategory "+ subcategory);
  var query = client.query("SELECT * FROM "+item_table+" WHERE subcategory='"+subcategory+"' and category='"+category+"';");
  var results = [];
  query.on('row',function(row) {
    results.push(row);
    console.log(row);
  });
  
  query.on('end',function() {
    return results;
  });
};

