(function($, Backbone, app) {
	"use strict";
	app.View = app.View || {};

	app.View.User = Backbone.View.extend({
		initialize: function() {
			_.bindAll(this);
			this.render();
			this.model.on("change:name", this.showName);
			this.userDetailsTmpl = _.template(this.$("script.userDetailsTmpl").text().trim().replace(/\t/g, ""));
			this.initPopovers();
		},

		initPopovers: function() {
			$(".btnOnline, .btnOffline").popover();
		},

		render: function() {
			this.showName();
		},

		showName: function() {
			var me = this;
			var template = _.template(this.$("script.userNameTmpl:first").text().trim().replace(/\t/g, ""));
			$(".userName").each(function(i, el) {
				$(el).html(template({
					userName: me.model.get("name")
				}));
			});
			$(".remoteProfile").attr("href", "http://axemclion.iriscouch.com/_utils/document.html?userprefs/" + window.localStorage.getItem("userId"));
		},

		message: function(msg, type) {
			$("#docMessage").html(msg).addClass(type);
		},

		adminPage: function() {

		},

		changeName: function() {
			this.model.set("name", prompt("Enter a name", this.model.get("name")) || this.model.get("name"));
			this.model.save();
			return false;
		},

		changeUser: function() {
			window.localStorage.setItem("userId", prompt("Enter an existing User ID", this.model.id));
			//window.location.reload();
		},

		newSession: function() {
			window.localStorage.removeItem("userId");
			Pouch.destroy(CONF.local.userprefs, function(err, info) {
				if(err) {
					alert("Could not delete local IndexedDB");
				} else {
					window.location.reload();
				}

			});
		},

		sync: function(e) {
			var target = $(e.currentTarget);
			app.ONLINE = !target.hasClass("btnOffline");
			var popover = target.next(".popover");
			popover.find("button.close").length === 0 && popover.prepend("<button type='button' class='close' data-dismiss='alert'>&times;</button>");
			app.replicate(function(text) {
				popover.find(".popover-content").append("<br/>&#10003;  " + text);
			});
			
		},

		showUserDetails: function(e) {
			var me = this;
			var target = $(e.currentTarget).popover({
				content: function() {
					return me.userDetailsTmpl({
						u: me.model,
						CONF: CONF
					})
				}
			});
			var popover = target.next(".popover");
			popover.find("button.close").length === 0 && popover.prepend("<button type='button' class='close' data-dismiss='alert'>&times;</button>");

		},

		events: {
			"click .user-options .change-name": "changeName",
			"click .user-options .new-session": "newSession",
			"click .user-options .existing-user": "changeUser",
			"click .user-options .admin-user": "adminPage",
			"click .user-options .userDetails": "showUserDetails",

			"click .btnConnection .btnOnline": "sync",
			"click .btnConnection .btnOffline": "sync"
		}

	});
}(jQuery, Backbone, window.app = window.app || {}));