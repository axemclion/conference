(function($, app, undefined) {
	"use strict";
	app.Model = app.Model || {};

	app.Model.People = Backbone.Model.extend({
		defaults: {
			name: undefined,
			company: undefined,
			twitter: undefined,
			email: undefined,
			notes: undefined
		}
	});

}(jQuery, window.app = window.app || {}));