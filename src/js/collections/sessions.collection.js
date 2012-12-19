(function($, app) {
	app.Collection = app.Collection || {};
	app.Collection.SessionList = Backbone.Collection.extend({
		model: app.Model.Session,
		initialize : function(models, options){
			this.server = options.server;
			this.db = options.db;
		}
	});

}(jQuery, window.app = window.app || {}));