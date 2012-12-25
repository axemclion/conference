(function($, app) {
	app.Collection = app.Collection || {};
	app.Collection.SessionList = Backbone.Collection.extend({
		model: app.Model.Session,
		initialize: function(models, options) {
			this.server = options.server;
		},

		getSpeakers: function(id) {
			if(id) {
				var s = this.get(id);
				return s ? [_.extend({
					id: id,
					sessionName: s.get("name")
				}, s.get("speaker"))] : [];
			} else {
				return _.uniq(_.compact(_.map(this.toJSON(), function(session) {
					if(session.speaker && session.speaker.name) {
						return _.extend({
							id: session.id,
							sessionName: session.name
						}, session.speaker);
					}
				})), function(s) {
					return s.url;
				});
			}
		},

		getSessions: function(id) {
			if(id) {
				var res = this.get(id);
				return res ? [res.toJSON()] : [];
			} else {
				return _.filter(this.toJSON(), function(session) {
					return !!session.speaker.name;
				});
			}
		}
	});

}(jQuery, window.app = window.app || {}));