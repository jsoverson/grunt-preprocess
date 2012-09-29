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
    test.expect(4);

    // tests here

    var input,expected,settings;

    input = "a\n" +
      "<!-- exclude env=='production' -->\n" +
      "b\n" +
      "<!-- endexclude -->\n" +
      "c";
    expected = "a\n\nc";
    test.equal(task.preprocess(input, { env: 'production'}), expected, 'Should exclude if match');


    input = "a\n" +
      "<!-- exclude env=='production' -->\n" +
      "b\n" +
      "<!-- endexclude -->\n" +
      "c";
    expected = "a\n\nb\n\nc";
    test.equal(task.preprocess(input, { env: 'dev'}), expected, 'Should not exclude if not match');

    input = "a\n" +
      "<!-- include env=='production' -->\n" +
      "b\n" +
      "<!-- endinclude -->\n" +
      "c";
    expected = "a\n\nb\n\nc";
    test.equal(task.preprocess(input, { env: 'production'}), expected, 'Should include if match');


    input = "a\n" +
      "<!-- include env=='production' -->\n" +
      "b\n" +
      "<!-- endinclude -->\n" +
      "c";
    expected = "a\n\nc";
    test.equal(task.preprocess(input, { env: 'dev'}), expected, 'Should not include if not match');

    test.done();
  },
  'preprocess javascript': function(test) {
    test.expect(4);

    // tests here

    var input,expected,settings;

    input = "a\n" +
      "// exclude env=='production'\n" +
      "b\n" +
      "// endexclude  \n" +
      "c";
    expected = "a\n\nc";
    test.equal(task.preprocess(input, { env: 'production'}, 'js'), expected, 'Should exclude if match');


    input = "a\n" +
      "// exclude env=='production' \n" +
      "b\n" +
      "// endexclude \n" +
      "c";
    expected = "a\n\nb\n\nc";
    test.equal(task.preprocess(input, { env: 'dev'}, 'js'), expected, 'Should not exclude if not match');

    input = "a\n" +
      "// include env=='production'\n" +
      "b\n" +
      "// endinclude\n" +
      "c";
    expected = "a\n\nb\n\nc";
    test.equal(task.preprocess(input, { env: 'production'}, 'js'), expected, 'Should include if match');


    input = "a\n" +
      "// include env=='production'\n" +
      "b\n" +
      "// endinclude\n" +
      "c";
    expected = "a\n\nc";
    test.equal(task.preprocess(input, { env: 'dev'}, 'js'), expected, 'Should not include if not match');

    test.done();
  },
  'preprocess html same line': function(test) {
    test.expect(4);

    // tests here

    var input,expected,settings;

    input = "a<!-- exclude env=='production' -->b<!-- endexclude -->c";
    expected = "ac";
    test.equal(task.preprocess(input, { env: 'production'}), expected, 'Should exclude if match');


    input = "a<!-- exclude env=='production' -->b<!-- endexclude -->c";
    expected = "abc";
    test.equal(task.preprocess(input, { env: 'dev'}), expected, 'Should not exclude if not match');

    input = "a<!-- include env=='production' -->b<!-- endinclude -->c";
    expected = "abc";
    test.equal(task.preprocess(input, { env: 'production'}), expected, 'Should include if match');


    input = "a<!-- include env=='production' -->b<!-- endinclude -->c";
    expected = "ac";
    test.equal(task.preprocess(input, { env: 'dev'}), expected, 'Should not include if not match');

    test.done();
  },
  'force at least double equals': function(test) {
    test.expect(1);

    var input,expected,settings;

    input = "a<!-- include env='production' -->b<!-- endinclude -->c";
    expected = "ac";
    test.equal(task.preprocess(input, { env: 'dev'}), expected, 'Fail case, should not be included');

    test.done();
  }
};
