Backbone.ajaxSync = Backbone.sync;
Backbone.sync = (function() {
	return function(method, model, options, error) {
		options.error = options.error ||
		function() {};
		console.log("Sync - ", method, model, options, error);
		Pouch(model.server || model.get("server"), function(err, db) {
			if(err) {
				options.error(err);
				return;
			}
			switch(method) {
			case "read":
				if(model.id) {
					db.get(model.id, {}, function(err, doc) {
						if(err) {
							options.error(err);
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
							options.error(err);
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
						options.error(err);
						return;
					}
					//console.log("Updating ", model.toJSON(), model._rev);
					db.put(_.extend(model.toJSON(), {
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