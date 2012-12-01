(function($, app, undefined) {
	"use strict";
	app.Model = app.Model || {};
	app.Model.Session = Backbone.Model.extend({
		defaults: {
			title: undefined,
			time: {
				start: new Date,
				end: new Date()
			},
			speaker: undefined,
			location: undefined,
			prefs: {
				like: undefined,
				attend: undefined,
				notes: [],
				rating: undefined
			},
			slideUrl: undefined
		}
	});

}(jQuery, window.app = window.app || {}));