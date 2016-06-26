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

var options = {
    maxAge: 3600000,
    headers: {
        'x-timestamp': Date.now(),
        'x-sent': true
    }
  };


// JSON STUFF
// =======================================================
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: true}));
app.use(cors());
app.use(express.static(__dirname + '/public'));
app.use(cookieParser());

app.use(function(req,res,next) {
  res.setHeader('Access-Control-Allow-Origin','*') // this seems unsafe somehow
  res.setHeader('Access-Control-Allow-Methods','GET,POST,OPTIONS,PUT,PATCH,DELETE');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header('Cache-Control', 'public');
  res.header('Expires', 3600000);
  next();
});

/** Refresh the cookie's expiration time, if the user is logged in.*/
app.all(function (req,res,next) {
	if (is_logged_in(req.session)) {
		console.log("user "+ req.session.email +" is logged in, resetting cookie");
		/* var query = url.parse(req.url, true, true).query;*/
		res.header('Set-Cookie', cookie.serialize('email', String(query.email), {
			httpOnly: true,
			maxAge: 3600000 // 1 week 
		})); 
    } else {
      console.log("user is NOT logged in");
    }

    res.header('Expires', 3600000)
});

app.get('/get1/', function(req,res){
    res.header('Cache-Control', 'public');
    res.header('Expires', 3600000);
    res.send(200);
})


// PAGE ROUTING
// =======================================================

app.get('/$', function(req,res) {
  res.header('Expires', 3600000);
  res.sendFile(__dirname +'/index.html', options);
});
app.get('/home', function(req,res) {
  res.header('Expires', 3600000);
  res.sendFile(__dirname +'/index.html', options);
});
app.get('/cart$', function(req,res) {
  res.header('Expires', 3600000);
  res.sendFile(__dirname +'/cart.html', options);
});
app.get('/contact$', function(req,res) {
  res.status(404).send('Contacts page not yet implemented!');
});
app.get('/orders$', function(req,res) {
  res.status(404).send('Orders page not yet implemented!');
});
app.get('/register$', function(req,res) {
  res.header('Expires', 3600000);
  res.sendFile(__dirname +'/register.html', options);
});
app.get('/login$', function(req,res) {
  res.header('Expires', 3600000);
  res.sendFile(__dirname +'/login.html', options);
});


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
        eq.session.loginid = data.id;
				res.send(JSON.stringify({outcome : 'correct'}));
				found = true;
			}

		});

		if(!found){
			res.send(JSON.stringify({outcome : 'incorrect'}));
		}

		console.log(req.session)
	
	});
});

app.post('/login/', function(req,res,next){
  console.log("LOGGING IN");
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
        req.session.loginid = data.id;
        console.log("ID:   " +  data.id)
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
});

app.post('/register/', function(req,res,next) {
	var r_data = req.body.register_data;
	// client.query("INSERT into users (title,gender,first_name,last_name,email,password,phone,address,city,country,birth_day,birth_month,birth_year) VALUES ('" + r_data.title  + "','" + r_data.gender  + "','" + r_data.fname  + "','" + r_data.lname  + "','" + r_data.email  + "','" + r_data.password  + "','" + r_data.phone  + "','" + r_data.address  + "','" + r_data.city  + "','" + r_data.country  + "'," + r_data.day  + "," + r_data.month  + "," + r_data.year + ");");
	res.send("done");
});

// SHOPPING
// =======================================================
var item_table = "items";
var user_table = "users";
var cart_table = "cart";
var size_table = "sizes";
var cat_table = "categories";
var subcat_table = "subcategories";
var orders_table = "orders";



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
      res.status(500).send("Please try again in a moment.");
    }
  });
  query.on('end',function() {
    res.header('Expires', 3600000);
    res.json(results);
  });
});



/** Load all the items in a user's cart */
app.get('/cart/all/$', function (req, res) {
  
  var id = req.session.loginid
  console.log("Sending the cart of "+req.session.email +":id="+id+"="+req.session.user_id);
    
  var query = client.query("SELECT "+item_table+".name, "+cart_table+".size, "+cart_table+".quantity"
    +" FROM "+ cart_table+", "+item_table
    +" WHERE "+cart_table+".uid = "+id+" and "+item_table+".iid = "+cart_table+".iid;");
  var results = [];
  query.on('row',function(row) {
    results.push(row);
  });
  query.on('error', function(err) {
    if(err) {
      console.log("ERROR: error running query", err);
      res.status(500).send("Bad request: you do not have access to this cart.");
    }
  });
  query.on('end',function() {
      res.header('Expires', 3600000);
      res.json(results);
  });
});



/* Remove an item from the cart 
  TODO: make sure the request is actually coming from the right user
  TODO: make the quantities update correctly
*/
app.post('/cart/delete/:iid/:size$', function (req, res) {
	
  var id = req.session.loginid
  console.log("Deleting "+req.params.iid+" from the cart of "+req.session.email +":id="+id+"="+req.session.user_id);
  
  var query = client.query("DELETE FROM "+ cart_table +" only"
    +" WHERE uid = "+id+" and iid = "+req.params.iid
    +" and size = \'"+req.params.size+"\';");
  var deleted = false;
  query.on('rows', function(err) {
    deleted = true;
  });
  query.on('error', function(err) {
    if(err) {
      console.log("Encountered an error while querying the database: "+ err);
      res.status(500).send("Sorry, you cannot delete items from this cart.");
    }
  });
  query.on('end',function(result) {
      if (deleted) {
        res.status(200).send("Item successfully removed from cart.");
      } else {
        res.status(404).send("Item could not be removed from the cart.");
      }
  });
});


/* CHECK OUT ITEMS. */
app.post('/cart/checkout/', function (req, res) {
  
  var id = req.session.loginid
  console.log(req.session.email +": "+id);
  
      //         [                       date                               ]  [uid][ itemid ] [quantity]                 [orderid]
  var query = client.query("INSERT INTO "+order_table+" (placed,uid,iid,quantity,oid)"
      +" SELECT '"+date.getFullYear()+"-"+date.getMonth()+"-"+date.getDay()+"', uid,    iid,    "+cart_table+".quantity ,   oid"
      +" FROM items, cart"
      +" WHERE uid = "+cart_table+".uid and uid = "+id
      +" and iid = "+cart_table+".iid"
      +" and oid = (select max(oid) from tbl)+1 ;");
  query.on('error', function(err) {
    if(err) {
      console.log("Encountered an error while querying the database: "+ err);
      res.status(500).send("The database encountered an error while processing your request.");
      wasSent = true;
    }
  });
  query.on('end',function(result) {
    var removeNext = client.query("DELETE FROM "+cart_table+" where uid="+id+";");
    removeNext.on('error', function(err) {
      console.log("Something has gone seriously wrong and the cart contains items it should not for (uid="+id+")");
      res.status(500).send("The database encountered an awful, awful error while processing your request."); // this is not an error you would ever really use in production
    });
    var success = false;
    removeNext.on('row', function(row) {
      success=true;
    });
    removeNext.on('end', function() {   
      if (true) {
        res.status(200).send("Thank-you for your purchase! (If this were a real site, you'd get a tracking number or an email or something.)");
      } else {
        res.status(200).send("There are no items in your cart to check out.");
      }
    });
  });
});

/* Add a new item to the cart. */
app.post('/cart/:iid/:size$', function (req, res) {

  var id = req.session.loginid
  console.log(req.session.email +": "+id);
  
  var query = client.query("INSERT INTO "+cart_table+" (uid,iid,size,quantity,price)"
      +" SELECT "+id+", "+req.params.iid+", '"+req.params.size+"', 1, price"
      +" FROM items"
      +" WHERE iid="+req.params.iid);
  query.on('error', function(err) {
    if(err) {
      console.log("Encountered an error while querying the database: "+ err);
      console.log(Object.getOwnPropertyNames(err));
      res.status(500).send("Database error: "+err);
    }
  });
  query.on('end',function(result) {
    res.status(200).send("Item successfully added to cart.");
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
      res.header('Expires', 3600000);
      res.json(results);
      console.log(results);
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
      res.header('Expires', 3600000);
      res.json(results);
    }
  });
});


// FINAL SETUP
// =======================================================
//app.use('/', router);

app.listen(port, function () {
	console.log('Your app is listening on port ' + port);
});

function get_id(username) {
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
	  console.log(id+'here');
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
