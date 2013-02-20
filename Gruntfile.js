/* global module:false */
module.exports = function(grunt) {
	grunt.initConfig({
		pkg: '<json:package.json>',
		meta: {
			banner: '/*! <%= pkg.name %> */'
		},

		copy: {
			html: {
				src: ['src/*'],
				dest: 'dist/',
				flatten: true,
				expand: true,
				filter: "isFile"
			},
			pages: {
				src: ["src/pages/*"],
				dest: "dist/pages/",
				expand: true,
				flatten: true,
				filter: "isFile"
			},
			lib: {
				src: "lib/**",
				dest: "dist/"
			}
		},

		less: {
			development: {
				options: {
					paths: ["src/less"]
				},
				files: {
					"dist/main.css": "src/less/*.less"
				}
			}
		},

		concat: {
			"dist/main.js": ['src/js/models/*.js', 'src/js/collections/*.js', 'src/js/views/*.js', 'src/js/router/router.js', 'src/js/*.js']
		},

		'jsmin-sourcemap': {
			all: {
				src: ['src/js/models/*.js', 'src/js/collections/*.js', 'src/js/views/*.js', 'src/js/router/router.js', 'src/js/*.js'],
				dest: 'dist/main.js',
				destMap: 'dist/main.map.json',
				srcRoot: '..'
			},

		},

		watch: {
			scripts: {
				files: ["src/js/**/*.js", "src/js/*.js"],
				tasks: ["concat"]
			},
			less: {
				files: "src/less/*.less",
				tasks: ["less"]
			},
			html: {
				files: ["src/*.html", "src/config.js", "src/sessions.js", "src/main.appcache"],
				tasks: ["copy:html"]
			},
			pages: {
				files: ["src/pages/*.html", "src/pages/*.md"],
				tasks: ["copy:pages"]
			}
		},

		'cors-server': {
			base: 'http://127.0.0.1:5984',
			port: 2020
		},
		connect: {
			server: {
				base: '.',
				port: 8080
			}
		},


		jshint: {
			options: {
				camelcase: true,
				nonew: true,
				curly: true,
				// require { }
				eqeqeq: true,
				// === instead of ==
				immed: true,
				// wrap IIFE in parentheses
				latedef: true,
				// variable declared before usage
				newcap: true,
				// capitalize class names
				undef: true,
				// checks for undefined variables
				regexp: true,
				evil: true,
				eqnull: true,
				// == allowed for undefined/null checking
				expr: true,
				// allow foo && foo()
				browser: true // browser environment
			},
			globals: {}
		},
		uglify: {}
	});

	grunt.loadNpmTasks('grunt-contrib');

	grunt.registerTask("cors-server", "Runs a CORS proxy", function() {
		var cors = require('./src/server/cors-proxy.js');
		var url = require('url');
		var corsUrl = url.parse("http://127.0.0.1:" + (arguments[0] || grunt.config("cors-server.port")));
		var couchUrl = url.parse(grunt.util.toArray(arguments).slice(1).join(":") || grunt.config("cors-server.base"));
		grunt.log.writeln("Starting CORS server " + url.format(corsUrl) + " => " + url.format(couchUrl));
		cors.init(couchUrl, corsUrl);
	});

	grunt.registerTask("default", ['copy', 'concat', 'less', 'cors-server', 'connect', 'watch']);
};