(function($, app, undefined) {
	"use strict";
	app.Model = app.Model || {};
	app.Model.Session = Backbone.Model.extend({
		defaults: {
			name: '',
			description: '',
			speaker: {
				name: '',
				bio: '',
				url: '',
				pic: 'http://'
			},
			time: {
				start: new Date(),
				end: new Date()
			},
			slideUrl: '',
			room: "*",
			tags: [],
			category: ''
		}
	});
}(jQuery, window.app = window.app || {}));

_.mixin({
	capitalize: function(string) {
		return string.charAt(0).toUpperCase() + string.substring(1).replace(/([A-Z])/g, " $1");
	}
});