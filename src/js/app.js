(function() {
	$.ajax({
		url: "config.js",
		dataType: "script",
		success: start,
		cache: true
	});

	function start() {
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
			if(sessions.models.length <= 2) {
				app.replicate(function() {
					sessions.fetch();
				});
			}
		});

		app.sessionList.fetch();

		app.user.id = window.localStorage.getItem("userId");
		if(!app.user.id) {
			app.user.save("browser", navigator.userAgent, {
				success: function() {
					//console.log("Successfully saved userid", app.user.attributes);
					window.localStorage.setItem("userId", app.user.id);

				},
				error: function() {
					alert("Error occured when trying to save the user");
				}
			});
		} else {
			//console.log("Starting out here");
			app.user.fetch();
		}
		Backbone.history.start();
	}

	app.replicate = function(callback, type) {
		Pouch.replicate(CONF.local.userprefs, CONF.remote.userprefs, function() {
			callback("User Perferences");
		});
		Pouch.replicate(CONF.remote.sessions, CONF.local.sessions, function() {
			callback("Session Data");
		});
	};

	app.destroy = function() {
		window.localStorage.clear();
		Pouch.destroy(CONF.local.userprefs, function() {
			console.log("Deleted User Preferences", arguments);
		});
		Pouch.destroy(CONF.local.sessions, function() {
			console.log("Deleted User Preferences", arguments);
		})
	};

	app.loadSampleSessions = function() {
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
	};

}());