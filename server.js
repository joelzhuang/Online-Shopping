// DEPENDENCIES
// =======================================================

var express = require('express');
var session = require('express-session');
var pgSession = require('connect-pg-simple')// (session);
var cookieParser = require('cookie-parser');
var bodyparser = require('body-parser');
var pg = require('pg').native;
var cors = require('cors');
var url = require('url');
var router = express.Router(); // routing! life is so much easier.
var app = express();

// VARIABLES AND SETUP
// =======================================================
var port = process.env.PORT || 8080;
var connectionString = 'postgres://cfrdcdkekkltda:t5I8lgC9oRPRLMOCozVughDWR7@ec2-54-243-55-26.compute-1.amazonaws.com:5432/d8gouv7ilgaoe9';
var client = new pg.Client(connectionString);

client.connect();


// SESSION/COOKIE STUFF
// =======================================================
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
// =======================================================
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: true}));
app.use(cors());
app.use(express.static(__dirname + '/public'));
app.use(cookieParser());
//app.use(express.static(__dirname+'/'));

app.use(function(req,res,next) {
  res.setHeader('Access-Control-Allow-Origin','*') // this seems unsafe somehow
  res.setHeader('Access-Control-Allow-Methods','GET,POST,OPTIONS,PUT,PATCH,DELETE');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

/** Refresh the cookie's expiration time, if the user is logged in. */
app.all(function (req,res,next) {
	if (is_logged_in(req.session)) {
		console.log("user "+ req.session.email +" is logged in, resetting cookie");
		/* var query = url.parse(req.url, true, true).query;
		res.setHeader('Set-Cookie', cookie.serialize('email', String(query.email), {
			httpOnly: true,
			maxAge: 3600000 // 1 week 
		})); */
    } else {
      console.log("user is NOT logged in");
    }
});

app.get('/get', function(req,res,next){
	console.log(req);
	console.log(req.pass);
	
	client.query('select * from users;');
});


// PAGE ROUTING
// =======================================================

app.get('/$', function(req,res) {
  res.sendFile(__dirname +'/index.html');
});
app.get('/home', function(req,res) {
  res.sendFile(__dirname +'/index.html');
});
app.get('/cart$', function(req,res) {
  res.sendFile(__dirname +'/cart.html');
});
app.get('/contact$', function(req,res) {
  res.status(404).send('Contacts page not yet implemented!');
});
app.get('/orders$', function(req,res) {
  res.status(404).send('Orders page not yet implemented!');
});
app.get('/register$', function(req,res) {
  res.sendFile(__dirname +'/register.html');
});
app.get('/login$', function(req,res) {
  res.sendFile(__dirname +'/login.html');
});

// app.get('/',function(req,res,next){
// 	res.send(__dirname);
// });

// LOGIN / LOGOUT
// =======================================================
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
});

app.get('/logout', function(req, res, next){

	console.log(req.session)
	if(req.session){
		req.session.loggedIn = false;
		req.session.destroy();
		res.send('200');
	}
});

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
	
	});

	//query.on('end', function(){
	//	console.log(res.json(results))
	//})



});



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
	
	});

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



// SHOPPING
// =======================================================
var item_table = "items";
var user_table = "users";
var cart_table = "cart";
var size_table = "sizes";
var cat_table = "categories";
var subcat_table = "subcategories";
var subcat_table = "orders";



app.get('/shop/*', function (req,res,next) {
  console.log("got a shop request");
  next();
});

// makes sure the user is logged in before making changes to the cart
app.get('/cart/*', function (req, res, next) {
  var logged_in = is_logged_in(req.session);
  if (!logged_in || req.body == undefined) {
    res.status(403).send("Please log in to view the contents of your cart.");
  }
  next();
});


/** Get all the items in the database */
app.get('/shop/all$', function (req, res) {
  var query = client.query("SELECT * FROM "+item_table+";");
  var results = [];
  query.on('row',function(row) {
    results.push(row);
  });
  query.on('error', function(err) {
    if(err) {
      console.log("ERROR: error running query", err);
      res.status(500).send("Bad request: the database does not contain entries for the given values.");
    }
  });
  query.on('end',function() {
    res.json(results);
  });
});



/** Load all the items in a user's cart */
app.get('/cart/all/:uid', function (req, res) {
  
  var id = get_id (req.session.email);
  console.log(req.session.email +": "+id+", "+req.session.user_id);
  
  console.log("SELECT "+item_table+".iid, "+item_table+".name, "+cart_table+".size, "+cart_table+".quantity, "+item_table+".price"
    +" FROM "+ cart_table+", "+item_table
    +" WHERE "+cart_table+".uid = "+id+" and "+item_table+".iid = "+cart_table+".iid;");
    
  var query = client.query("SELECT "+item_table+".name, "+cart_table+".size, "+cart_table+".quantity"
    +" FROM "+ cart_table+", "+item_table
    +" WHERE "+cart_table+".uid = "+id+" and "+item_table+".iid = "+cart_table+".iid;");
  var results = [];
  query.on('row',function(row) {
    results.push(row);
  });
  query.on('error', function(err) {
    if(err && !wasSent) {
      console.log("ERROR: error running query", err);
      res.status(500).send("Bad request: the database does not contain entries for the given values.");
    }
  });
  query.on('end',function() {
    if (!wasSent) {
      res.json(results);
    }
  });
});



/* Remove an item from the cart 
  TODO: make sure the request is actually coming from the right user
  TODO: make the quantities update correctly
*/
app.post('/cart/delete/:iid/:size$', function (req, res) {
	
  var id = get_id (req.session.email);
  console.log(req.session.email +": "+id);
  
  var query = client.query("DELETE FROM "+ cart_table +" only"
    +" WHERE uid = "+id+" and iid = "+req.params.iid
    +" and size = \'"+req.params.size+"\';");
  query.on('error', function(err) {
    if(err && !wasSent) {
      console.log("Encountered an error while querying the database: "+ err);
      console.log(Object.getOwnPropertyNames(err));
      res.status(500).send("Database error: "+err);
      wasSent = true;
    }
  });
  query.on('end',function(result) {
    // done
    if (!wasSent) {
      res.json({ added:true });
    }
  });
});



/* Add a new item to the cart. */
app.post('/cart/:iid/:size$', function (req, res) {

  var id = get_id (req.session.email);
  console.log(req.session.email +": "+id);
  
    // TODO: check validity of size, iid and uid
  var query = client.query("INSERT INTO "+cart_table+" (uid,iid,size,quantity,price)"
      +" SELECT "+id+", "+req.params.iid+", '"+req.params.size+"', 1, price"
      +" FROM items"
      +" WHERE iid="+req.params.iid);
  query.on('error', function(err) {
    if(err && !wasSent) {
      console.log("Encountered an error while querying the database: "+ err);
      console.log(Object.getOwnPropertyNames(err));
      res.status(500).send("Database error: "+err);
    }
  });
  query.on('end',function(result) {
    // done
    if (!wasSent) {
      res.json({ added:true });
    }
  });
});



/** Get all the items in a category/ */
app.get('/shop/:category$', function (req, res) {
  var category = req.params.category;
  
  if (category == undefined) {
    console.log("Cannot find an undefined category");
    res.status(400).send("Bad request: cannot search for an undefined category.");
  }
  var wasSent = false;
  var hasCategory = client.query("SELECT true FROM "+cat_table+" WHERE cat='"+req.params.category+"';");
  hasCategory.on('row',function(row,result) {
    result.addRow(row);
  });
  hasCategory.on('end',function(result) {
    if (result.rows.length == 0 && !wasSent) {
      wasSent = true;
      res.status(404).send("The requested category could not be found.");
    }
  });
  console.log("Finding the category "+ category);
  var results = [];
  var query = client.query("SELECT * FROM "+item_table+" WHERE category='"+category+"';");
  query.on('row',function(row) {
    results.push(row);
  });
  query.on('error',function(err) {
    if (err && !wasSent) {
      wasSent = true;
      console.log("ERROR: pg encountered an error while parsing this request!");
      res.status(500).send("Could not load the requested category. Please try again.");
    }
  });
  query.on('end',function() {
    if (!wasSent) {
      wasSent = true;
      res.json(results);
    }
  });
});



/** Get all the items in quiet-bastion-96093.herokuapp.com/category/subcategory */
app.get('/shop/:category/:subcategory$', function (req, res, next) {

  var category = req.params.category;
  var subcategory = req.params.subcategory;
  if (category == undefined || subcategory == undefined) {
    console.log("Cannot find an undefined category or subcategory!");
    res.status(400).send("Bad request: cannot search for an undefined "+ (subcategory == undefinied ? "subcategory" : "category") +".");
  }
  console.log("Finding the subcategory "+ subcategory);
  
  var wasSent = false;
  
  var hasCategory = client.query("SELECT true FROM "+subcat_table+" WHERE subcat='"+req.params.subcategory+"';");
  hasCategory.on('row',function(row,result) {
    result.addRow(row);
  });
  hasCategory.on('end',function(result) {
    if (result.rows.length == 0 && !wasSent) {
      wasSent = true;
      res.status(404).send("The requested subcategory could not be found.");
    }
  });
  var results = [];
  var query = client.query("SELECT * FROM "+item_table+" WHERE category='"+category+"' and subcategory='"+subcategory+"';");
  query.on('row',function(row) {
    results.push(row);
  });
  query.on('error',function(err) {
    if (err && !wasSent) {
      wasSent = true;
      console.log("ERROR: ps encountered an error while parsing this request!" +err);
      res.status(500).send("Could not load the requested subcategory. Please try again.");
    }
  });
  query.on('end',function() {
    if (!wasSent) {
      wasSent = true;
      res.json(results);
      console.log(results);
    }
  });
});



/* CHECK OUT ITEMS. */
app.post('/cart/checkout/:uid$', function (req, res) {
  
  var id = get_id (req.session.email);
  console.log(req.session.email +": "+id);
  
  // TODO: check validity of size, iid and uid
  var query = client.query("INSERT INTO "+order_table+" (placed,uid,iid,quantity,oid)"
      +" SELECT '"+date.getFullYear()+"-"+date.getMonth()+"-"+date.getDay()+"', iid, quantity, price, oid"
      +" FROM items, cart"
      +" WHERE iid="+cart_table+".iid"
      +" and uid="+cart_table+".uid and uid="+id
      +" and quantity="+cart_table+"+req.params.iid"
      +" and oid = (select max(oid) from tbl)+1 ;");
  query.on('error', function(err) {
    if(err && !wasSent) {
      console.log("Encountered an error while querying the database: "+ err);
      res.status(500).send("The database encountered an error while processing your request.");
      wasSent = true;
    }
  });
  query.on('end',function(result) {
    // done
    if (!wasSent) {
      var removeNext = client.query("DELETE FROM "+cart_table+" where uid="+id+";");
      removeNext.on('error', function(err) {
        console.log("Something has gone seriously wrong and the database is unsafe! (uid="+id+")");
        res.status(500).send("The database encountered an awful, awful error while processing your request.");
        wasSent = true;
      });
      removeNext.on('end', function() {      
        res.json({ added:true });
      });
    }
  });
});


// FINAL SETUP
// =======================================================
//app.use('/', router);

app.listen(port, function () {
	console.log('Your app is listening on port ' + port);
});

var get_id = function(username) {
	var query = client.query('select id from users where email = \'' +username +'\';');
	var id = 0;
	query.on('row', function(row) {
	  id = row.id;
	});
	query.on('error', function(err) {
	  console.log("fail to get id");
	  return -1;
	});
	query.on('end', function() {
	  console.log(id);
	  return id;
	});
}

var is_logged_in = function(session){
  if(session && session.loggedIn) {
    return true;
  }
  else {
    return false;
  }
}
