'use strict';

var grunt = require('grunt');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

var task = require('../tasks/preprocess');

var read = grunt.file.read;

exports['preprocess'] = {
  setUp: function(done) {
    // setup here
    done();
  },
  'preprocess html': function(test) {
    test.expect(1);
    var expected, actual;

    expected = 'test/expected/test.processed.expected.html';
    actual = 'tmp/test.processed.html';
    test.equal(read(expected), read(actual), actual + ' differs');

    test.done();

  },
  'preprocess js': function(test) {
    test.expect(1);
    var expected, actual;

    expected = 'test/expected/test.processed.expected.js';
    actual = 'tmp/test.processed.js';
    test.equal(read(expected), read(actual), actual + ' differs');

    test.done();

  },
  'preprocess coffee': function(test) {
    test.expect(1);
    var expected, actual;

    expected = 'test/expected/test.processed.expected.coffee';
    actual = 'tmp/test.processed.coffee';
    test.equal(read(expected), read(actual), actual + ' differs');

    test.done();
    
  },
  'inline': function(test) {
    test.expect(2);
    var expected, actual;

    expected = 'tmp/test-inline-expected.js';
    actual = 'tmp/inline-temp/test.js';
    test.equal(read(expected), read(actual), actual + ' differs');

    expected = 'tmp/test2-inline-expected.js';
    actual = 'tmp/inline-temp/test2.js';
    test.equal(read(expected), read(actual), actual + ' differs');

    test.done();

  }
};
