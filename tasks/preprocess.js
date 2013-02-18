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

var preprocess = require('preprocess');

var defaultEnv = {};

function init(grunt) {
  var _ = grunt.util._;

  grunt.registerMultiTask('preprocess', 'Preprocess files based off environment configuration', function() {

    var options = this.options();
    var context = _.extend({}, defaultEnv,process.env, options.context || {});

    var src,dest;

    context.NODE_ENV = context.NODE_ENV || 'development';

    this.files.forEach(function(fileObj){
      if (!fileObj.dest) {
        if (!options.inline) {
          grunt.log.error('WARNING : POTENTIAL CODE LOSS.'.yellow);
          grunt.log.error('You must specify "inline : true" when using the "files" configuration.');
          grunt.log.errorlns(
            'This WILL REWRITE FILES WITHOUT MAKING BACKUPS. Make sure your ' +
              'code is checked in or you are configured to operate on a copied directory.'
          );
          return;
        }
        fileObj.src.forEach(function(src) {
          preprocess.preprocessFileSync(src,src,context);
        });
      } else {
        src = fileObj.src[0];
        dest = fileObj.dest;
        dest = grunt.template.process(dest);
        preprocess.preprocessFileSync(src,dest,context);
      }
    });
  });
}
