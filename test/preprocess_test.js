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
      "<!-- exclude NODE_ENV=='production' -->\n" +
      "b\n" +
      "<!-- endexclude -->\n" +
      "c";
    expected = "a\n\nc";
    test.equal(task.preprocess(input, { NODE_ENV: 'production'}), expected, 'Should exclude if match');


    input = "a\n" +
      "<!-- exclude NODE_ENV=='production' -->\n" +
      "b\n" +
      "<!-- endexclude -->\n" +
      "c";
    expected = "a\n\nb\n\nc";
    test.equal(task.preprocess(input, { NODE_ENV: 'dev'}), expected, 'Should not exclude if not match');

    input = "a\n" +
      "<!-- include NODE_ENV=='production' -->\n" +
      "b\n" +
      "<!-- endinclude -->\n" +
      "c";
    expected = "a\n\nb\n\nc";
    test.equal(task.preprocess(input, { NODE_ENV: 'production'}), expected, 'Should include if match');


    input = "a\n" +
      "<!-- include NODE_ENV=='production' -->\n" +
      "b\n" +
      "<!-- endinclude -->\n" +
      "c";
    expected = "a\n\nc";
    test.equal(task.preprocess(input, { NODE_ENV: 'dev'}), expected, 'Should not include if not match');

    test.done();
  },
  'preprocess javascript': function(test) {
    test.expect(4);

    // tests here

    var input,expected,settings;

    input = "a\n" +
      "// exclude NODE_ENV=='production'\n" +
      "b\n" +
      "// endexclude  \n" +
      "c";
    expected = "a\n\nc";
    test.equal(task.preprocess(input, { NODE_ENV: 'production'}, 'js'), expected, 'Should exclude if match');


    input = "a\n" +
      "// exclude NODE_ENV=='production' \n" +
      "b\n" +
      "// endexclude \n" +
      "c";
    expected = "a\n\nb\n\nc";
    test.equal(task.preprocess(input, { NODE_ENV: 'dev'}, 'js'), expected, 'Should not exclude if not match');

    input = "a\n" +
      "// include NODE_ENV=='production'\n" +
      "b\n" +
      "// endinclude\n" +
      "c";
    expected = "a\n\nb\n\nc";
    test.equal(task.preprocess(input, { NODE_ENV: 'production'}, 'js'), expected, 'Should include if match');


    input = "a\n" +
      "// include NODE_ENV=='production'\n" +
      "b\n" +
      "// endinclude\n" +
      "c";
    expected = "a\n\nc";
    test.equal(task.preprocess(input, { NODE_ENV: 'dev'}, 'js'), expected, 'Should not include if not match');

    test.done();
  },
  'preprocess html same line': function(test) {
    test.expect(4);

    // tests here

    var input,expected,settings;

    input = "a<!-- exclude NODE_ENV=='production' -->b<!-- endexclude -->c";
    expected = "ac";
    test.equal(task.preprocess(input, { NODE_ENV: 'production'}), expected, 'Should exclude if match');


    input = "a<!-- exclude NODE_ENV=='production' -->b<!-- endexclude -->c";
    expected = "abc";
    test.equal(task.preprocess(input, { NODE_ENV: 'dev'}), expected, 'Should not exclude if not match');

    input = "a<!-- include NODE_ENV=='production' -->b<!-- endinclude -->c";
    expected = "abc";
    test.equal(task.preprocess(input, { NODE_ENV: 'production'}), expected, 'Should include if match');


    input = "a<!-- include NODE_ENV=='production' -->b<!-- endinclude -->c";
    expected = "ac";
    test.equal(task.preprocess(input, { NODE_ENV: 'dev'}), expected, 'Should not include if not match');

    test.done();
  },
  'simple preprocess same line': function(test) {
    test.expect(2);

    // tests here

    var input,expected,settings;

    input = "a<!-- exclude -->b<!-- endexclude -->c";
    expected = "ac";
    test.equal(task.preprocess(input, { NODE_ENV: 'production'}), expected, 'Should exclude generic');


    input = "a<!-- include -->b<!-- endinclude -->c";
    expected = "abc";
    test.equal(task.preprocess(input, { NODE_ENV: 'production'}), expected, 'Should include generic');

    test.done();
  },
  'force at least double equals': function(test) {
    test.expect(1);

    var input,expected,settings;

    input = "a<!-- include NODE_ENV='production' -->b<!-- endinclude -->c";
    expected = "ac";
    test.equal(task.preprocess(input, { NODE_ENV: 'dev'}), expected, 'Fail case, should not be included');

    test.done();
  },
  'do simple replacements': function(test) {
    test.expect(1);

    var input,expected,settings;

    input = "a<!-- insert FINGERPRINT -->c";
    expected = "a0xDEADBEEFc";
    test.equal(task.preprocess(input, { FINGERPRINT: '0xDEADBEEF'}), expected, 'Fail case, should not be included');

    test.done();
  }
};
