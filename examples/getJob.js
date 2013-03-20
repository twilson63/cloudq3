var request = require('request');
var Faker = require('faker');
var b = require('b');
//'http://localhost:3000/foo'
var url = 'http://ec2-50-18-142-36.us-west-1.compute.amazonaws.com/foobar';

b('Cloudq Get Test')
  .reporter('cli')
  .run(1000, function(i, done) {
    request(url, { json: true, auth: {user: 'gmms', pass: 'worker'}}, 
      function(e,r,b) {
        done(); //console.log(b);
     }
    );
  });

