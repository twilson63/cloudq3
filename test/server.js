var expect = require('expect.js');
var request = require('request');
var server = require('../server')({
  namespace: 'cloudq',
  expire: (60 * 60) * 72,
  auth: {
    username: 'admin',
    password: 'admin'
  },
  port: 3000
});

var redis = require('redis');
var client = redis.createClient();

var req = request.defaults({json: true, auth: {user: 'admin', pass: 'admin'}});

describe('Cloudq API', function() {
  describe('Add to Queue', function() {
    var jobId;
    before(function(done) {
      client.del('queues:foo', done);
    });
    it('should add to foo queue sucessfully', function(done) {
      req.post('http://localhost:3000/foo',{ 
        json: { 
        job: { klass: 'FooClass', args: ['Baz', 'Bar'] } }},
        function(e,r,job) {
          expect(r.statusCode).to.be(200);
          expect(job.id).to.be.ok();
          jobId = job.id;
          done();
        }
      );
    });
    after(function(done) {
      req.del('http://localhost:3000/' + jobId, 
        function(e,r,b) {
          expect(r.statusCode).to.be(200);
          done();
        });
    });
  });
  describe('Get Job from queue', function() {
    var jobId;
    before(function(done) {
      client.del('queues:foo', done);
    });
    before(function(done) {
      req.post('http://localhost:3000/foo',{ json: { 
        job: { klass: 'FooClass', args: ['Baz', 'Bar'] } }},
        function(e,r,job) {
          expect(r.statusCode).to.be(200);
          expect(job.id).to.be.ok();
          jobId = job.id;
          done();
        }
      );
    });
    it('should be successful', function(done) {
      req('http://localhost:3000/foo',{ json: { 
        job: { klass: 'FooClass', args: ['Baz', 'Bar'] } }},
        function(e,r,job) {
          expect(r.statusCode).to.be(200);
          expect(job.id).to.be(jobId);
          done();
      });
    });
    after(function(done) {
      req.del('http://localhost:3000/' + jobId, { json: true},
        function(e,r,b) {
          expect(r.statusCode).to.be(200);
          done();
        });
    });
  });
});