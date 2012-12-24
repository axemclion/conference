(function($, app) {
	app.Collection = app.Collection || {};
	app.Collection.SessionList = Backbone.Collection.extend({
		model: app.Model.Session,
		initialize: function(models, options) {
			this.server = options.server;
		},

		getSpeakers: function(url) {
			return _.compact(_.map(this.toJSON(), function(session) {
				if(session.speaker && session.speaker.name) {
					if((url && decodeURIComponent(url) === session.speaker.url) || !url) {
						return _.extend({
							id: session.id,
							sessionName: session.name
						}, session.speaker);
					}
				}
			}));
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