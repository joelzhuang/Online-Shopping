
  // this code doesn't yet have any means of validating that the user
  // is logged in. we'll have to do that in a bit!
  
  // currently the code is set up to be deployed on heroku,
  // but the commented-out sections can be swapped to test locally
  
var express = require('express'); 
//var bodyParser = require('body-­parser');
var port = process.env.PORT || 8080; 
var pg = require('pg').native;
var testRun = true;
//var cors = require('cors');
 
var app = express(); 
//app.use( bodyParser.json() ); // to support JSON­encoded bodies 
//app.use( bodyParser.urlencoded( { extended: true  } ) );
//app.use( cors() );

var item_table = "items";
var user_table = "users";
var cart_table = "cart";
//var connectionString = "postgres://mckayvick:dragons@depot:5432/mckayvick_nodejs";
var client = new pg.Client(connectionString);
client.connect(); 

// getting around the ole cross-site scripting issue
app.use(function(req,res,next) {
  res.setHeader('Access-Control-Allow-Origin','*') // this seems unsafe somehow
  res.setHeader('Access-Control-Allow-Methods','GET,POST,OPTIONS,PUT,PATCH,DELETE');
  // from the cors website:
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.listen(port, function () { 
  console.log('Example app listening on:',port); 
}); 

app.get('/', function (req, res) { 
  res.json("Hello? Yes, this is your server speaking--how may I be of service?");
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
  });*/
});
 



