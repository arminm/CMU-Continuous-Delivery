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
                mochaFile: '~' + process.env.CIRCLE_TEST_REPORTS + '/mocha/results.xml'
              }
            },
            src: ['test/**/*.js']
        }
	  }
	});

	// Load tasks
	grunt.loadNpmTasks('grunt-mocha-test');

	// Register tasks (Both `$ grunt` and `$ grunt test` would run mochaTest)
	grunt.registerTask('default', ['mochaTest:test']);
	grunt.registerTask('test', ['mochaTest:test']);

	// Circle
    grunt.registerTask('circle', ['mochaTest:circle']);
}
