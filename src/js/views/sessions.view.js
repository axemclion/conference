(function($, Backbone, app) {
	"use strict";
	app.View = app.View || {};

	app.View.Sessions = Backbone.View.extend({
		initialize: function() {
			this.lineItem = _.template(this.$("script").text().trim().replace(/\t/g, ""));
			this.collection.on("reset", _.bind(this.render, this));
			this.collection.fetch();
		},
		render: function() {
			_.each(this.collection.getSessions(), _.bind(this.addSession, this));
		},

		addSession: function(session) {
			this.$(".sessionContent").append(this.lineItem({
				s: session
			}))
		}
	});
}(jQuery, Backbone, window.app = window.app || {}));