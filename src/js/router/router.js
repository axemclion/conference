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

			(function loadPathSegment(i) {
				if(i < path.length) {
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
				}
			}(0));
		}
	});

}(jQuery, window.app = window.app || {}));