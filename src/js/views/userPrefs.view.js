(function($, Backbone, app) {
	"use strict";
	app.View = app.View || {};

	app.View.UserPrefs = Backbone.View.extend({
		initialize: function() {
			_.bindAll(this);
			this.render();
		},

		render: function() {
			this.cachedSessions = this.model.get("sessions");
			this.$(".btnStar").each(this.renderStar);
			this.$(".btnLikeUnlike").each(this.renderLikeUnlike);
			delete this.cachedSessions;
		},

		renderStar: function(i, el) {
			var $el = $(el);
			var data = this.cachedSessions[$el.data("sessionid")];
			if(data) {
				$el.addClass(data.star ? "btn-warning": "");
			}
		},

		renderLikeUnlike: function(i, el) {
			var $el = $(el);
			var data = this.cachedSessions[$el.children(".btnLike").data("sessionid")];
			if(data) {
				console.log("Changing", el);
				data.like === 1 && $el.children(".btnLike").addClass("btn-success");
				data.like === -1 && $el.children(".btnUnlike").addClass("btn-danger");
			}
		},

		onThumbs: function(e) {
			var target = $(e.currentTarget);
			var isOn = target.hasClass("on");
			target.parent().children(".btnLike, .btnUnlike").removeClass("on btn-success btn-danger");
			if(!isOn) {
				target.addClass("on " + (target.hasClass("btnLike") ? "btn-success" : "btn-danger"));
			}
			this.changeProp(target, "like", target.hasClass("btn-success") ? 1 : target.hasClass("btn-danger") ? -1 : 0);
			return false;
		},

		onStar: function(e) {
			var target = $(e.currentTarget);
			target.toggleClass("btn-warning");
			this.changeProp(target, "star", target.hasClass("btn-warning"));
		},

		changeProp: function(target, prop, val) {
			var sessionId = target.data("sessionid");
			var sessions = this.model.get("sessions");
			if(typeof sessions[sessionId] === "undefined") {
				sessions[sessionId] = {};
			}
			sessions[sessionId][prop] = val;
		},

		events: {
			"click .btnLike": "onThumbs",
			"click .btnUnlike": "onThumbs",
			"click .btnStar": "onStar"
		}

	});
}(jQuery, Backbone, window.app = window.app || {}));