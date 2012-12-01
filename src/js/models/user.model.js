(function($, app, undefined) {
	"use strict";
	app.Model = app.Model || {};
	app.Model.User = Backbone.Model.extend({
		defaults: {
			name: undefined,
			id: undefined
		}
	});
}(jQuery, window.app = window.app || {}));