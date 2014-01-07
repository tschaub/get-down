var fs = require('fs');
var path = require('path');

var mockFs = require('mock-fs');
var mockHttp = require('nock');

var assert = require('../helper').assert;
var download = require('../../lib/index');

var fixtures = path.join(__dirname, '..', 'fixtures');

function readFixture(name) {
  return fs.readFileSync(path.join(fixtures, name));
}

describe('download()', function() {

  var restore;
  beforeEach(function() {
    var files = {};
    fs.readdirSync(fixtures).forEach(function(name) {
      files[name] = readFixture(name);
    });

    // mock fs
    restore = mockFs({
      dest: {},
      fixtures: files
    });
  });
  afterEach(function() {
    restore();
  });

  it('downloads a file', function(done) {
    // mock http
    var scope = mockHttp('http://example.com')
        .get('/success.zip')
        .replyWithFile(200, 'fixtures/success.zip');

    download('http://example.com/success.zip')
        .on('error', done)
        .on('end', function(dest) {
          assert.equal(path.resolve(dest), path.resolve('success.zip'));
          done();
        });
  });

  it('accepts an alternate dest directory', function(done) {
    var scope = mockHttp('http://example.com')
        .get('/success.zip')
        .replyWithFile(200, 'fixtures/success.zip');

    var options = {dest: 'dest'};
    download('http://example.com/success.zip', options)
        .on('error', done)
        .on('end', function(dest) {
          assert.equal(path.resolve(dest), path.resolve('dest/success.zip'));
          done();
        });
  });

  it('accepts an alternate dest file', function(done) {
    var scope = mockHttp('http://example.com')
        .get('/success.zip')
        .replyWithFile(200, 'fixtures/success.zip');

    var options = {dest: 'dest/alt.zip'};
    download('http://example.com/success.zip', options)
        .on('error', done)
        .on('end', function(dest) {
          assert.equal(path.resolve(dest), path.resolve('dest/alt.zip'));
          done();
        });
  });

  it('downloads and extracts a zip file', function(done) {
    var scope = mockHttp('http://example.com')
        .get('/success.zip')
        .replyWithFile(200, 'fixtures/success.zip');

    // success.zip contains a single success.txt file containing 'success\n'
    var options = {dest: 'dest', extract: true};
    download('http://example.com/success.zip', options)
        .on('error', done)
        .on('end', function(dest) {
          assert.equal(path.resolve(dest), path.resolve('dest'));
          assert.isTrue(fs.existsSync('dest/success.txt'));
          assert.equal(
              fs.readFileSync('dest/success.txt').toString(), 'success\n');
          done();
        });
  });

  it('extracts a zip file based on content-type', function(done) {
    var scope = mockHttp('http://example.com')
        .get('/zipfiles/success')
        .replyWithFile(
            200, 'fixtures/success.zip', {'content-type': 'application/zip'});

    // success.zip contains a single success.txt file containing 'success\n'
    var options = {dest: 'dest', extract: true};
    download('http://example.com/zipfiles/success', options)
        .on('error', done)
        .on('end', function(dest) {
          assert.equal(path.resolve(dest), path.resolve('dest'));
          assert.isTrue(fs.existsSync('dest/success.txt'));
          assert.equal(
              fs.readFileSync('dest/success.txt').toString(), 'success\n');
          done();
        });
  });

});
