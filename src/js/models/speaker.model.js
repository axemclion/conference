(function($, app) {
	"use strict";
	app.Model = app.Model || {};
	app.Model.Speaker = Backbone.Model.extend({
		defaults: {
			name: '',
			bio: ''
		}
	});

}(jQuery, window.app = window.app || {}));