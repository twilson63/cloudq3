var restify = require('restify');
var Thug = require('thug');
var redisThug = require('thug-redis');
var redis = require('redis');
var client = redis.createClient();
//var config = require('./config');
module.exports = function(config) {
  if (!config.redis) { config.redis = {}; }
  config.redis.namespace = config.namespace;
  var db = redisThug(config.redis);

  var Job = new Thug({
    filters: { 
      beforeWrite: [db.counter('id')]
    },
    methods: {
      post: function(job, cb) {
        this.set('new', job, function(err, job) {
          if (err) { return res.send(500, err); }
          // set job expiration...
          client.expire(config.namespace + ':' + job.id, config.expire);
          client.rpush('queues:' + job.queue, job.id, function(err, result) {
            if (err) { return cb(err); }
            cb(null, job);
          });
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
    res.send('Welcome to Cloudq 3.0');
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

  // GET Job
  server.get('/:queue', function(req, res, next) {
    client.lpop('queues:' + req.params.queue, function(err, id) {
      if (!id) { return res.send(200); }
      Job.get(id, function(job) {
        res.send(job);
        return next();
      });
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
