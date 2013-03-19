var request = require('request');
var Faker = require('faker');
var b = require('b');

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
    request.post('http://localhost:3000/foo', { json: generatePost(), auth: {user: 'admin', pass: 'admin'}}, 
      function(e,r,b) {
        done(); //console.log(b);
     }
    );
  });

