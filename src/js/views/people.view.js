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