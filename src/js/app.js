(function() {
	$.getScript("config.js", function() {
		app.router = new app.Router();
		Backbone.history.start();
	});
}());