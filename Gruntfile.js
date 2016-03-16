module.exports = function(grunt) {
  'use strict';
  // Project configuration
  grunt.initConfig ({
    pkg: grunt.file.readJSON('package.json'),
    mochaTest: {
      test: {
        options: {
          ui: 'tdd',
          reporter: 'spec',
          quiet: false,
          clearRequireCache: false
        },
        src: ['test/**/*.js']
      },
      circle: {
        options: {
          ui: 'tdd',
          reporter: 'mocha-junit-reporter',
          quiet: false,
          reporterOptions: {
            mochaFile: process.env.CIRCLE_TEST_REPORTS + '/mocha/results.xml'
          }
        },
        src: ['test/**/*.js']
      }
    },
    mocha_istanbul: {
      coverage: {
        src: 'test/**/*.js', // a folder works nicely
        options: {
          mochaOptions: ['--ui', 'tdd'], // any extra options for mocha
          istanbulOptions: ['--dir', process.env.CIRCLE_ARTIFACTS + '/coverage']
        }
      }
    },
    jshint: {
      options: {
        curly: true,
        eqnull: true,
        browser: true,
        globals: {
          jQuery: true,
          alert: true,
          console: true,
          angular: true,
          module: true,
          require: true,
          confirm: true,
          $: true,
          scrollToBottom: true,
          io: true,
          __dirname: true
        },
      },
      with_overrides: {

        options: {
          curly: false,
          undef: true,
        },
        files: {
          src: ['public/js/**/*.js', 'controllers/*.js', 'models/*.js', 'routes/*.js', 'app.js']
        },
      }
    }
  });

  // Load tasks
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-mocha-istanbul');
  grunt.loadNpmTasks('grunt-cucumberjs');
  grunt.loadNpmTasks('grunt-contrib-jshint'); 

  // Register tasks (Both `$ grunt` and `$ grunt test` would run mochaTest)
  grunt.registerTask('default', ['mochaTest:test']);
  grunt.registerTask('test', ['mochaTest:test']);

  // jslint
  grunt.registerTask('hint', 'jshint');

  // Cucumber
  grunt.registerTask('cucumber', ['cucumberjs:local']);

  // Circle
  grunt.registerTask('circle', ['mochaTest:circle', 'cucumberjs:circle', 'mocha_istanbul']);

  //Coverage
  grunt.registerTask('coverage', ['mocha_istanbul']);
}
