var pg = require('pg').native
  , connectionString = process.env.DATABASE_URL
  , client
  , query;

client = new pg.Client(connectionString);
client.connect();
query = client.query('CREATE TABLE users ('
        +'id bigserial PRIMARY KEY, '
        +'first_name varchar(255) NOT NULL,'
        +'last_name varchar(255) NOT NULL,'
        +'login_details bigint NOT NULL)');
query = client.query('CREATE TABLE items ('
        +'id integer PRIMARY KEY, '
        +'name varchar(255) NOT NULL,'
        +'desc varchar(255) NOT NULL)');

query.on('end', function(result) { client.end(); });
