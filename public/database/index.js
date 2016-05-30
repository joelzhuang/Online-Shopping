var express = require('express')
var app = express()
var port = (process.env.PORT || 8080)
var n = require('nonce')();
var nonce = n();

var pg = require('pg').native, connectionString = process.env.DATABASE_URL, client, query;
pg.defaults.ssl = true;
pg.connect(process.env.DATABASE_URL, function(err, client) {
  if (err) throw err;
  console.log('Connected to postgres! Getting schemas...');

  client
    .query('SELECT table_schema,table_name FROM information_schema.tables;')
    .on('row', function(row) {
      console.log(JSON.stringify(row));
    });
});

var cart_table_name = "client"+nonce;

var connectionString = "postgres://mckayvick:dragons@depot:5432/mckayvick_nodejs";
var client = new pg.Client(connectionString);
client.connect();t

var bodyParser = require('body-parser')
app.use( bodyParser.json() ) // supports JSON-encoded bodies
app.use( bodyParser.urlencoded ( { // supports URL-encoded bodies
	extended: true
}));

// accessible at localhost:8080
app.get('/',function (req,res) {
	res.send('Hello World!');
});

// getting around the ole cross-site scripting issue
app.use(function(req,res,next) {
  res.setHeader('Access-Control-Allow-Origin','*') // this seems unsafe somehow
  res.setHeader('Access-Control-Allow-Methods','GET,POST,OPTIONS,PUT,PATCH,DELETE');
  next();
});

/*

  clients
| id |  name  | stuff-to-check-if-logged-in |
+----+--------+-----------------------------+

  cart
|  client_id | item_id | quantity  |
+------------+---------+-----------+

*/

/** ==========================================================
 *                         CART REQUESTS
 *  ==========================================================
 */

/* CREATE TASK WITH TEXT */
app.post('/add',function (req,res) {
  if (req.body == undefined || req.body.text == undefined) {
    res.status(400).send('Bad Request');
    return;
  }
  console.log("ADD REQUEST");
  
	var query = client.query('INSERT INTO '+cart_table_name+' values(default,\''+req.body.text +'\',false);');
	var query2 = client.query('SELECT MAX(id) FROM '+cart_table_name, function(err,result) {
  	res.json({id:result.rows[0].max});
	});
});

/** DELETE TASK BY ID */
app.post("/remove",function (req,res) {
  if (req.body == undefined || req.body.id == undefined) {
    res.status(400).send('Bad Request');
    return;
  }
  console.log("DELETE REQUEST");
  
	var query = client.query('DELETE FROM '+cart_table_name+' WHERE ID = '+req.body.id+';');
	// TODO error
	query.on('end',function() {
    res.status(204);
  	res.json(query);
	});
});

/** UPDATING TASK STATUS */
app.put('/complete',function (req,res) {
  if (req.body == undefined || req.body.id == undefined) {
    res.status(400).send('Bad Request');
    return;
  }
  console.log("UPDATE REQUEST.");
  
	var query = client.query('UPDATE '+cart_table_name+' SET STATUS = true WHERE ID = '+req.body.id+';');
	query.on('end',function() {
  	res.json(query);
	});
});

/** UPDATING TASK STATUS */
app.put('/decomplete',function (req,res) {
  if (req.body == undefined || req.body.id == undefined) {
    res.status(400).send('Bad Request');
    return;
  }
  console.log("UPDATE REQUEST.");
  
	var query = client.query('UPDATE '+cart_table_name+' SET STATUS = false WHERE ID = '+req.body.id+';');
	query.on('end',function() {
  	res.json(query);
	});
});

app.listen(port,function() {
	console.log('Listening on port 8080!')
});
