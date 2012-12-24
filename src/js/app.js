(function() {
	$.getScript("config.js", function() {
		app.currentViews = [];
		app.router = new app.Router();

		app.sessionList = new app.Collection.SessionList({
			model: app.Model.Session
		}, {
			"server": CONF.local.sessions,
		});

		app.users = new app.Collection.Users({
			model: app.Model.User
		}, {
			"server": CONF.remote.userprefs
		});

		app.user = new app.Model.User({
			server: CONF.local.userprefs
		});
		app.userView = new app.View.User({
			el: "body",
			model: app.user
		});

		app.sessionList.once("reset", function(sessions) {
			if(sessions.models.length === 0) {
				$("#loader").modal("show");
				Pouch.replicate(CONF.remote.sessions, CONF.local.sessions, function(err, db) {
					app.sessionList.fetch();
					$("#loader").modal("hide");
				});
			} else {
				$("#loader").modal("hide");
			}
		});

		app.user.id = window.localStorage.getItem("userId");
		if(!app.user.id) {
			app.user.save("browser", navigator.userAgent, {
				success: function() {
					console.log("Successfully saved userid", app.user.attributes);
					window.localStorage.setItem("userId", app.user.id);
					app.sessionList.fetch();
				},
				error: function() {
					alert("Error occured when trying to save the user");
				}
			});
		} else {
			app.user.fetch();
			app.sessionList.fetch();
		}


		Backbone.history.start();
	});
}());