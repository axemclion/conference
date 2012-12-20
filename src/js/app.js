(function() {
	$.getScript("config.js", function() {
		app.currentViews = [];
		app.router = new app.Router();
		app.sessionList = new app.Collection.SessionList({
			model: app.Model.Session
		}, {
			"server": CONFERENCE.server,
			"db": CONFERENCE.db.sessions
		});
		app.sessionList.fetch();

		app.user = new app.Model.User({
			server : CONFERENCE.server,
			db : CONFERENCE.db.user
		});
		app.user.fetch();

		//app.user.save();
		app.userView = new app.View.User({
			el: "body",
			model: app.user
		});
		Backbone.history.start();
	});
}());