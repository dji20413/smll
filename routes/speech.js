
module.exports = {

	"create" : function(req, res) {

		if( !req.files.file )  {
			return res.send("You didn't attach the mp3 file", 400);
		}

		var tmp = req.files.file.path;

		// copy tmp file -> file
		var guid = tmp.substr(tmp.length-8, 8);
		var speechDir = __dirname + '/../public/speech';
		var packageDir = speechDir + '/' + req.body.package_id;

		if( !fs.existsSync(speechDir) )
			fs.mkdirSync(speechDir);
		if( !fs.existsSync(packageDir) ) {
			console.log( packageDir );
			fs.mkdirSync( packageDir );
		}

		console.log('from :' + req.files.file.path ); 
		console.log('to   :' + packageDir + '/' + guid ); 

		fs.renameSync( req.files.file.path, packageDir + '/' + guid );

		// Need to be moved to file server
		req.body.file = guid; 

		async.series([
			function(cb) {
				req.models.time.get( req.body.time_id, function(err, time) { 
					console.log(time);
					if( !err && time ) cb(null, time.score);
					else cb(null, 0);
			})},
			function(cb) {
				req.models.weekday.get( req.body.weekday_id, function(err, weekday) { 
					if( !err && weekday ) cb(null, weekday.score);
					else cb(null, 0);
			})},
			function(cb) {
				req.models.feeling.get( req.body.time_id, function(err, feeling) { 
					if( !err && feeling ) cb(null, feeling.score);
					else cb(null, 0);
			})},
			function(cb) {
				req.models.weather.get( req.body.weather_id, function(err, weather) { 
					if( !err && weather ) cb(err, weather.score);
					else cb(null, 0);
			})}
		], function(err, result) {

			req.body.score = result[0] + result[1] + result[2] + result[3];
			req.models.speech.create([req.body], function(err, speeches) {
				if( err || speeches.length == 0 ) {
					console.log(err);
					res.send(500);
				} else {
					res.header("Location", "/vendor/package/" + req.body.package_id);
					res.send(201);
				}
			});
		});
	},

	"remove" : function(req, res) {
		req.models.speech.get(req.params.speech, function(err, speech) {
			speech.remove( function(err) {
				req.flash('The speech has been removed successfully.');
				res.header('Location', '/vendor/package/' + speech.package_id);
				res.send(201);
			});
		});
	},

	"new" : function(req, res) {
		console.log( enums );	

		async.series([
			function(cb) { req.models.time.find({}, function(err, times) { cb(err, times);}); },
			function(cb) { req.models.weekday.find({}, function(err, weekdays) { cb(err, weekdays);}); },
			function(cb) { req.models.feeling.find({}, function(err, feelings) { cb(err, feelings);}); },
			function(cb) { req.models.weather.find({}, function(err, weathers) { cb(err, weathers);}); },
		], function(err, result) {
			if( err ) {
				console.log(err);
				res.send(500);
			} else {
				req.models.package.get(req.params.package, function(err, package) {
					res.render('speech/new', {
						package  : package,
						times    : result[0],
						weekdays : result[1],
						feelings : result[2],
						weathers : result[3],
						enums    : enums
					});
				});
			}
		});

	},

	"update" : function(req, res) {

		console.log("PUT speech");
		console.log(req.body);
		req.models.speech.get(req.params.speech, function(err, speech) {
	
			if( req.files.file ) {
				var tmp = req.files.file.path;
				// copy tmp file -> file
				var guid = tmp.substr(tmp.length-8, 8);
				var speechDir = __dirname + '/../public/speech';
				var packageDir = speechDir + '/' + req.body.package_id;
				fs.renameSync( req.files.file.path, packageDir + '/' + guid );
				// Need to be moved to file server
				req.body.file = guid; 
			} 

			for (var attr in req.body) {
				 speech[attr] = req.body[attr]; 
			}
			speech.save( function(err) {
				if( err ) {
					res.send("Save error", 400);	
				} else {
					res.send("Updated Successfully", 201);	
				}
			});

		});

	},

	"edit" : function(req, res) {

		async.series([
			function(cb) {
				req.models.time.find({}, function(err, results) { cb(null, results); });
			},
			function(cb) {
				req.models.weekday.find({}, function(err, results) { cb(null, results); });
			},
			function(cb) {
				req.models.feeling.find({}, function(err, results) { cb(null, results); });
			},
			function(cb) {
				req.models.weather.find({}, function(err, results) { cb(null, results); });
			}
		], function(err, results) {
			
			req.models.package.get(req.params.package, function(err, package) {
				req.models.speech.get(req.params.speech, function(err, speech) {
					res.render('speech/edit', {
						package  : package,
						speech   : speech,
						times    : results[0],
						weekdays : results[1],
						feelings : results[2],
						weathers : results[3],
						months   : enums.month,
						dates    : enums.date
					});
				});
			});

		});
		
	}

}
