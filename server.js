// ~ cloudq3 ~
//
// A simple message queue server.
//
// cloudq3 uses redis for storage and has a very simple api
// 
// Add to Queue
// POST http://example.com/:queue
//
// Get oldest msg in the queue
// GET http://example.com/:queue
//
// Delete message
// DELETE http://example.com/:id
//
// Get Stats
// GET http://example.com/
//
//
// require block, pull in dependencies
var restify = require('restify');
var Thug = require('thug');
var redisThug = require('thug-redis');
var redis = require('redis');

// start of module, take config argument
module.exports = function(config) {
  // if no config create a config object
  if (!config) { config = { namespace: 'cloudq3'}; }
  // if no redis conn info, create empty obj
  if (!config.redis) { config.redis = {}; }
  // copy namespace to redis object for thug-redis
  config.redis.namespace = config.namespace;
  // create redis client
  //var client = redis.createClient(config.redis);
  var client = redis.createClient();
  // create redisThug object
  var db = redisThug(config.redis);

  // create Thug Model
  var Job = new Thug({
    filters: { 
      beforeWrite: [db.counter('id')]
    },
    methods: {
      // post job to redis and queue
      post: function(job, cb) {
        // save job in redis
        this.set('new', job, function(err, job) {
          if (err) { return cb(err); }
          // set job expiration...
          client.expire(config.namespace + ':' + job.id, config.expire);
          // add to the end of the queue
          client.rpush('queues:' + job.queue, job.id, function(err, result) {
            if (err) { return cb(err); }
            cb(null, job);
          });
        });
      },
      // grab oldest message in the queue
      grab: function(queue, cb) {
        var self = this;
        client.lpop('queues:' + queue, function(err, id) {
          if (err) { return cb(err); }
          if (!id) { return cb(null); }
          self.get(id, function(job) { cb(null, job); });
        });
      }
    }
  });

  Job.constructor.prototype.read = db.read;
  Job.constructor.prototype.write = db.write;
  Job.constructor.prototype.remove = db.remove;


  var server = restify.createServer({
    name: 'Cloudq3'
  });

  server.use(restify.authorizationParser());
  server.use(restify.bodyParser());
  server.use(function(req,res,next) {
    if (!config.auth) { return next(); }
    if (req.username === config.auth.username && 
      req.authorization.basic.password === config.auth.password) {
        return next();
      } else {
        res.send(401);
      }
  });

  server.listen(config.port, function() {
    console.log('~ Cloudq3 ~');
    console.log('Listening on %s', config.port);
  });

  server.get('/', function(req, res, next) {
    // get queues and counts, and provide back
    // in json or plaintext, based on the req.content-type
    res.send('~ Cloudq3 ~');
    return next();
  });

  // QUEUE Job
  server.post('/:queue', function(req, res, next) {
    Job.post(req.params, function(err, job) {
      if (err) { return res.send(500, err); }
      res.send(job);
      return next();
    });
  });

  // Grab Job
  server.get('/:queue', function(req, res, next) {
    Job.grab(req.params.queue, function(err, job) {
      if (err) { res.send(500, err); }
      res.send(job);
      return next();
    });
  });

  // DELETE Job
  server.del('/:id', function(req, res, next) {
    Job.del(req.params.id, function(job) {
      res.send(200);
      return next();
    });
  });
}
