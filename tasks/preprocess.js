/*
 * preprocess
 * https://github.com/onehealth/grunt-preprocess
 *
 * Copyright (c) 2012 OneHealth Solutions, Inc.
 * Written by Jarrod Overson - http://jarrodoverson.com/
 * Licensed under the Apache 2.0 license.
 */
/*jshint node:true*/

'use strict';

module.exports = init;
init.preprocess = preprocess;

var grunt = require('grunt'),
    path = require('path'),
    preprocess = require('preprocess');

// remove when 0.4.0
grunt.util = grunt.util || grunt.utils;

var _ = grunt.util._;
var defaultEnv = {};


function init(grunt) {

  grunt.registerMultiTask('preprocess', 'Preprocess files based off environment configuration', function() {

    var context = _.extend({},defaultEnv,process.env, this.options()), files;

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
          preprocess.preprocessFileSync(src,src,context);
        });
      } else {
        for (var dest in this.data.files) {
          if (!this.data.files.hasOwnProperty(dest)) continue;
          var src = this.data.files[dest];
          dest = grunt.template.process(dest);
          preprocess.preprocessFileSync(src,dest,context);
        }
      }
    } else {
      var src = this.file.src[0],
          dest = this.file.dest;
      dest = grunt.template.process(dest);
      preprocess.preprocessFileSync(src,dest,context);
    }

  });
};
