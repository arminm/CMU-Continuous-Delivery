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
    cucumberjs: {
      circle: {
        src: 'features',
        options: {
          format: 'html',
          output: process.env.CIRCLE_TEST_REPORTS + '/cucumber/report.html'
        }
      },
      local: {
        src: 'features',
        options: {
          format: 'pretty',
        }
      }
    },
    jslint: { // configure the task 
      // lint your project's server code 
      server: {
        src: [
          'controllers/*.js',
          'models/*.js'
        ],
        exclude: [
          'server/config.js'
        ],
        directives: { // example directives 
          node: true,
          todo: true
        },
        options: {
          edition: 'latest', // specify an edition of jslint or use 'dir/mycustom-jslint.js' for own path 
          junit: 'out/server-junit.xml', // write the output to a JUnit XML 
          log: 'out/server-lint.log',
          jslintXml: 'out/server-jslint.xml',
          errorsOnly: true, // only display errors 
          failOnError: false, // defaults to true 
          checkstyle: 'out/server-checkstyle.xml' // write a checkstyle-XML 
        }
      },
      // lint your project's client code 
      client: {
        src: [
          'public/js/**/*.js'
        ],
        directives: {
          browser: true,
          predef: [
            'jQuery'
          ]
        },
        options: {
          junit: 'out/client-junit.xml'
        }
      }
    }
  });

  // Load tasks
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-mocha-istanbul');
  grunt.loadNpmTasks('grunt-cucumberjs');
  grunt.loadNpmTasks('grunt-jslint'); 

  // Register tasks (Both `$ grunt` and `$ grunt test` would run mochaTest)
  grunt.registerTask('default', ['mochaTest:test']);
  grunt.registerTask('test', ['mochaTest:test']);
  grunt.registerTask('default', 'jslint');

  // Cucumber
  grunt.registerTask('cucumber', ['cucumberjs:local']);

  // Circle
  grunt.registerTask('circle', ['mochaTest:circle', 'cucumberjs:circle', 'mocha_istanbul']);

  //Coverage
  grunt.registerTask('coverage', ['mocha_istanbul']);
}
