/*
 * grunt-preprocess
 * https://github.com/joverson/grunt-preprocess
 *
 * Copyright (c) 2012 Jarrod Overson
 * Licensed under the MIT license.
 */
/*jshint node:true*/

'use strict';

module.exports = init;
init.preprocess = preprocess;

var grunt = require('grunt'),
    path = require('path');

// remove when 0.4.0
grunt.util = grunt.util || grunt.utils;

var _ = grunt.util._;

var defaultEnv = {
}

var delim = {
  html : {
    insert : "<!--[ \t]*@echo[ \t]*([^\n]*)[ \t]*-->",
    include : "<!--[ \t]*@include[ \t]*([^\n]*)[ \t]*-->",
    exclude : {
      start : "<!--[ \t]*@exclude[ \t]*([^\n]*)[ \t]*-->",
      end   : "<!--[ \t]*@endexclude[ \t]*-->"
    },
    if : {
      start : "<!--[ \t]*@if[ \t]*([^\n]*)[ \t]*-->",
      end   : "<!--[ \t]*@endif[ \t]*-->"
    },
    ifdef : {
      start : "<!--[ \t]*@ifdef[ \t]*([^\n]*)[ \t]*-->",
      end   : "<!--[ \t]*@endif[ \t]*-->"
    },
    ifndef : {
      start : "<!--[ \t]*@ifndef[ \t]*([^\n]*)[ \t]*-->",
      end   : "<!--[ \t]*@endif[ \t]*-->"
    }
  },
  js : {
    insert : "(?://|/\\*)[ \t]*@echo[ \t]*([^\n*]*)[ \t]*(?:\\*/)?",
    include : "(?://|/\\*)[ \t]*@include[ \t]*([^\n*]*)[ \t]*(?:\\*/)?",
    exclude : {
      start : "(?://|/\\*)[ \t]*@exclude[ \t]*([^\n*]*)[ \t]*(?:\\*/)?",
      end   : "(?://|/\\*)[ \t]*@endexclude[ \t]*(?:\\*/)?"
    },
    if : {
      start : "(?://|/\\*)[ \t]*@if[ \t]*([^\n*]*)[ \t]*(?:\\*/)?",
      end   : "(?://|/\\*)[ \t]*@endif[ \t]*(?:\\*/)?"
    },
    ifdef : {
      start : "(?://|/\\*)[ \t]*@ifdef[ \t]*([^\n*]*)[ \t]*(?:\\*/)?",
      end   : "(?://|/\\*)[ \t]*@endif[ \t]*(?:\\*/)?"
    },
    ifndef : {
      start : "(?://|/\\*)[ \t]*@ifndef[ \t]*([^\n*]*)[ \t]*(?:\\*/)?",
      end   : "(?://|/\\*)[ \t]*@endif[ \t]*(?:\\*/)?"
    }
  }
}



function init(grunt) {

  grunt.registerMultiTask('preprocess', 'Preprocess files based off environment configuration', function() {

    var context = _.extend({},defaultEnv,process.env), files;

    context.NODE_ENV = context.NODE_ENV || 'development';

    if (this.data.files) {
      if (_.isArray(this.data.files) || _.isString(this.data.files)) {
        if (!this.data.inline) {
          grunt.log.error('WARNING : POTENTIAL CODE LOSS.'.yellow);
          grunt.log.error('You must specify "inline : true" when using the "files" configuration.');
          grunt.log.errorlns(
            'This WILL REWRITE FILES WITHOUT MAKING BACKUPS. Make sure your ' +
              'code is checked in or you are configured to operate on a copied directory.'
          );
          return;
        }
        files = grunt.file.expandFiles(this.data.files);
        files.forEach(function(src) {
          var text = grunt.file.read(src);
          context.src = src;
          context.srcDir = path.dirname(src);
          var processed = preprocess(text,context,getExtension(src));
          grunt.file.write(src, processed);
        });
      } else {
        for (var dest in this.data.files) {
          if (!this.data.files.hasOwnProperty(dest)) continue;
          var src = this.data.files[dest],
              text = grunt.file.read(src);
          context.src = src;
          context.srcDir = path.dirname(src);
          var processed = preprocess(text,context,getExtension(src));
          dest = grunt.template.process(dest);
          grunt.file.write(dest, processed);
        }
      }
    } else {
      var src = this.file.src,
          dest = this.file.dest;
      context.src = src;
      context.srcDir = path.dirname(src);

      var text = grunt.file.read(src);
      var processed = preprocess(text,context,getExtension(src));
      dest = grunt.template.process(dest);
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

  var rv = src;

  rv = rv.replace(getRegex(type,'include'),function(match,file,include){
    file = grunt.util._(file).trim();
    var includedSource = grunt.file.read(path.join(context.srcDir,file));
    return includedSource || match + ' not found';
  })

  rv = rv.replace(getRegex(type,'exclude'),function(match,test,include){
    return testPasses(test,context) ? '' : include;
  })

  rv = rv.replace(getRegex(type,'ifdef'),function(match,test,include){
    test = _(test).trim();
    return typeof context[test] !== 'undefined' ? include : '';
  })

  rv = rv.replace(getRegex(type,'ifndef'),function(match,test,include){
    test = _(test).trim();
    return typeof context[test] === 'undefined' ? include : '';
  })

  rv = rv.replace(getRegex(type,'if'),function(match,test,include){
    return testPasses(test,context) ? include : '';
  })

  rv = rv.replace(getRegex(type,'insert'),function(match,variable) {
    return context[_(variable).strip()];
  });

  return rv;
}

function getRegex(type, def) {

  var isRegex = typeof delim[type][def] === 'string' || delim[type][def] instanceof RegExp;
  return isRegex ?
            new RegExp(delim[type][def],'gi') :
            new RegExp(delim[type][def].start + '((?:.|\n|\r)*?)' + delim[type][def].end,'gi');
}

function getTestTemplate(test) {
  test = test || 'true';
  test = test.replace(/([^=])=([^=])/g, '$1==$2');
  return '<% if ('+test+') { %>true<% }else{ %>false<% } %>'
}

function testPasses(test,context) {
  return _.template(getTestTemplate(test),context) === 'true';
}
