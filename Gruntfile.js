module.exports = function(grunt) {
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
    }
  });

  // Load tasks
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-mocha-istanbul');
  grunt.loadNpmTasks('grunt-cucumberjs');

  // Register tasks (Both `$ grunt` and `$ grunt test` would run mochaTest)
  grunt.registerTask('default', ['mochaTest:test']);
  grunt.registerTask('test', ['mochaTest:test']);

  // Cucumber
  grunt.registerTask('cucumber', ['cucumberjs:local']);

  // Circle
  grunt.registerTask('circle', ['mochaTest:circle', 'cucumberjs:circle', 'mocha_istanbul']);

  //Coverage
  grunt.registerTask('coverage', ['mocha_istanbul']);
}
