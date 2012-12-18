Backbone.ajaxSync = Backbone.sync;
Backbone.sync = (function() {
	return function(method, model, options) {
		console.log("Sync - ", method, model, options);
		Pouch(CONFERENCE.server + "/" + CONFERENCE.db.sessions, function(err, db) {
			window.axe = db;
			switch(method) {
			case "read":
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
						options.error(err);
						return;
					}
					//console.log("Updating ", model.toJSON(), model._rev);
					db.put($.extend(model.toJSON(), {
						_rev: resp._rev,
						_id: resp._id
					}), function(err, updatedData) {
						if(err) {
							options.error(err);
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