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
      "<!-- @if NODE_ENV!='production' -->\n" +
      "b\n" +
      "<!-- @endif -->\n" +
      "c";
    expected = "a\n\nc";
    test.equal(task.preprocess(input, { NODE_ENV: 'production'}), expected, 'Should exclude if match');


    input = "a\n" +
      "<!-- @if NODE_ENV!='production' -->\n" +
      "b\n" +
      "<!-- @endif -->\n" +
      "c";
    expected = "a\n\nb\n\nc";
    test.equal(task.preprocess(input, { NODE_ENV: 'dev'}), expected, 'Should not exclude if not match');

    input = "a\n" +
      "<!-- @if NODE_ENV=='production' -->\n" +
      "b\n" +
      "<!-- @endif -->\n" +
      "c";
    expected = "a\n\nb\n\nc";
    test.equal(task.preprocess(input, { NODE_ENV: 'production'}), expected, 'Should include if match');


    input = "a\n" +
      "<!-- @if NODE_ENV=='production' -->\n" +
      "b\n" +
      "<!-- @endif -->\n" +
      "c";
    expected = "a\n\nc";
    test.equal(task.preprocess(input, { NODE_ENV: 'dev'}), expected, 'Should not include if not match');

    test.done();
  },
  'preprocess javascript': function(test) {
    test.expect(5);

    // tests here

    var input,expected,settings;

    input = "a\n" +
      "// @if NODE_ENV!='production'\n" +
      "b\n" +
      "// @endif  \n" +
      "c";
    expected = "a\n\nc";
    test.equal(task.preprocess(input, { NODE_ENV: 'production'}, 'js'), expected, 'Should exclude if match');


    input = "a\n" +
      "// @if NODE_ENV!='production' \n" +
      "b\n" +
      "// @endif \n" +
      "c";
    expected = "a\n\nb\n\nc";
    test.equal(task.preprocess(input, { NODE_ENV: 'dev'}, 'js'), expected, 'Should not exclude if not match');

    input = "a\n" +
      "// @if NODE_ENV=='production'\n" +
      "b\n" +
      "// @endif\n" +
      "c";
    expected = "a\n\nb\n\nc";
    test.equal(task.preprocess(input, { NODE_ENV: 'production'}, 'js'), expected, 'Should include if match');


    input = "a\n" +
      "// @if NODE_ENV=='production'\n" +
      "b\n" +
      "// @endif\n" +
      "c";
    expected = "a\n\nc";
    test.equal(task.preprocess(input, { NODE_ENV: 'dev'}, 'js'), expected, 'Should not include if not match');

    input = "a/* @if NODE_ENV=='production' */b/* @endif */c";
    expected = "ac";
    test.equal(task.preprocess(input, { NODE_ENV: 'dev'}, 'js'), expected, 'Should not include if not match');

    test.done();
  },
  'preprocess html same line': function(test) {
    test.expect(4);

    // tests here

    var input,expected,settings;

    input = "a<!-- @if NODE_ENV!='production' -->b<!-- @endif -->c";
    expected = "ac";
    test.equal(task.preprocess(input, { NODE_ENV: 'production'}), expected, 'Should exclude if match');


    input = "a<!-- @if NODE_ENV!='production' -->b<!-- @endif -->c";
    expected = "abc";
    test.equal(task.preprocess(input, { NODE_ENV: 'dev'}), expected, 'Should not exclude if not match');

    input = "a<!-- @if NODE_ENV=='production' -->b<!-- @endif -->c";
    expected = "abc";
    test.equal(task.preprocess(input, { NODE_ENV: 'production'}), expected, 'Should include if match');


    input = "a<!-- @if NODE_ENV=='production' -->b<!-- @endif -->c";
    expected = "ac";
    test.equal(task.preprocess(input, { NODE_ENV: 'dev'}), expected, 'Should not include if not match');

    test.done();
  },
  'simple preprocess same line': function(test) {
    test.expect(1);

    // tests here

    var input,expected,settings;

    input = "a<!-- @exclude -->b<!-- @endexclude -->c";
    expected = "ac";
    test.equal(task.preprocess(input, { NODE_ENV: 'production'}), expected, 'Should exclude generic');

    test.done();
  },
  'force at least double equals': function(test) {
    test.expect(1);

    var input,expected,settings;

    input = "a<!-- @if NODE_ENV='production' -->b<!-- @endif -->c";
    expected = "ac";
    test.equal(task.preprocess(input, { NODE_ENV: 'dev'}), expected, 'Fail case, should not be included');

    test.done();
  },
  'ifdef': function(test) {
    test.expect(4);

    var input,expected,settings;

    input = "a<!-- @ifdef NONEXISTANT -->b<!-- @endif -->c";
    expected = "ac";
    test.equal(task.preprocess(input, { }), expected, 'Fail case, should not be included');

    input = "a<!-- @ifdef NODE_ENV -->b<!-- @endif -->c";
    expected = "abc";
    test.equal(task.preprocess(input, { NODE_ENV: 'dev'}), expected, 'Success case, should be included');

    input = "a/* @ifdef NONEXISTANT */b/* @endif */c";
    expected = "ac";
    test.equal(task.preprocess(input, { },'js'), expected, 'Fail case, should not be included');

    input = "a/* @ifdef NODE_ENV */b/* @endif */c";
    expected = "abc";
    test.equal(task.preprocess(input, { NODE_ENV: 'dev'},'js'), expected, 'Success case, should be included');

    test.done();
  },
  'ifndef': function(test) {
    test.expect(4);

    var input,expected,settings;

    input = "a<!-- @ifndef NONEXISTANT -->b<!-- @endif -->c";
    expected = "abc";
    test.equal(task.preprocess(input, { }), expected, 'Fail case, should not be included');

    input = "a<!-- @ifndef NODE_ENV -->b<!-- @endif -->c";
    expected = "ac";
    test.equal(task.preprocess(input, { NODE_ENV: 'dev'}), expected, 'Success case, should be included');

    input = "a/* @ifndef NONEXISTANT */b/* @endif */c";
    expected = "abc";
    test.equal(task.preprocess(input, { },'js'), expected, 'Fail case, should not be included');

    input = "a/* @ifndef NODE_ENV */b/* @endif */c";
    expected = "ac";
    test.equal(task.preprocess(input, { NODE_ENV: 'dev'},'js'), expected, 'Success case, should be included');

    test.done();
  },
  'include files': function(test) {
    test.expect(2);

    var input,expected,settings;
    input = "a<!-- @include include.txt -->c";
    expected = "a!foobar!\nc";
    test.equal(task.preprocess(input, { srcDir : 'test'}), expected, 'Should include files');

    input = "a/* @include include.txt */c";
    expected = "a!foobar!\nc";
    test.equal(task.preprocess(input, { srcDir : 'test'},'js'), expected, 'Should include files (js)');

    test.done();
  },
  'echo': function(test) {
    test.expect(1);

    var input,expected,settings;

    input = "a<!-- @echo FINGERPRINT -->c";
    expected = "a0xDEADBEEFc";
    test.equal(task.preprocess(input, { FINGERPRINT: '0xDEADBEEF'}), expected, 'Should include echo statement');

    test.done();
  }
};
