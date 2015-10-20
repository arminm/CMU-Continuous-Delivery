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
	  	}
	  }
	});

	// Load tasks
	grunt.loadNpmTasks('grunt-mocha-test');

	// Register tasks (Both `$ grunt` and `$ grunt test` would run mochaTest)
	grunt.registerTask('default', ['mochaTest']);
	grunt.registerTask('test', ['mochaTest']);
}
