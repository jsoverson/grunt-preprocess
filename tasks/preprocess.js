/*
 * preprocess
 * https://github.com/onehealth/grunt-preprocess
 *
 * Copyright (c) 2012 OneHealth Solutions, Inc.
 * Written by Jarrod Overson - http://jarrodoverson.com/
 * Licensed under the Apache 2.0 license.
 */

'use strict';

var _ = require('lodash');
var path = require('path');

module.exports = init;

var preprocess = require('preprocess');

function init(grunt) {
  grunt.registerMultiTask('preprocess', 'Preprocess files based off environment configuration', function() {

    grunt.config.requires(this.name);

    var taskOptions = _.clone(this.options() || {});
    var globalOptions = _.clone(grunt.config(this.name).options || {});

    if (taskOptions.srcEol != null) {
      taskOptions.srcEol = grunt.config.getRaw([this.name, this.target, 'options.srcEol'].join('.'));
    }
    if (globalOptions.srcEol != null) {
      globalOptions.srcEol = grunt.config.getRaw(this.name + '.options.srcEol');
    }

    var context = _.merge({}, process.env, globalOptions.context, taskOptions.context);
    context.NODE_ENV = context.NODE_ENV || 'development';

    delete taskOptions.context;
    delete globalOptions.context;

    var options = _.merge(globalOptions, taskOptions);

    this.files.forEach(function(fileObj){
      if (!fileObj.dest) {
        if (!taskOptions.inline) {
          grunt.log.error('WARNING : POTENTIAL CODE LOSS.'.yellow);
          grunt.log.error('You must specify "inline : true" when using the "files" configuration.');
          grunt.log.errorlns(
            'This WILL REWRITE FILES WITHOUT MAKING BACKUPS. Make sure your ' +
              'code is checked in or you are configured to operate on a copied directory.'
          );
          return;
        }
        fileObj.src.forEach(function(src) {
          preprocessFile(grunt, src, src, context, options);
        });
      } else {
        var src = fileObj.src[0];
        var dest = grunt.template.process(fileObj.dest);

        preprocessFile(grunt, src, dest, context, options);
      }
    });
  });
}

function preprocessFile(grunt, src, dest, context, options) {
  try {
    var srcText = grunt.file.read(src);
    context.src = src;

    // need to copy options so that any further file-specific modifications on the object
    // are not persisted for different files
    options = _.clone(options);

    // context.srcDir is for backwards-compatibility only
    options.srcDir = context.srcDir || options.srcDir || path.dirname(src);
    options.type = options.type || getExtension(src);
    var processed = preprocess.preprocess(srcText, context, options);
    grunt.file.write(dest, processed);
  } catch(e) {
    grunt.log.error('Error while preprocessing %s', src);
    throw e;
  }
}

function getExtension(filename) {
  var ext = path.extname(filename||'').split('.');
  return ext[ext.length - 1];
}
