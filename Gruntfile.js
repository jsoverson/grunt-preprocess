'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    preprocess : {
      options : {
        context : {
          globalOption : "bar"
        }
      },
      html : {
        src : 'test/fixtures/test.html',
        dest : 'tmp/test.processed.html',
        options : {
          context : {
            customOption : 'foo',
            foo: function (param) {
              return param + '-baz';
            }
          }
        }
      },
      js : {
        src : 'test/fixtures/test.js',
        dest : 'tmp/test.processed.js'
      },
      coffee : {
        src : 'test/fixtures/test.coffee',
        dest : 'tmp/test.processed.coffee'
      },
      'customext with srcDir': {
        options: {
          type: 'coffee',
          srcDir: 'test/fixtures'
        },
        src : 'tmp/test.coffee.customext',
        dest : 'tmp/test.processed.coffee.customext'
      },
      fileNotFoundSilentFail: {
        options: {
          type: 'coffee',
          fileNotFoundSilentFail: true
        },
        src : 'tmp/test.coffee.customext',
        dest : 'tmp/test.processed.legacy.notfound.coffee'
      },
      customEol: {
        options: {
          srcEol: '\r\n'
        },
        src : 'test/fixtures/test.coffee',
        dest : 'tmp/test.processed.custom.eol.coffee'
      },
      deep : {
        src : 'test/fixtures/test.js',
        dest : 'tmp/deep/directory/structure/test.processed.js'
      },
      multifile : {
        files : {
          'tmp/multifile.test.processed.js': 'test/fixtures/test.js',
          'tmp/multifile.test.processed.coffee': 'test/fixtures/test.coffee'
        }
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
      },
      'context-precedence-1' : {
        src : 'test/fixtures/context-precedence.js',
        dest : 'tmp/context-precedence-result-1.js'
      },
      'context-precedence-2' : {
        options : {
          context : {
            globalOption : "foo"
          }
        },
        src : 'test/fixtures/context-precedence.js',
        dest : 'tmp/context-precedence-result-2.js'
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
          {src : '*', dest : 'tmp/inline-temp', expand : true, cwd : 'test/fixtures/inline/'},
          {src : "test/fixtures/test.coffee", dest: "tmp/test.coffee.customext"}
        ]
      }
    },
    clean : {
      test : ['tmp']
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
  grunt.registerTask('test', ['jshint','clean', 'fake-env', 'copy', 'preprocess', 'nodeunit']);

  grunt.registerTask('default', ['test']);

  grunt.registerTask('fake-env', function() {
    // create a fake env var for tests
    process.env['FAKEHOME'] = '/Users/joverson';
  });

};
