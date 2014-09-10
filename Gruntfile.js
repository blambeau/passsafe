"use strict";

module.exports = function(grunt) {
  
  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),
    
    clean: ['dist'],
    
    jshint: {
      src: [
        'index.js',
      ],
      test: [
        'test/**/*.js'
      ],
      options: {
      },
      globals: {}
    },

    mochaTest: {
      test: {
        src: ['test/**/*.js'],
        options: {
          reporter: 'spec',
        }
      }
    },

    watch: {
      jshint: {
        files: [
          'index.js',
          'test/**/*.js'
        ],
        tasks: [ 'jshint' ]
      },
      unitTesting: {
        files: [
          'index.js',
          'test/**/*.js'
        ],
        tasks: [ 'test:unit' ]
      }
    },

    browserify: {
      main: {
        files: {
          'dist/passsafe.js': ['index.js']
        },
        options: {
          standalone: 'Passsafe',
          extensions: ['.js']
        }
      }
    },

    uglify: {
      my_target: {
        files: {
          'dist/passsafe.min.js': ['dist/passsafe.js']
        }
      }
    }

  });

  grunt.registerTask('default', ['test']);
  grunt.registerTask('compile', ['browserify', 'uglify']);

  grunt.registerTask('test', ['mochaTest']);
  
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
};
