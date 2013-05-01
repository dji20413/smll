console.log("smll db-deploy 0.1.0");

var orm   = require('orm');
var async = require('async');
var mot = require('./model-template');

console.log("connect...");
orm.connect("mysql://root:audghk02@127.0.0.1/smll", function (err, db) {
		
	if( err ) {
		console.log( err );
		return;
	}

	console.log("mysql ok");
	
	var User = db.define('user', mot.user.fields, { autoFetch : true });
	var Package = db.define('package', mot.package.fields, { autoFetch : true });
	var Speech = db.define('speech', mot.speech.fields, { autoFetch : true });
	var Device = db.define('device', mot.device.fields, { autoFetch : true });

	var Time    = db.define('time', mot.time.fields, { autoFetch : true });
	var Weekday = db.define('weekday', mot.weekday.fields, { autoFetch : true });
	var Feeling = db.define('feeling', mot.feeling.fields, { autoFetch : true });
	var Weather = db.define('weather', mot.weather.fields, { autoFetch : true });

	// association
	Device.hasOne('owner', User)
	Package.hasOne('author', User)
	Speech.hasOne('package', Package)
	Device.hasOne('package', Package)

	Speech.hasOne('time', Time);
	Speech.hasOne('weekday', Weekday);
	Speech.hasOne('feeling', Feeling);
	Speech.hasOne('weather', Weather);

	async.series([
		function(cb) {
			console.log("create user table");
			User.drop(function(err) {
				User.sync( function(err) { return cb(null); });
			});
		},
		function(cb) {
			console.log("create package table");
			Package.drop(function(err) {
				Package.sync( function(err) { return cb(null); });
			});
		},
		function(cb) {
			console.log("create speech table");
			Speech.drop(function(err) {
				Speech.sync( function(err) { return cb(null); });
			});
		},
		function(cb) {
			console.log("create device table");
			Device.drop(function(err) {
				Device.sync( function(err) { return cb(null); });
			});
		},
		function(cb) {
			console.log("create time table");
			Time.drop(function(err) {
				Time.sync( function(err) { return cb(null); });
			});
		},
		function(cb) {
			console.log("create weekday table");
			Weekday.drop(function(err) {
				Weekday.sync( function(err) { return cb(null); });
			});
		},
		function(cb) {
			console.log("create feeling table");
			Feeling.drop(function(err) {
				Feeling.sync( function(err) { return cb(null); });
			});
		},
		function(cb) {
			console.log("create weather table");
			Weather.drop(function(err) {
				Weather.sync( function(err) { return cb(null); });
			});
		}
	], function(err, result) {
			console.log("Completed");

			async.waterfall([
				
				// time 
				function(cb) {
					var arr = [
							{ name : "morning",   score: 5 },
							{ name : "noon",      score: 5 },
							{ name : "afternoon", score: 5 },
							{ name : "evening",   score: 5 },
							{ name : "night",     score: 5 }
						];
					Time.create(arr, function(err, times) {
							return cb(null);
					});
				},

				// weekday 
				function(cb) {
					
					var arr = [
							{ name : "sun", score: 5 },
							{ name : "mon", score: 5 },
							{ name : "tue", score: 5 },
							{ name : "wed", score: 5 },
							{ name : "thu", score: 5 },
							{ name : "fri", score: 5 },
							{ name : "sat", score: 5 }
						];
					Weekday.create(arr, function(err, weekdays) {
							return cb(null);
					});
				},

				// feeling 
				function(cb) {
					var arr = [
							{ name : "warm", score: 5 },
							{ name : "cold", score: 5 }
						];
					Feeling.create(arr, function(err, feelings) {
							return cb(null);
					});
				},

				// weather 
				function(cb) {
					var arr = [
							{ name : "Clear",  score: 5 },
							{ name : "Clouds", score: 5 }
						];
					Weather.create(arr, function(err, weathers) {
							return cb(null);
					});
				},

				// user
				function(cb) {
					var arr = [
							{ name: "admin", email: "admin", password: "asdf", verify: "asdf", type: "normal", created_at : new Date() },
							{ name: "vendor", email: "vendor", password: "asdf", verify: "asdf", type: "normal", created_at : new Date() },
							{ name: "user", email: "user", password: "asdf", verify: "asdf", type: "normal", created_at : new Date() }
						];
					User.create(arr, function(err, users) {
						cb(null, users[0]);
					});
				},
				
				// package
				function(user, cb) {

					var ar_packages = [
							{name: "package#1", desc: "hello",language: "English", level: "basic", created_at : new Date(),author_id  : user.id},
							{name: "package#2", desc: "hello",language: "Japanese", level: "basic", created_at : new Date(),author_id  : user.id},
							{name: "package#3", desc: "hello",language: "Korean", level: "basic", created_at : new Date(),author_id  : user.id},
							{name: "package#4", desc: "hello",language: "Chinese", level: "basic", created_at : new Date(),author_id  : user.id},
							{name: "package#5", desc: "hello",language: "English", level: "basic", created_at : new Date(),author_id  : user.id}
						];

					Package.create(ar_packages, function(err, packages) {
							return cb(null);
					});
				}

			], function(err, result) {
				db.close();
			});
	});
});
