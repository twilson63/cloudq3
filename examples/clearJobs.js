var redis = require('redis');
var client = redis.createClient();
var _ = require('underscore');

client.keys('foo:*', function(err, list) {
  _(list).each(function(item) { client.del(item, redis.print); });
});
