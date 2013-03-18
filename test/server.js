var expect = require('expect.js');
var request = require('request');
var server = require('../server');
var redis = require('redis');
var client = redis.createClient();

describe('Cloudq API', function() {
  describe('Add to Queue', function() {
    var jobId;
    before(function(done) {
      client.del('queues:foo', done);
    });
    it('should add to foo queue sucessfully', function(done) {
      request.post('http://localhost:3000/foo',{ json: { 
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
      request.del('http://localhost:3000/' + jobId, { json: true},
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
      request.post('http://localhost:3000/foo',{ json: { 
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
      request('http://localhost:3000/foo',{ json: { 
        job: { klass: 'FooClass', args: ['Baz', 'Bar'] } }},
        function(e,r,job) {
          expect(r.statusCode).to.be(200);
          expect(job.id).to.be(jobId);
          done();
      });
    });
    after(function(done) {
      request.del('http://localhost:3000/' + jobId, { json: true},
        function(e,r,b) {
          expect(r.statusCode).to.be(200);
          done();
        });
    });
  });
});