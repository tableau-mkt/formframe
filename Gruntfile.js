'use strict';

module.exports = function(grunt) {
  var supportedJqueryVersions = ['1.4.4', '1.5.2', '1.6.4', '1.7.2', '1.8.3', '1.9.1', '1.10.2', '1.11.1', 'git1', '2.0.3', '2.1.0', '2.1.1', 'git2'];

  // Project configuration.
  grunt.initConfig({
    // Task configuration.
    connect: {
      server: {
        options: {
          port: 8085
        }
      }
    },
    uglify: {
      dist: {
        src: 'js/loader.js',
        dest: 'js/loader.min.js'
      }
    },
    qunit: {
      options: {
        '--web-security': 'no',
        coverage: {
          disposeCollector: true,
          baseUrl: 'http://localhost:<%= connect.server.options.port %>/',
          src: [
            'js/framecomm.js',
            'js/loader.js'
          ],
          instrumentedFiles: '.temp/',
          htmlReport: 'report/coverage',
          lcovReport: 'report/',
          linesThresholdPct: 80,
          statementsThresholdPct: 80,
          functionsThresholdPct: 80,
          branchesThresholdPct: 66
        }
      },
      all: {
        options: {
          urls: supportedJqueryVersions.map(function(version) {
            return 'test/js-unit/child-frame.html?jquery=' + version;
          }).concat(supportedJqueryVersions.map(function(version) {
            return 'test/js-unit/parent-frame.html?jquery=' + version;
          }))
        }
      }
    },
    jshint: {
      gruntfile: {
        options: {
          jshintrc: '.jshintrc'
        },
        src: 'Gruntfile.js'
      },
      src: {
        options: {
          jshintrc: 'js/.jshintrc',
          // @todo Get the loader.js up to spec.
          ignores: ['js/loader.min.js', 'js/loader.js']
        },
        src: ['js/**/*.js']
      },
      test: {
        options: {
          jshintrc: 'test/.jshintrc',
          ignores: ['test/js-unit/*/**/*.js']
        },
        src: ['test/js-unit/*.js']
      }
    },
    watch: {
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },
      src: {
        files: '<%= jshint.src.src %>',
        tasks: ['jshint:src', 'qunit']
      },
      test: {
        files: '<%= jshint.test.src %>',
        tasks: ['jshint:test', 'qunit']
      }
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-qunit-istanbul');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');

  // Default task.
  grunt.registerTask('default', ['connect', 'jshint', 'qunit', 'uglify']);

  // Test task.
  grunt.registerTask('test', ['connect', 'jshint', 'qunit']);

};
