(function($, app, undefined) {
	"use strict";
	app.Model = app.Model || {};
	app.Model.Location = Backbone.Model.extend({
		defaults: {
			name: undefined,
			details: undefined
		}
	});
}(jQuery, window.app = window.app || {}));