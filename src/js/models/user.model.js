(function($, app, undefined) {
	"use strict";
	app.Model = app.Model || {};
	app.Model.User = Backbone.Model.extend({
		defaults: {
			name: "Anonymous",
			sessions: {},
			people : {}
		}
	});
}(jQuery, window.app = window.app || {}));