function getTimeName(today) {
	return "morning";
}

function getWeekdayName(today) {
	return "mon";
}

function getFeelingName(today, temp, humi) {
	return "warm"; 
}

module.exports = {

	"index" : function(req, res) {
		req.models.device.find({ owner_id : req.session.user.id }, function(err, devices) {
			res.render('device/index', { devices : devices });
		});
	},


	"remove" : function(req, res) {
		req.models.device.find({ 
				owner_id: req.session.user.id, 
				id: req.params.device_id
			}).remove(function(err) {
				if( err ) {
					res.send(500);
				} else {
					res.send(200);
				}
		});
	},

	"new" : function(req, res) {
		res.render('device/new', { enums: enums } );
	},

	"detail" : function(req, res) {
		req.models.device.get(req.params.device, function(err, device) {
			res.render('device/detail', { 
				device : device,
				enums  : enums 
			});
		});
	},

	"edit" : function(req, res) {
		req.models.device.get(req.params.device, function(err, device) {
			res.render('device/edit', { 
				device : device,
				enums  : enums 
			});
		});
	},

	"create" : function(req, res) {
		req.models.device.create([{
			name   			: req.body.name,
			model  			: req.body.model,
			serial 			: req.body.serial,
			ip     			: null,
			where  			: req.body.where,
			lat    			: req.body.lat,
			lon    			: req.body.lon,
			updated_at	: new Date(),   
			created_at  : new Date(), 
			owner_id    : req.session.user.id,		// this should be user id	
			package_id  : null		// first empty 
		}], function(err, devices) {
			if( err || devices.length == 0 ) {
				console.log(err);
				res.send("Failed to create new device", 500);
			} else {
				res.header('Location', '/');
				req.flash('You added a new device.');
				res.send(201);
			}
		});

	},

	"update" : function(req, res) {
		req.models.device.get( req.params.device, function(err, device) {
			for (var attr in req.body) {
				 device[attr] = req.body[attr]; 
			}	
			device.save( function(err) {
				res.send(201);	
			});
		});
	},

	"admin" : {
		"index" : function(req, res) {
			req.models.device.find({}, function(err, devices) {
				res.render('admin/device/index', { devices : devices });
			});
		}
	},

	"ctx" : function(req, res) {

		// find device
		req.models.device.find({serial: req.params.device}, function(err, devices) {

			if( err || devices.length == 0 ) 
				return res.send(404);

			var pkg = devices[0].package_id;

			if( !pkg ) {
				console.log("no package");
				return res.send(404);
			}

			var today   = new Date();

			// basic condition
			var cond = {
				package_id : devices[0].package_id,
				month      : [today.getMonth()+1, 0],
				date       : [today.getDate(), 0],
				weekday_id : [today.getDay()+1, 0]
			};
			
			var url = "http://api.openweathermap.org/data/2.1/find/city";
			url += "?lat=" + devices[0].lat;
			url += "&lon=" + devices[0].lon;
			url += "&cnt=1";

			console.log("[OpenWeather API]");
			console.log(url);

			request(url, function(err, resp, body) {
				if( err || resp.statusCode !== 200 ) 
				{
					console.log(err);
					return res.send(500);
				}

				var raw;
				try {
					raw  = JSON.parse(body);
				} catch(err) {
					console.log(err);
				}

				var temp = raw.list[0].main.temp-273;
				var humi = raw.list[0].main.humidity;
				var weather_name = raw.list[0].weather[0].main;

				console.log(raw);

				async.series([
					function(cb) {
						var str = getTimeName(today); 
						req.models.time.find({name: str}, function(err, results) {
							if( err || results.length == 0 ) return cb(err);
							cond.time_id = [results[0].id, 0];
							cb(null);
						});
					},
					function(cb) {
						req.models.weather.find({name: weather_name}, function(err, weathers) {
							if( err || weathers.length == 0 ) return cb(err);
							cond.weather_id = [weathers[0].id, 0];
							cb(null);
						});
					},
					function(cb) {
						var feeling_name = getFeelingName(today, temp, humi); 
						req.models.feeling.find({name: feeling_name}, function(err, results) {
							if( err || results.length == 0 ) return cb(err);
							cond.feeling_id = [results[0].id, 0];
							cb(null);
						});
					} 
				], function(err, result) {
					
					if( err ) {
						console.log(err);
						return res.send(500);
					}

					// find matching context
					console.log("==[condition]====================");
					console.log( cond );
					console.log("=================================");

					req.models.speech.find(cond, function(err, speechs) {
						console.log( speechs );
						var result = "";
						for(var i in speechs ) {
							result += "!" + speechs[i].file;
						}
						res.send(result);			
					});
				}); // end of async

			}); // end of request

			
		}); // end of get device
	}
}
