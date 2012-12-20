(function($, Backbone, app) {
	"use strict";
	app.View = app.View || {};

	app.View.Sessions = Backbone.View.extend({
		initialize: function() {
			_.bindAll(this);
			this.lineItem = _.template(this.$("script").text().trim().replace(/\t/g, ""));
			this.render();
			this.listenTo(this.collection, "reset", this.render);
			this.listenTo(this, "navigate", this.onNavigate);
			this.path = undefined;
		},
		render: function() {
			this.$(".sessionContent").empty();
			var data = this.options.dataFunc.call(this.collection, this.item);
			_.each(data, this.addSession);
		},

		addSession: function(s) {
			s && this.$(".sessionContent").append(this.lineItem({
				s: s
			}));
		},

		onNavigate: function(path) {
			this.item = path[2];
			this.render();
		}

	});
}(jQuery, Backbone, window.app = window.app || {}));