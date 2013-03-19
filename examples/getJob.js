var request = require('request');
var Faker = require('faker');
var b = require('b');

b('Cloudq Get Test')
  .reporter('cli')
  .run(10000, function(i, done) {
    request('http://localhost:3000/foo', { json: true, auth: {user: 'admin', pass: 'admin'}}, 
      function(e,r,b) {
        done(); //console.log(b);
     }
    );
  });

