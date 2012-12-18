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
			this.initModel();
			this.render();
			app.sessionList.on("sync", this.render);
		},

		initModel: function() {
			this.newSession = new app.Model.Session();
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

		getFormValues: function() {
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
			return this.sanitize(getValues(this.fields));
		},

		sanitize: function(val) {
			if(!_.isArray(val.tags)) {
				val.tags = _.compact(val.tags.split(/[\s;,]/g));
			}
			if(!_.isDate(val.time.start)) {
				val.time.start = new Date(val.time.start);
			}
			if(!_.isDate(val.time.end)) {
				val.time.end = new Date(val.time.end);
			}
			return val;
		},

		save: function(e) {
			this.$(".submit").html("Update");
			this.newSession.save(this.getFormValues(), {
				success: _.bind(this.saved, this, true),
				error: _.bind(this.saved, this, false)
			});
			this.initModel();
			return false;
		},

		saved: function(status) {
			this.$(".alert").hide();
			this.$(".alert-" + (status ? "success" : "error")).show();
			this.$(".alert").delay("5000").fadeOut();
		},

		events: {
			"click .submit": "save"
		}
	});

}(jQuery, window.app = window.app || {}));