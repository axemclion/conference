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