(function($, app) {
	"use strict";
	app.View = app.View || {};

	app.View.Main = Backbone.View.extend({
		el: "#conference",
		initialize: function(config) {
			console.log("Initializing the application", config);
			app.sessionList = new app.Collection.SessionList(config);
			app.sessionList.on("sync", function() {
				console.log("Synced SessionList with server");
			});
			app.sessionList.fetch();
			this.loadingTemplate = this.$("#loading");
		},

		render: function() {
			this.days = [];
			debugger;
		},

		showView: function(type) {

		},

		events: {}
	});

}(jQuery, window.app = window.app || {}));