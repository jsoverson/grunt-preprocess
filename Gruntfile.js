'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    test: {
      files: ['test/**/*_test.js']
    },
    lint: {
      files: ['Gruntfile.js', 'tasks/**/*.js', '<config:test.files>']
    },
    watch: {
      files: '<config:lint.files>',
      tasks: 'default'
    },
    preprocess : {
      html : {
        src : 'test/fixtures/test.html',
        dest : 'test/fixtures/test.processed.html'
      },
      js : {
        src : 'test/fixtures/test.js',
        dest : 'test/fixtures/test.processed.js'
      },
      expanded : {
        files : {
          'test/fixtures/inline-temp/test-expected.js' : 'test/fixtures/inline/test.js',
          'test/fixtures/inline-temp/test2-expected.js' : 'test/fixtures/inline/test2.js'
        }
      },
      inline : {
        files : 'test/fixtures/inline-temp/*.js',
        inline : true
      }
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        node: true,
        es5: true
      },
      globals: {}
    },
    copy : {
      test : {
        src : 'test/fixtures/inline/*',
        dest : 'test/fixtures/inline-temp/'
      }
    },
    clean : {
      test : ['test/fixtures/inline/inline-temp/*']
    },
    nodeunit: {
      tests: ['test/*_test.js']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');

  // Load local tasks.
  grunt.loadTasks('tasks');

  // Default task.
  grunt.registerTask('default', ['clean','copy','preprocess', 'nodeunit']);

};
