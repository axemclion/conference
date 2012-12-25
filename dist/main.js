(function($, app, undefined) {
	"use strict";
	app.Model = app.Model || {};
	app.Model.Session = Backbone.Model.extend({
		defaults: {
			name: '',
			description: '',
			speaker: {
				name: '',
				bio: '',
				url: '',
				pic: ''
			},
			time: {
				start: new Date(),
				end: new Date()
			},
			slideUrl: '',
			room: "",
			tags: [],
			category: ''
		}
	});
}(jQuery, window.app = window.app || {}));

_.mixin({
	capitalize: function(string) {
		return string.charAt(0).toUpperCase() + string.substring(1).replace(/([A-Z])/g, " $1");
	}
});
(function($, app, undefined) {
	"use strict";
	app.Model = app.Model || {};
	app.Model.User = Backbone.Model.extend({
		defaults: {
			name: "Anonymous",
			sessions: {},
			people : {}
		}
	});
}(jQuery, window.app = window.app || {}));
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
(function($, app) {
	app.Collection = app.Collection || {};
	app.Collection.Users = Backbone.Collection.extend({
		model: app.Model.User,
		initialize: function(models, options) {
			this.server = options.server;
		}
	});

}(jQuery, window.app = window.app || {}));
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
				server: CONF.remote.sessions
			});
		},

		render: function() {
			function flatten(group, obj) {
				return _.flatten(_.map(obj, function(val, key) {
					if(_.isObject(val) && !_.isDate(val) && !_.isArray(val)) {
						return flatten(key, val);
					} else {
						return group + key;
					}
				}));
			}
			this.$(".adminContent").html(_.template(this.template, {
				fields: flatten('', _.omit(this.newSession.attributes, ['server']))
			}));
		},

		getFormValues: function() {
			var me = this;

			function getValues(group, obj) {
				var result = {};
				_.each(obj, function(val, key, list) {
					console.log("#session_" + group + key);
					if(_.isObject(val) && !_.isDate(val) && !_.isArray(val)) {
						result[key] = getValues(key, val);
					} else {
						result[key] = me.$("#session_" + group + key).val();
					}
				});
				return result;
			}
			return this.sanitize(getValues('', _.omit(this.newSession.attributes, ['server'])));
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
(function($, Backbone, app) {
	"use strict";
	app.View = app.View || {};

	app.View.User = Backbone.View.extend({
		initialize: function() {
			_.bindAll(this);
			this.render();
			this.model.on("change:name", this.showName);
			this.userDetailsTmpl = _.template(this.$("script.userDetailsTmpl").text().trim().replace(/\t/g, ""));
			this.initPopovers();
		},

		initPopovers: function() {
			$(".btnOnline, .btnOffline").popover();
		},

		render: function() {
			this.showName();
		},

		showName: function() {
			var me = this;
			var template = _.template(this.$("script.userNameTmpl:first").text().trim().replace(/\t/g, ""));
			$(".userName").each(function(i, el) {
				$(el).html(template({
					userName: me.model.get("name")
				}));
			});
			$(".remoteProfile").attr("href", "http://axemclion.iriscouch.com/_utils/document.html?userprefs/" + window.localStorage.getItem("userId"));
		},

		message: function(msg, type) {
			$("#docMessage").html(msg).addClass(type);
		},

		adminPage: function() {

		},

		changeName: function() {
			this.model.set("name", prompt("Enter a name", this.model.get("name")) || this.model.get("name"));
			this.model.save();
			return false;
		},

		changeUser: function() {
			window.localStorage.setItem("userId", prompt("Enter an existing User ID", this.model.id));
			//window.location.reload();
		},

		newSession: function() {
			window.localStorage.removeItem("userId");
			Pouch.destroy(CONF.local.userprefs, function(err, info) {
				if(err) {
					alert("Could not delete local IndexedDB");
				} else {
					window.location.reload();
				}

			});
		},

		sync: function(e) {
			var target = $(e.currentTarget);
			app.ONLINE = !target.hasClass("btnOffline");
			var popover = target.next(".popover");
			popover.find("button.close").length === 0 && popover.prepend("<button type='button' class='close' data-dismiss='alert'>&times;</button>");
			app.replicate(function(text) {
				popover.find(".popover-content").append("<br/>&#10003;  " + text);
			});
			
		},

		showUserDetails: function(e) {
			var me = this;
			var target = $(e.currentTarget).popover({
				content: function() {
					return me.userDetailsTmpl({
						u: me.model,
						CONF: CONF
					})
				}
			});
			var popover = target.next(".popover");
			popover.find("button.close").length === 0 && popover.prepend("<button type='button' class='close' data-dismiss='alert'>&times;</button>");

		},

		events: {
			"click .user-options .change-name": "changeName",
			"click .user-options .new-session": "newSession",
			"click .user-options .existing-user": "changeUser",
			"click .user-options .admin-user": "adminPage",
			"click .user-options .userDetails": "showUserDetails",

			"click .btnConnection .btnOnline": "sync",
			"click .btnConnection .btnOffline": "sync"
		}

	});
}(jQuery, Backbone, window.app = window.app || {}));
(function($, Backbone, app) {
	"use strict";
	app.View = app.View || {};

	app.View.Notes = Backbone.View.extend({
		initialize: function() {
			_.bindAll(this);
			this.lineItem = _.template(this.$("script").text().trim().replace(/\t/g, ""));
			this.render();
			this.listenTo(this.collection, "reset", this.render);
		},

		render: function(from) {
			this.$(".sessionContent").empty();
			var data = _.compact(_.map(app.user.get("sessions"), function(v, k) {
				v.id = k;
				return v.notes ? v : null
			}));
			_.each(data, this.addNotes);
		},

		addNotes: function(session) {
			session && this.$(".sessionContent").append(this.lineItem({
				s: _.extend(this.collection.get(session.id).toJSON(), session),
			}));
		},

		toggleEditor: function(e) {
			var root = $(e.currentTarget).parents("li")
			root.find(".edit-notes").toggle();
			root.find(".editor").toggle();
		},

		saveNotes: function(e) {
			var root = $(e.currentTarget).parents("li");
			var s = app.user.get("sessions");
			s[root.data("sessionid")].notes = root.find("textarea").val();
			root.find(".edit-notes").html(s[root.data("sessionid")].notes);
			app.user.set("sessions", s);
			app.user.save();
			this.toggleEditor(e);
		},

		cancelNotes: function(e) {
			this.toggleEditor(e);
			var root = $(e.currentTarget).parents("li");
			root.find("textarea").val(root.find(".edit-notes").html().trim());
		},

		events: {
			"click .edit-notes": "toggleEditor",
			"click .save-notes": "saveNotes",
			"click .cancel-notes": "cancelNotes"
		}

	});
}(jQuery, Backbone, window.app = window.app || {}));
(function($, Backbone, app) {
	"use strict";
	app.View = app.View || {};

	app.View.People = Backbone.View.extend({
		initialize: function() {
			_.bindAll(this);
			this.listenTo(app.user, "change:people", this.renderUser);
			this.renderUser();
			this.renderUserTypeAhead();
		},

		renderUserTypeAhead: function() {
			app.users.fetch();
			this.listenTo(app.users, "reset", function() {
				$(".new-person").typeahead({
					source: app.users.pluck("name")
				});
			});
		},

		renderUser: function(from) {
			this.$(".username").html(app.user.get("name"));
			this.$(".userid").html(app.user.id);
			var template = _.template(this.$("script").text().trim().replace(/\t/g, ""));
			this.$(".people-met").html(template({
				people: app.user.get("people")
			}));
		},

		changeProp: function(id, val) {
			var people = app.user.get("people");
			if(val === false) {
				delete people[id];
			} else {
				people[id] = _.extend(val, {
					updated: new Date()
				});
			}
			app.user.set("people", people);
			this.renderUser();
			app.user.save();
		},

		createNewPerson: function() {
			var text = this.$("input.new-person");
			var id = text.val();
			var matches = app.users.where({
				name: id
			});
			if(matches) {
				matches = matches[0].toJSON();
				id = matches.id;
			}
			this.changeProp(id, {
				created: new Date(),
				name: matches ? matches.name : ""
			});
			this.$(".other-person").hide();
			var div = this.$(".other-person-met").show();
			div.find(".new-person").html(id);
			div.find(".editDetailsLink").data("id", id);
		},

		saveNotes: function() {
			var modal = this.$("#newPersonDetails");
			this.changeProp(modal.data("id"), {
				name: modal.find(".inputName").val(),
				met: modal.find(".inputMet").val(),
				notes: modal.find(".inputNotes").val()
			});
		},

		editDetails: function(e) {
			var id = $(e.currentTarget).data("id");
			var modal = this.$("#newPersonDetails").data("id", id);
			var people = app.user.get("people")[id];
			modal.find(".inputName").val(people.name || "");
			modal.find(".inputMet").val(people.met || "");
			modal.find(".inputNotes").val(people.notes || "");
			modal.find(".inputId").html(id);
		},

		removePerson: function(e) {
			this.changeProp($(e.currentTarget).data("id"), false);
			return false
		},

		events: {
			"click .btnNewPerson": "createNewPerson",
			"click .editDetailsLink": "editDetails",
			"click .save-notes": "saveNotes",
			"click .remove-person": "removePerson"
		}

	});
}(jQuery, Backbone, window.app = window.app || {}));
(function($, Backbone, app) {
	"use strict";
	app.View = app.View || {};

	app.View.Schedule = Backbone.View.extend({
		initialize: function() {
			_.bindAll(this);
			this.sessionTmpl = this.getTemplate("session");
			this.rowTmpl = this.getTemplate("row");
			this.dayTmpl = this.getTemplate("day");

			this.toolbar = new app.View.UserPrefs({
				el: this.$el,
				model: app.user
			});
			app.currentViews.push(this.toolbar);

			this.render();
			this.listenTo(this.collection, "reset", this.render);
		},

		getTemplate: function(className) {
			return _.template(this.$("script." + className).text().trim().replace(/\t/g, ""));
		},

		render: function() {
			var me = this;
			var days = _.groupBy(this.collection.models, function(s) {
				var time = s.get("time").start || new Date();
				return moment(time).format("YYYY-MM-DD");
			});

			this.$(".content").html(this.dayTmpl({
				days: days
			}));

			_.each(days, this.renderDay);
			this.toolbar.setStates();


			window.setTimeout(function() {
				this.$(".content .nav-tabs li:first").click();
			}, 100);
		},

		renderDay: function(daySch, day) {
			//console.group(day);
			var me = this;
			var rooms = _.reject(_.uniq(_.map(daySch, function(session) {
				return session.get("room");
			})), function(roomName) {
				return roomName === "*";
			});

			if(rooms.length === 0) rooms = ["All"];

			var times = _.groupBy(daySch, function(session) {
				return session.get("time").start;
			});

			var html = [];
			_.each(_.sortBy(_.keys(times), function(i) {
				return new Date(i)
			}), function(i) {
				var sessions = [];
				_.each(times[i], function(session) {
					sessions.push(me.sessionTmpl({
						s: session,
						rooms: rooms,
						userPrefsToolbar: me.toolbar.getHTML(session.toJSON())
					}));
				});
				html.push(me.rowTmpl({
					time: i,
					rooms: rooms,
					sessions: sessions.join("")
				}));
			});
			this.$(".content .daySched-" + day).html(html.join(""));

			//console.groupEnd();
		},

		showDay: function(e) {
			var target = $(e.currentTarget);
			target.parent().find("li").removeClass("active");
			target.addClass("active");
			this.$(".content .daySched").hide();
			this.$(".content").find(target.data("date")).show();
			return false;
		},

		events: {
			"click .nav-tabs li": "showDay"
		}

	});
}(jQuery, Backbone, window.app = window.app || {}));
(function($, Backbone, app) {
	"use strict";
	app.View = app.View || {};

	app.View.Sessions = Backbone.View.extend({
		initialize: function() {
			_.bindAll(this);
			this.lineItem = _.template(this.$("script").text().trim().replace(/\t/g, ""));
			this.toolbar = new app.View.UserPrefs({
				el: this.$el,
				model: app.user
			});
			app.currentViews.push(this.toolbar);
			this.render();
			this.listenTo(this.collection, "reset", this.render);

			this.listenTo(this, "navigate", this.onNavigate);
			this.path = undefined;
		},

		render: function(from) {
			this.$(".sessionContent").empty();
			var data = this.options.dataFunc.call(this.collection, this.item);
			_.each(data, this.addSession);
			this.toolbar.setStates();
		},

		addSession: function(s) {
			s && this.$(".sessionContent").append(this.lineItem({
				s: s,
				userPrefsToolbar: this.toolbar.getHTML(s)
			}));
		},

		onNavigate: function(path) {
			if(!path[2]) {
				return;
			}
			this.$(".viewall").show();
			var me = this;
			this.$(".sessionContent li").hide();
			_.each(this.options.dataFunc.call(this.collection, path[2]), function(val, key) {
				me.$("#item-" + val.id).show();
			});
		}

	});
}(jQuery, Backbone, window.app = window.app || {}));
(function($, Backbone, app) {
	"use strict";
	app.View = app.View || {};

	app.View.UserPrefs = Backbone.View.extend({
		initialize: function(options) {
			_.bindAll(this);
			this.listenTo(this.model, "change:sessions", this.setStates);
			this.lineItem = _.template($("script.userPrefsToolbar").text().replace(/\t/g, ""));
		},

		getHTML: function(session) {
			return this.lineItem({
				s: session
			});
		},

		setStates: function() {
			this.$(".btnStar").each(this.renderStar);
			this.$(".btnLikeUnlike").each(this.renderLikeUnlike);
		},

		renderStar: function(i, el) {
			var $el = $(el);
			var data = this.model.get("sessions")[$el.data("sessionid")];
			if(data) {
				$el.addClass(data.star ? "active btn-info" : "");
			}
		},

		renderLikeUnlike: function(i, el) {
			var $el = $(el);
			var data = this.model.get("sessions")[$el.children(".btnLike").data("sessionid")];
			if(data) {
				data.like === 1 && $el.children(".btnLike").addClass("btn-success active");
				data.like === -1 && $el.children(".btnUnlike").addClass("btn-danger active");
			}
		},

		onThumbs: function(e) {
			var target = $(e.currentTarget);
			var isOn = target.hasClass("on");
			target.parent().children(".btnLike, .btnUnlike").removeClass("on btn-success btn-danger active");
			if(!isOn) {
				target.addClass("on active " + (target.hasClass("btnLike") ? "btn-success" : "btn-danger"));
			}
			this.changeProp(target, "like", target.hasClass("btn-success") ? 1 : target.hasClass("btn-danger") ? -1 : 0);
			return false;
		},

		onStar: function(e) {
			var target = $(e.currentTarget)
			target.toggleClass("btn-info");
			this.changeProp(target, "star", !target.hasClass("active"));
		},

		changeProp: function(target, prop, val) {
			var sessionId = target.data("sessionid");
			var sessions = this.model.get("sessions");
			if(typeof sessions[sessionId] === "undefined") {
				sessions[sessionId] = {};
			}
			sessions[sessionId][prop] = val;
			this.model.save();
			app.ONLINE && Pouch.replicate(CONF.local.userprefs, CONF.remote.userprefs, function() {
				console.log("Replicated User prefs");
			});
		},

		showNotes: function(e) {
			var modal = $("#notesModal").on("hidden.notes", this.onNotesClosed);
			var sessionId = $(e.currentTarget).data("sessionid")
			modal.data("sessionid", sessionId);
			var sessions = this.model.get("sessions");
			if(typeof sessions[sessionId] === "undefined") {
				return;
			}
			modal.find(".session-notes").val(sessions[sessionId].notes || "");
			modal.find(".session-title").html($(e.currentTarget).data("title"));
		},

		onNotesClosed: function(e) {
			var modal = $("#notesModal").off("hidden.notes");
			this.changeProp(modal, "notes", modal.find("textarea").val());
		},

		events: {
			"click .btnLike": "onThumbs",
			"click .btnUnlike": "onThumbs",
			"click .btnStar": "onStar",
			"click .btnNotes": "showNotes"
		}

	});
}(jQuery, Backbone, window.app = window.app || {}));
(function($, app) {
	function loading(amt) {
		$("#loading").show();
		$("#loading .bar").css("width", amt + "%");
		if(amt === 100) {
			$("#loading").delay(500).fadeOut("fast");
		}
	}

	app.Router = Backbone.Router.extend({
		routes: {
			"*actions": "defaultRoute"
		},

		defaultRoute: function(actions) {
			var path = _.compact(actions.split("/"));
			console.log("Showing - ", path);
			_.each(app.currentViews, function(view) {
				view.remove();
			});
			app.currentViews = [];
			(function loadPathSegment(i) {
				if(i < path.length && i < 2) {
					$(".level" + i + "Nav").children("li").removeClass("active");
					$(".level" + i + "Nav").find("a[href*=" + path[i] + "]").parent("li").addClass("active");
					$(".level" + i + "Content").load("pages/" + path[i] + ".html", function() {
						loadPathSegment(i + 1);
					});
				} else {
					var content = $(".level" + i + "Content").children("link[rel=defaultContent]");
					if(content.length > 0) {
						window.location = content.attr("href");
					}
					_.each(app.currentViews, function(view) {
						window.setTimeout(function() {
							view.trigger("navigate", path);
						}, 1);
					});
				}
			}(0));
		}
	});

}(jQuery, window.app = window.app || {}));
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
				app.loadSessionsFromFile();
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
}());
Backbone.ajaxSync = Backbone.sync;
Backbone.sync = (function() {
	return function(method, model, options, error) {
		var error = options.error ||
		function(err) {
			console.error("Error occured when ", method, err, model);
		};
		console.log("Sync - ", method, model.attributes, options);
		Pouch(model.server || model.get("server"), function(err, db) {
			if(err) {
				error(err);
				return;
			}
			switch(method) {
			case "read":
				if(model.id) {
					db.get(model.id, {}, function(err, doc) {
						if(err) {
							error(err);
							return;
						}
						doc.id = doc._id;
						options.success(doc);
					});
				} else {
					db.allDocs({
						include_docs: true
					}, function(err, resp) {
						if(err) {
							error(err);
							return;
						}
						options.success(_.map(resp.rows, function(a) {
							a.doc.id = a.doc._id;
							return a.doc;
						}));
					});
				}
				break;
			case "create":
				db[model.id ? "put" : "post"](model, function(err, resp) {
					model.id = resp.id;
					//console.log("Created model", model.toJSON());
					options.success(model.toJSON());
				});
				break;
			case "update":
				//console.log("Getting model id", model.id);
				db.get(model.id, function(err, resp) {
					if(err) {
						error(err);
						return;
					}
					//console.log("Updating ", model.toJSON(), model._rev);
					db.put(_.extend(model.toJSON(), {
						_rev: resp._rev,
						_id: resp._id
					}), function(err, updatedData) {
						if(err) {
							error(err);
							return;
						}
						//console.log("Updated data ", updatedData);
						options.success(model.toJSON());
					});
				});
				break;
			case "delete":
				throw method + " not allowed";
			}
		});
	}
})();