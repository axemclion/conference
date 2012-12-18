(function($, app, undefined) {
	"use strict";
	app.Model = app.Model || {};
	app.Model.Session = Backbone.Model.extend({
		idAttribute: "_id",
		defaults: {
			title: undefined,
			time: {
				start: new Date(),
				end: new Date()
			},
			room : undefined,
			location: undefined,
			slideUrl: undefined,
			rating : undefined,
			comments : [],
			tags : []
		}
	});

}(jQuery, window.app = window.app || {}));