'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    preprocess : {
      html : {
        src : 'test/fixtures/test.html',
        dest : 'tmp/test.processed.html',
        options : {
          context : {
            customOption : 'foo'
          }
        }
      },
      js : {
        src : 'test/fixtures/test.js',
        dest : 'tmp/test.processed.js'
      },
      expanded : {
        files : {
          'tmp/test-inline-expected.js' : 'test/fixtures/inline/test.js',
          'tmp/test2-inline-expected.js' : 'test/fixtures/inline/test2.js'
        }
      },
      inline : {
        src : 'tmp/inline-temp/*.js',
        options : {
          inline : true
        }
      }
    },
    jshint: {
      options: {
        jshintrc : '.jshintrc'
      },
      all : ['Gruntfile.js', 'tasks/**/*.js']
    },
    copy : {
      test : {
        files : [
          {src : '*', dest : 'tmp/inline-temp', expand : true, cwd : 'test/fixtures/inline/'}
        ]
      }
    },
    clean : {
      test : ['tmp/inline-temp/*']
    },
    nodeunit: {
      tests: ['test/*_test.js']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-jshint');

  // Load local tasks.
  grunt.loadTasks('tasks');

  // Default task.
  grunt.registerTask('default', ['jshint','clean','copy','preprocess', 'nodeunit']);

};
