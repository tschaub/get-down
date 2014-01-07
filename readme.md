# `get-down`

**Download and optionally extract files.**

This draws heavily from [Bower's](http://bower.io/) download and extract utilities.  Those utilities are [copyright Twitter](https://github.com/bower/bower/blob/master/LICENSE) and carry the MIT license.

## Example use

Download a file and save it to the working directory with the same name:
```js
var download = require('get-down');
download('http://example.com/file.txt');
```

Same as above, but saving to a different directory:
```js
var download = require('get-down');
download('http://example.com/file.txt', {dest: 'different/directory'});
// the provided directory must already exist
```

In addition to providing a `dest` directory, you can provide a new file name:
```js
var download = require('get-down');
download('http://example.com/file.txt', {dest: 'different/name.txt'});
// the provided file must not already exist
```

The `extract` option can be used to extract `tar`, `tgz`, `gz`, or `zip` files:
```js
var download = require('get-down');
download('http://example.com/file.zip', {dest: 'some/directory', extract: true});
// the dest directory must already exist
```

As you might expect, `download` is all async.  You get an event emitter in return:
```js
var download = require('get-down');
download('http://example.com/file.txt').on('end', function(dest) {
  console.log('downloaded', dest);
});
```

## API Docs

### `download(url[, options])`

Available options:

 * **dest** - `string` The destination for saving downloaded resources.
 * **extract** - `boolean` Extract the downloaded archive.

The `download` method returns an [event emitter](http://nodejs.org/api/events.html#events_class_events_eventemitter) with the following events:

 * **progress** - Emitted periodically during the download.
 * **error** - Emitted on any error.
 * **end** - Emitted when the download is complete.

[![Current Status](https://secure.travis-ci.org/tschaub/get-down.png?branch=master)](https://travis-ci.org/tschaub/get-down)
