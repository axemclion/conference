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
				app.loadSessionsFromFile();
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

		app.loadSessionsFromFile = function(callback) {
			$("#loader").modal("show");
			$.getScript("sessions.js?" + Math.random()).then(function(data) {
				$("#loader").modal("hide");
				_.each(CONF.sessions, function(s) {
					var models = app.sessionList.where({
						name: s.name
					});
					if(models.length === 0) {
						model = new app.Model.Session();
					} else {
						model = models[0];
					}
					model.set(s);
					model.server = CONF.local.sessions;
					model.save();
					app.sessionList.add(model);
				});
				app.sessionList.fetch();
				_.isFunction(callback) && callback();
			}).fail(function() {
				alert("Could not load sessions");
			});
		}

		app.replicate = function(callback, type) {
			app.loadSessionsFromFile(function() {
				callback("Sessions Data");
			})
			Pouch.replicate(CONF.local.userprefs, CONF.remote.userprefs, function() {
				callback("User Perferences");
			});
		}

		Backbone.history.start();
	});
}());