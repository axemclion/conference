(function($, Backbone, app) {
	"use strict";
	app.View = app.View || {};

	app.View.Speakers = Backbone.View.extend({
		initialize: function() {
			this.lineItem = _.template(this.$("script").text().trim().replace(/\t/g, ""));
			_.bindAll(this);
			this.render();
			this.listenTo(this.collection, "reset", this.render);
		},

		render: function() {
			if(this.options.item) {
				this.addSession([this.collection.get(this.options.item)]);
			} else {
				_.each(this.collection.getSessions(), this.addSession);
			}
		},

		onSpeaker: function(e, speakerId) {},

		addSpeaker: function(s) {
			this.$(".speakerContent").append(this.lineItem({
				s: s
			}));
		}
	});
}(jQuery, Backbone, window.app = window.app || {}));