var request = require('request');
var Faker = require('faker');
var b = require('b');

//var url = 'http://localhost:3000/foo';
var url = 'http://ec2-50-18-142-36.us-west-1.compute.amazonaws.com/foobar';

var generatePost = function() {
  var msg = { job: { klass: Faker.Lorem.words(1)[0], args: (function() {
    var args = Faker.Helpers.randomNumber(50);
    var result = [];
    for(var i = 0; i < args; i++) {
      result.push(Faker.Lorem.words(1)[0]);
    };
    return result;
    })() 
  }};
  return msg;
}

b('Cloudq Post Test')
  .reporter('cli')
  .run(1000, function(i, done) {
    request.post(url, { json: generatePost(), auth: {user: 'gmms', pass: 'worker'}}, 
      function(e,r,b) {
        //console.log(r.statusCode);
        done(); //console.log(b);
     }
    );
  });

