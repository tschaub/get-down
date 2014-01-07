var EventEmitter = require('events').EventEmitter;
var parse = require('url').parse;
var path = require('path');

var Q = require('q');
var tmp = require('tmp');

var download = require('./lib/bower-util/download');
var extract = require('./lib/bower-util/extract');
var misc = require('./lib/misc');

tmp.setGracefulCleanup();


/**
 * Download a file.
 * @param {string} url URL of resource to download.
 * @param {Object} options Download options.
 * @return {EventEmitter} Event emitter.
 */
module.exports = function(url, options) {
  options = options || {};

  var dest = options.dest || process.cwd();
  delete options.dest;

  var extractArchive = !!options.extract;
  delete options.extract;

  var emitter = new EventEmitter();
  function emitError(err) {
    emitter.emit('error', err);
  }

  var promise;
  if (extract) {
    // must be an existing directory
    promise = misc.existingDirectory(dest);
  } else {
    // resolve to a file path
    promise = misc.resolveFilePath(dest, path.basename(parse(url).pathname));
  }

  promise
      .then(function(destPath) {
        // create temp file
        return Q.nfcall(tmp.file).then(function(tmpFile) {
          // download resource to temp location
          return download(url, tmpFile, options)
              .then(function(response) {
                if (extractArchive) {
                  var contentType = response.headers['content-type'];
                  return extract(tmpFile, destPath, {mimeType: contentType});
                } else {
                  return misc.copy(tmpFile, destPath);
                }
              });
        });
      })
      .progress(function(state) {
        emitter.emit('progress', state);
      })
      .then(function(dest) {
        emitter.emit('end', dest);
      })
      .fail(function(err) {
        emitter.emit('error', err);
      });

  return emitter;

};
