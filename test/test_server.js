var restify = require('restify');
var should = require('should');

before(function(done) {
  process.env.NODE_ENV = 'test';
  require('../server.js');
  done();
});

var client = restify.createJsonClient({
  version: '*',
  url: 'http://localhost:8080'
});

function GET_FORBIDDEN(path, done) {
  client.get(path, function(err, req, res, data) {
    should.exist(err);
    res.statusCode.should.eql(403);
    data.error.code.should.eql('FORBIDDEN');
    done();
  });
}

describe('key correctness:', function() {
  it('should send a 200 OK response for correct keys', function(done) {
    client.get('/hook/project_one?key=p1_key', function(err, req, res, data) {
      should.not.exist(err);
      res.statusCode.should.eql(200);
      data.success.should.eql('hello, this is project_one');
      done();
    });
  });
  it('should send a 403 Forbidden response for incorrect keys', function(done) {
    GET_FORBIDDEN('/hook/project_one?key=BAD_KEY', done);
  });
  it('should send a 403 Forbidden response for missing keys', function(done) {
    GET_FORBIDDEN('/hook/project_one', done);
  });
});

describe('bad routes:', function() {
  it('should send a 403 Forbidden response for nonexistent routes', function(done) {
    GET_FORBIDDEN('/DOES_NOT_EXIST', done);
  });
  it('should send a 403 Forbidden response for nonexistent routes with a key', function(done) {
    GET_FORBIDDEN('/', done);
  });
  it('should send a 403 Forbidden response for the root route', function(done) {
    GET_FORBIDDEN('/', done);
  });
  it('should send a 403 Forbidden response for the root route with a key', function(done) {
    GET_FORBIDDEN('/', done);
  });
});
