(function($, app) {
	app.Collection = app.Collection || {};
	app.Collection.SessionList = Backbone.Collection.extend({
		model: app.Model.Session
	});

}(jQuery, window.app = window.app || {}));