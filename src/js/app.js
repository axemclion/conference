(function() {
	$.getScript("config.js", function() {
		app.currentViews = [];
		app.router = new app.Router();
		app.sessionList = new app.Collection.SessionList({
			"server" : "http://localhost:2020",
			"db" : "sessions"
		});
		Backbone.history.start();
	});
}());