var express = require('express')
  , pg = require('pg').native
  , connectionString = process.env.DATABASE_URL
  , start = new Date()
  , port = process.env.PORT
  , client;

var app=express();

client = new pg.Client(connectionString);
client.connect();

app.get('/', function(req, res) {
  // client.query('INSERT INTO visits(date) VALUES($1)', [date]);

  query = client.query('SELECT * FROM items');
  query.on('row', function(result) {
    console.log(result);

    if (!result) {
      return res.send('No data found');
    } else {
      res.send('Visits today: ' + result);
    }
  });
});

app.listen(port, function() {
  console.log('Listening on:', port);
});
