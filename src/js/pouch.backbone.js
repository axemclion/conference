Backbone.ajaxSync = Backbone.sync;
Backbone.sync = (function() {
	return function(method, model, options) {
		console.log("Trying to Sync Sessions.collection", arguments);
		Pouch(CONFERENCE.server + "/" + CONFERENCE.db.sessions, function(err, db) {
			switch(method) {
			case "read":
				db.allDocs({
					include_docs: true
				}, function(err, resp) {
					if(err) {
						console.log("Error - ", err);
						options.error(err);
					} else {
						console.log("Got response", resp);
						options.success(_.map(resp.rows, function(obj, i, list) {
							return obj.doc;
						}));
					}
				});
				break;
			case "create":
				db[model.id ? "put" : "post"](model, function(err, resp) {
					model.id = resp.id;
					options.success(model.toJSON());
				});
				break;
			case "update":
			case "delete":
				throw method + " not allowed";
			}
		});
	}
})();