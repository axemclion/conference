(function() {
	$.getScript("config.js", function() {
		app.currentViews = [];
		app.router = new app.Router();

		app.sessionList = new app.Collection.SessionList({
			model: app.Model.Session
		}, {
			"server": CONF.remote.sessions,
		});

		app.user = new app.Model.User({
			server : CONF.remote.userprefs
		});

		app.userView = new app.View.User({
			el: "body",
			model: app.user
		});

		app.sessionList.fetch();
		Backbone.history.start();
	});
}());