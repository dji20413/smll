module.exports = {
	"index" : function(req, res) {
		req.models.package.find({}, function(err, packages) {
			console.log( packages );
			if( err || packages.length == 0 ) {
				res.send(404);
			} else {
				res.render('package/index', {
					packages : packages
				});
			}
		});
	},

	"detail" : function(req, res) {
		req.models.package.get(req.params.package_id, function(err, package) {
				if( err || package.length == 0 ) {
					res.send(404);
				} else {

					req.models.speech.find({package_id: package.id}, function(err, speeches) {
						res.render('package/detail', {
							package  : package,
							speeches : speeches 
						});
					});

				}
		});
	},

	"shop" : {

		"index" : function(req, res) {
			req.models.package.find({}, function(err, packages) {
				console.log( packages );
				if( err || packages.length == 0 ) {
					res.send(404);
				} else {
					res.render('shop/package/index', {
						packages : packages
					});
				}
			}); // end of find
		}, // end of index

		"detail" : function(req, res) {
			req.models.package.get(req.params.package_id, function(err, package) {
				if( err || package.length == 0 ) {
					res.send(404);
				} else {
					req.models.speech.find({package_id: package.id}, function(err, speeches) {
						res.render('shop/package/detail', {
							package  : package,
							speeches : speeches 
						});
					});
				}
			});
		}
	},

	"vendor" : {
		"index" : function(req, res) {
			req.models.package.find({author_id: req.session.user.id}, function(err, packages) {
					if( err || packages.length == 0 ) {
						res.send(404);
					} else {
						res.render('vendor/package/index', {
							packages : packages
						});
					}
			});
		},

		"new" : function(req, res) {
			res.render('vendor/package/new');
		},

		"detail" : function(req, res) {
			req.models.package.get(req.params.package_id, function(err, package) {
				req.models.speech.find({ package_id: package.id }, function(err, speeches) {
					if( err || package.length == 0 ) {
						res.send(404);
					} else {
						res.render('vendor/package/detail', {
							package : package,
							speeches: speeches
						});
					}
				});
			});
		},

		"remove" : function(req, res) {
			req.models.package.get(req.params.package, function(err, package) {
				package.remove( function(err) {
					req.flash('The package is removed successfully.');
					res.send(200);
				});
			});
		},

		"edit" : function(req, res) {
			console.log( enums );	
			req.models.package.get(req.params.package, function(err, package) {
				if( err || !package ) {
					res.redirect('/vendor/package');
				} else {
					res.render('vendor/package/edit', {
						package : package,
						enums   : enums
					});
				}
			});
		},

		"update" : function(req, res) {
			req.models.package.get(req.params.package, function(err, package) {

				if( req.files.file ) {
					var tmp = req.files.file.path;
					var guid = tmp.substr(tmp.length-8, 8);
					fs.renameSync( req.files.file.path, __dirname + '/../public/img/package/'+ guid );
					req.body.picture = guid;
				}

				for (var attr in req.body) {
					 package[attr] = req.body[attr]; 
				}	

				// save
				package.save( function(err) {
					res.header('Location', '/vendor/package/' + package.id);
					res.send("Updated Successfully", 201);	
				});

			});
		},

		"create" : function(req, res) {
			req.body.author_id  = req.session.user.id; 
			req.body.created_at = new Date();
			
			if( !req.body.name ) 
				return res.send("Enter package name", 400);
			if( !req.body.desc) 
				return res.send("Enter package description", 400);
			if( !req.body.language ) 
				return res.send("Enter package language", 400);
			if( !req.body.level) 
				return res.send("Enter level of package", 400);

			// file
			if( req.files.file ) {
				var tmp = req.files.file.path;
				var guid = tmp.substr(tmp.length-8, 8);
				fs.renameSync( req.files.file.path, __dirname + '/../public/img/package/'+ guid );
				req.body.picture = guid;
			}

			req.models.package.create([req.body], function(err, packages) {
					console.log( JSON.stringify(packages) );
					if( err || packages.length == 0) {
						res.send("Failed to create package", 500);
					} else {
						req.flash("New package created");
						res.header('Location', '/vendor/package/'+packages[0].id);
						res.send(201);
					}
			});
		},

	},

	"admin" : {
		"index" : function(req, res) {
			req.models.package.find({}, function(err, packages) {
					if( err || packages.length == 0 ) {
						res.send(404);
					} else {
						res.render('admin/package/index', {
							packages : packages
						});
					}
			});
		},





	}


}
