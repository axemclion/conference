(function($, Backbone, app) {
	"use strict";
	app.View = app.View || {};

	app.View.User = Backbone.View.extend({
		initialize: function() {
			_.bindAll(this);
			this.render();
			this.model.on("change:name", this.showName);
		},

		render: function() {
			this.showName();
		},

		showName: function() {
			var me = this;
			$(".userId").each(function(el) {
				var $this = $(this);
				var template = _.template($this.find("script").text().trim().replace(/\t/g, ""));
				$this.find(".userName").html(template({
					userName: me.model.get("name")
				}));
			});
		},

		changeName: function() {
			this.model.set("name", prompt("Enter a name") || this.model.get("name"));
		},

		events: {
			"click .userId": "changeName"
		}

	});
}(jQuery, Backbone, window.app = window.app || {}));