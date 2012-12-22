(function($, app) {
	"use strict";
	app.View = app.View || {};

	app.View.Admin = Backbone.View.extend({
		initialize: function(config) {
			this.template = this.$("script").text().trim().replace(/\t/g, "");
			this.initModel();
			this.render();
		},

		initModel: function() {
			this.newSession = new app.Model.Session({
				server : CONF.remote.server
			});
		},

		render: function() {
			function flatten(group, obj) {
				return _.flatten(_.map(obj, function(val, key) {
					if(_.isObject(val)) {
						return flatten(key, val);
					} else {
						return group + " " + key;
					}
				}));
			}
			this.$(".adminContent").html(_.template(this.template, {
				fields: flatten('', _.omit(this.newSession.attributes, ['server', 'db']))
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
			return this.sanitize(getValues(this.newSession.attributes));
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
			"click button": "save"
		}
	});

}(jQuery, window.app = window.app || {}));