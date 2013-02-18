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

exports['preprocess'] = {
  setUp: function(done) {
    // setup here
    done();
  },
  'preprocess html': function(test) {
    test.expect(1);
    var expected, actual;

    expected = grunt.file.read('test/expected/test.processed.expected.html');
    actual = grunt.file.read('tmp/test.processed.html');
    test.equal(expected, actual, 'Files differ');

    test.done();

  },
  'preprocess js': function(test) {
    test.expect(1);
    var expected, actual;

    expected = grunt.file.read('test/expected/test.processed.expected.js');
    actual = grunt.file.read('tmp/test.processed.js');
    test.equal(expected, actual, 'Files differ');

    test.done();

  },
  'inline': function(test) {
    test.expect(2);
    var expected, actual;

    expected = grunt.file.read('tmp/test-inline-expected.js');
    actual = grunt.file.read('tmp/inline-temp/test.js');
    test.equal(expected, actual, 'Files differ');
    expected = grunt.file.read('tmp/test2-inline-expected.js');
    actual = grunt.file.read('tmp/inline-temp/test2.js');
    test.equal(expected, actual, 'Files differ');

    test.done();

  }
};
