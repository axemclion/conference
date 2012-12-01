(function($, app) {
	app.Collection = app.Collection || {};
	app.Collection.SessionList = Backbone.Collection.extend({
		model: app.Model.Session,
		initialize: function(config) {
			this.config = config;
		}
	});

}(jQuery, window.app = window.app || {}));