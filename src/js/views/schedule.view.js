(function($, Backbone, app) {
	"use strict";
	app.View = app.View || {};

	app.View.Schedule = Backbone.View.extend({
		initialize: function() {
			_.bindAll(this);
			this.sessionTmpl = this.getTemplate("session");
			this.rowTmpl = this.getTemplate("row");
			this.dayTmpl = this.getTemplate("day");

			this.render();
			this.listenTo(this.collection, "reset", this.render);
		},

		getTemplate: function(className) {
			return _.template(this.$("script." + className).text().trim().replace(/\t/g, ""));
		},

		render: function() {
			var me = this;
			var days = _.groupBy(this.collection.models, function(s) {
				return moment(s.get("time").start).format("YYYY-MM-DD");
			});

			this.$(".content").html(this.dayTmpl({
				days: days
			}));
			_.each(days, this.renderDay);
			window.setTimeout(function() {
				this.$(".content .nav-tabs li:first").click();
			}, 100);
		},

		renderDay: function(daySch, day) {
			//console.group(day);
			var me = this;
			var rooms = _.reject(_.uniq(_.map(daySch, function(session) {
				return session.get("room");
			})), function(roomName) {
				return roomName === "*";
			});

			if(rooms.length === 0) rooms = ["All"];

			var times = _.groupBy(daySch, function(session) {
				return session.get("time").start;
			});

			var html = [];
			_.each(_.sortBy(_.keys(times), function(i) {
				return new Date(i)
			}), function(i) {
				var sessions = [];
				_.each(times[i], function(session) {
					sessions.push(me.sessionTmpl({
						s: session,
						rooms: rooms
					}));
				});
				html.push(me.rowTmpl({
					time: i,
					rooms: rooms,
					sessions: sessions.join("")
				}));
			});
			this.$(".content .daySched-" + day).html(html.join(""));

			//console.groupEnd();
		},

		showDay: function(e) {
			var target = $(e.currentTarget);
			target.parent().find("li").removeClass("active");
			target.addClass("active");
			this.$(".content .daySched").hide();
			this.$(".content").find(target.data("date")).show();
			return false;
		},

		events: {
			"click .nav-tabs li": "showDay"
		}

	});
}(jQuery, Backbone, window.app = window.app || {}));