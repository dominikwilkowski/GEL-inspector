'use strict';

module.exports = function(grunt) {

	//------------------------------------------------------------------------------------------------------------------------------------------------------------
	// Dependencies
	//------------------------------------------------------------------------------------------------------------------------------------------------------------
	grunt.loadNpmTasks('grunt-zip');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-wakeup');


	grunt.initConfig({

		//----------------------------------------------------------------------------------------------------------------------------------------------------------
		// Bookmarklet
		//----------------------------------------------------------------------------------------------------------------------------------------------------------
		zip: {
			'./PROD/upload.zip': [
				'./dev/manifest.json',
				'./dev/devtools.html',
				'./dev/devtools.js',
			],
		},


		//----------------------------------------------------------------------------------------------------------------------------------------------------------
		// Wakeup
		//----------------------------------------------------------------------------------------------------------------------------------------------------------
		wakeup: {
			wakeme: {},
		},


		//----------------------------------------------------------------------------------------------------------------------------------------------------------
		// watch for changes
		//----------------------------------------------------------------------------------------------------------------------------------------------------------
		watch: {
			All: {
				files: [
					'./dev/**/*',
				],
				tasks: [
					'build',
				],
			},
		},

	});



	//------------------------------------------------------------------------------------------------------------------------------------------------------------
	// Tasks
	//------------------------------------------------------------------------------------------------------------------------------------------------------------
	grunt.registerTask('build', [
		'zip',
		'wakeup',
	]);

	grunt.registerTask('default', ['build', 'watch']);
};