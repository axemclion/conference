(function($, Backbone, app) {
	"use strict";
	app.View = app.View || {};

	app.View.Speakers = Backbone.View.extend({
		initialize: function() {
			this.lineItem = _.template(this.$("script").text().trim().replace(/\t/g, ""));
			this.collection.on("reset", _.bind(this.render, this));
			this.collection.fetch();
		},
		render: function() {
			_.each(this.collection.getSpeakers(), _.bind(this.addSpeaker, this));
		},

		addSpeaker: function(session) {
			this.$(".speakerContent").append(this.lineItem({
				s: session
			}))
		}
	});
}(jQuery, Backbone, window.app = window.app || {}));