/*
 * grunt-preprocess
 * https://github.com/joverson/grunt-preprocess
 *
 * Copyright (c) 2012 Jarrod Overson
 * Licensed under the MIT license.
 */

'use strict';

module.exports = init;
init.preprocess = preprocess;

var grunt = require('grunt'),
    path = require('path');

// remove when 0.4.0
grunt.util = grunt.util || grunt.utils;

var _ = grunt.util._;

var defaults = {
}

var delim = {
  html : {
    exclude : {
      start : "<!--[ \t]*exclude[ \t]+([^\n]+)[ \t]*-->",
      end   : "<!--[ \t]*endexclude[ \t]*-->"
    },
    include : {
      start : "<!--[ \t]*include[ \t]+([^\n]+)[ \t]*-->",
      end   : "<!--[ \t]*endinclude[ \t]*-->"
    }
  },
  js : {
    exclude : {
      start : "//[ \t]*exclude[ \t]+([^\n]+)[ \t]*",
      end   : "//[ \t]*endexclude[ \t]*"
    },
    include : {
      start : "//[ \t]*include[ \t]+([^\n]+)[ \t]*",
      end   : "//[ \t]*endinclude[ \t]*"
    }
  }
}

function init(grunt) {

  grunt.registerMultiTask('preprocess', 'Preprocess files based off environment configuration', function() {

    var context = {
      env : process.env.NODE_ENV || 'dev'
    };

    if (this.data.files) {
      if (!this.data.inline) {
        grunt.log.error('WARNING : POTENTIAL CODE LOSS.'.yellow);
        grunt.log.error('You must specify "inline : true" when using the "files" configuration.');
        grunt.log.errorlns(
          'This WILL REWRITE FILES WITHOUT MAKING BACKUPS. Make sure your ' +
            'code is checked in or you are configured to operate on a copied directory.'
        );
        return;
      }
      var files = grunt.file.expandFiles(this.data.files);
      files.forEach(function(src) {
        var text = grunt.file.read(src);
        var processed = preprocess(text,context,getExtension(src));
        grunt.file.write(src, processed);
      });
    } else {
      var src = this.file.src,
        dest = this.file.dest;

      var text = grunt.file.read(src);
      var processed = preprocess(text,context,getExtension(src));
      grunt.file.write(dest, processed);
    }

  });
};

function getExtension(filename) {
  var ext = path.extname(filename||'').split('.');
  return ext[ext.length - 1];
}

function preprocess(src,context,type) {
  context = context || {};

  type = type || 'html';

  var rv = '';

  rv = src.replace(getRegex(type,'exclude'),function(match,test,include){
    return testPasses(test,context) ? '' : include;
  })

  rv = rv.replace(getRegex(type,'include'),function(match,test,include){
    return testPasses(test,context) ? include : '';
  })

  return rv;
}

function getRegex(type, def) {
  return new RegExp(delim[type][def].start + '((?:.|\n|\r)*?)' + delim[type][def].end,'gi')
}

function getTestTemplate(test) {
  test = test.replace(/([^=])=([^=])/g, '$1==$2');
  return '<% if ('+test+') { %>true<% }else{ %>false<% } %>'
}

function testPasses(test,context) {
  return _.template(getTestTemplate(test),context) === 'true';
}
