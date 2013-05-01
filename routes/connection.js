
module.exports = {
	"new" : function(req, res) {
		// :id means device id

		async.series([
			function(cb) {
				req.models.package.get(req.query.pid, function(err, package) {
					if( err || !package )
						cb(err);
					else
						cb(null, package);
				});

			},
			function(cb) {
				req.models.device.find({owner_id: req.session.user.id }, function(err, devices) {
					if( err || devices.length == 0 )
						cb(err);
					else
						cb(null, devices);
				});
			}
		], function(err, result) {

			if( err ) {
				res.send(404);
			} else {
				res.render("connection/new", {
					package : result[0], 
					devices : result[1] 
				});
			}
		});

	},

	"create" : function(req, res) {
		// :id means device id

		console.log( req.body );

		req.models.device.get(req.body.device_id, function(err, device) {
			device.package_id = req.body.package_id;
			device.save( function(err) {
				if( err )  {
					console.log(err);
					res.send("Wrong Request", 500);
				}
				else {
					res.header('Location', '/');
					res.send(200);
				}
			});
		});

	},

	"remove" : function(req, res) {

		req.models.device.get(req.params.device_id, function(err, device) {
			device.package_id = null; 
			device.save( function(err) {
				if( err )  {
					console.log(err);
					res.send("Wrong Request", 500);
				}
				else {
					res.send(200);
				}
			});

		});
		res.send(200);
	}

}
