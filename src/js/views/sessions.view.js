(function($, Backbone, app) {
	"use strict";
	app.View = app.View || {};

	app.View.Sessions = Backbone.View.extend({
		initialize: function() {
			_.bindAll(this);
			this.lineItem = _.template(this.$("script").text().trim().replace(/\t/g, ""));
			this.render();

			this.listenTo(this.collection, "reset", this.render);
			this.listenTo(app.user, "reset", this.render);

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
				s: s,
				user: app.user.get("sessions")[s.id] || {}
			}));
		},

		onNavigate: function(path) {
			path[2] && this.$(".viewall").show();
			this.item = path[2];
			this.render();
		},

		onThumbs: function(e) {
			var target = $(e.currentTarget);
			var isOn = target.hasClass("on");
			target.parent().children(".btnLike, .btnUnlike").removeClass("on btn-success btn-danger");
			if(!isOn) {
				target.addClass("on " + (target.hasClass("btnLike") ? "btn-success" : "btn-danger"));
			}
			return false;
		},

		onStar: function(e) {
			var target = $(e.currentTarget);
			target.toggleClass("btn-warning");
		},

		events: {
			"click .btnLike": "onThumbs",
			"click .btnUnlike": "onThumbs",
			"click .btnStar": "onStar"
		}

	});
}(jQuery, Backbone, window.app = window.app || {}));