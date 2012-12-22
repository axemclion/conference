(function($, Backbone, app) {
	"use strict";
	app.View = app.View || {};

	app.View.User = Backbone.View.extend({
		initialize: function() {
			_.bindAll(this);
			this.render();
			this.model.on("change:name", this.showName);
		},

		render: function() {
			this.showName();
		},

		showName: function() {
			var me = this;
			$(".userId").each(function(el) {
				var $this = $(this);
				var template = _.template($this.find("script").text().trim().replace(/\t/g, ""));
				$this.find(".userName").html(template({
					userName: me.model.get("name")
				}));
			});
		},

		message: function(msg, type) {
			$("#docMessage").html(msg);
		},

		changeUser: function() {
			this.model.set("name", prompt("Enter a name") || this.model.get("name"));
		},

		newSession: function() {
			window.localStorage.removeItem("userId");
			window.location.reload();
		},

		adminPage: function() {

		},

		online: function() {
			Pouch.replicate(CONF.local.userprefs, CONF.remote.userprefs, function() {
				console.log("REPLICATE", arguments);
			});
		},

		offline: function() {
			alert("Offline");
		},

		events: {
			"click .user-options .change-name": "changeUser",
			"click .user-options .new-session": "newSession",
			"click .user-options .existing-user": "changeUser",
			"click .user-options .admin-user": "adminPage",

			"click .btnConnection .btnOnline": "online",
			"click .btnConnection .btnOffline": "offline"
		}

	});
}(jQuery, Backbone, window.app = window.app || {}));