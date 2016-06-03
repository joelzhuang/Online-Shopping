var express = require('express')
var app = express()
var port = (process.env.PORT || 8080)

var pg = require('pg').native;

var table_name = "todo3";

var connectionString = process.env.DATABASE_URL;//"postgres://mckayvick:dragons@depot:5432/mckayvick_nodejs";
var client = new pg.Client(connectionString);
client.connect();

var query = client.query('CREATE TABLE visits (date date)');
query.on('end', function(result) { client.end(); });
// end new

var bodyParser = require('body-parser')
app.use( bodyParser.json() ) // supports JSON-encoded bodies
app.use( bodyParser.urlencoded ( { // supports URL-encoded bodies
	extended: true
}));

// accessible at localhost:8080
app.get('/',function (req,res) {
	res.send('Hello World!');
	var date = new Data();
	client.query('INSERT INTO visits(data) VALUES($1)', [date]);
	query = client.query('SELECT COUNT(date) AS count FROM visits WHERE date = $1',[date]);
	
	query.on('row', function(result) { 
    console.log(result); 
 
    if (!result) { 
      return res.send('No data found'); 
    } else { 
      res.send('Visits today: ' + result.count); 
    } 
  });
});

app.listen(port, function() { 
  console.log('Listening on:', port); 
}); 


// getting around the ole cross-site scripting issue
app.use(function(req,res,next) {
  // site
  res.setHeader('Access-Control-Allow-Origin','*') // this seems unsafe somehow
  res.setHeader('Access-Control-Allow-Methods','GET,POST,OPTIONS,PUT,PATCH,DELETE');
  
  next();
});

/** ==========================================================
 *                         GET LISTS
 *  ==========================================================
 */

/** GET ALL TASKS */
app.get('/tasks',function (req,res) {
  console.log("Received GET ALL THE THINGS database request.");
  var query = client.query('SELECT * FROM '+table_name+';');
  var results = [];
  query.on('row',function(row) {
    console.log(row);
    results.push(row);
  });
  query.on('end',function() {
    res.json(results);
  });
});

// REMEMBER: For example, for JSON data, the Content-type header should be application/json.

/** GET COMPLETED TASKS */
app.get('/complete-tasks',function (req,res) {
  console.log("Sending list of completed tasks.");
  var query = client.query('SELECT * FROM '+table_name+' WHERE STATUS IS true;');
  var results = [];
  console.log("complete tasks request");
  query.on('row',function(row) {
    results.push(row);
  });
  
  query.on('end', function() {
    res.json(results);
  });
});

/* GET INCOMPLETE TASKS */
app.get('/incomplete-tasks',function (req,res) {
  console.log("Sending list of incomplete tasks.");
  var query = client.query('SELECT * FROM '+table_name+' WHERE STATUS IS false;');
  var results = [];
  // stream results back 1 row at a time
  query.on('row',function(row) {
    results.push(row)
  });
  // and after all that, close connection + retunr results
  query.on('end',function() {
    console.log(results);
    res.json(results)
  });
});

/** ==========================================================
 *                         TASK REQUESTS
 *  ==========================================================
 */

/* CREATE TASK WITH TEXT */
app.post('/create',function (req,res) {
  if (req.body == undefined || req.body.text == undefined) {
    res.status(400).send('Bad Request');
    return;
  }
  console.log("ADD REQUEST");
  
	var query = client.query('INSERT INTO '+table_name+' values(default,\''+req.body.text +'\',false);');
	var query2 = client.query('SELECT MAX(id) FROM '+table_name, function(err,result) {
  	res.json({id:result.rows[0].max});
	});
});

app.get("/delete", function (req,res) {
  res.status(400).send('Bad Request');
});

/** DELETE TASK BY ID */
app.post("/delete",function (req,res) {
  if (req.body == undefined || req.body.id == undefined) {
    res.status(400).send('Bad Request');
    return;
  }
  console.log("DELETE REQUEST");
  
	var query = client.query('DELETE FROM '+table_name+' WHERE ID = '+req.body.id+';');
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
  
	var query = client.query('UPDATE '+table_name+' SET STATUS = true WHERE ID = '+req.body.id+';');
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
  
	var query = client.query('UPDATE '+table_name+' SET STATUS = false WHERE ID = '+req.body.id+';');
	query.on('end',function() {
  	res.json(query);
	});
});

// HI THERE
app.get('/test_database',function(req,res) {
  // SQL query, select data
  console.log("Received database request.");
  var query = client.query('SELECT * FROM '+table_name);
  var results = [];
  console.log("Received query results.");
  // stream results back 1 row at a time
  query.on('row',function(row) {
    results.push(row)
    console.log("Sending "+row);
  });
  // and after all that, close connection + retunr results
  query.on('end',function() {
    console.log("Closing connection to database.");
    res.json(results)
  });
});


app.listen(port,function() {
	console.log('Tod-list is listening on port 8080!')
});
