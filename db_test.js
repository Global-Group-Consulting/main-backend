var mysql      = require('mysql2');
var connection = mysql.createConnection({
  host     : 'localhost',
  port     : '3407',
  user     : 'sail',
  password : 'password',
  database : 'global_queues'
});

connection.connect();

connection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
  if (error) throw error;
  console.log('The solution is: ', results[0].solution);
});

connection.end();
