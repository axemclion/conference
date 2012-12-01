(function($, app) {
	"use strict";
	app.View = app.View || {};

	app.View.Admin = Backbone.View.extend({
		fields: {
			name: "name",
			description: "description",
			speaker: {
				name: "speakerName",
				bio: "speakerBio",
				url: "speakerUrl",
				pic: "speakerPic"
			},
			time: {
				start: "startTime",
				end: "endTime"
			},
			slideUrl: "slideUrl",
			room: "room",
			tags: "tags",
			category: "category"
		},

		initialize: function(config) {
			this.template = this.$("script").text().trim().replace(/\t/g, "");
			_.mixin({
				capitalize: function(string) {
					return string.charAt(0).toUpperCase() + string.substring(1).replace(/([A-Z])/g, " $1");
				}
			});
			this.render();
		},

		render: function() {
			function flatten(obj) {
				return _.flatten(_.map(obj, function(val, key) {
					if(_.isObject(val)) {
						return flatten(val);
					} else {
						return val;
					}
				}));
			}
			this.$(".content").html(_.template(this.template, {
				fields: flatten(this.fields)
			}));
		},

		save: function() {
			var me = this;

			function getValues(obj) {
				var result = {};
				_.each(obj, function(val, key, list) {
					if(_.isObject(val)) {
						result[key] = getValues(val);
					} else {
						result[key] = me.$("#session_" + val).val();
					}
				});
				return result;
			}
			var session = new app.Model.Session(getValues(this.fields));
			session.on("all", function() {
				console.log(arguments);
			});
			session.save();
			return false;
		},

		events: {
			"click button": "save"
		}
	});

}(jQuery, window.app = window.app || {}));