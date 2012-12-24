(function($, app) {
	app.Collection = app.Collection || {};
	app.Collection.Users = Backbone.Collection.extend({
		model: app.Model.User,
		initialize: function(models, options) {
			this.server = options.server;
		}
	});

}(jQuery, window.app = window.app || {}));