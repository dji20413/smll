var orm = require("orm");
var async = require('async');
var mot = require('./model-template');

orm.connect("mysql://root:audghk02@127.0.0.1/smll", function (err, db) {
	if (err) throw err;

	var Time    = db.define('time', mot.time.fields, { autoFetch : true });
	var Weekday = db.define('weekday', mot.weekday.fields, { autoFetch : true });
	var Feeling = db.define('feeling', mot.feeling.fields, { autoFetch : true });
	var Weather = db.define('weather', mot.weather.fields, { autoFetch : true });
	var Speech = db.define('speech', mot.speech.fields, { autoFetch : true });

	Speech.hasOne('time', Time);
	Speech.hasOne('weekday', Weekday);
	Speech.hasOne('feeling', Feeling);
	Speech.hasOne('weather', Weather);


	Speech.find(query, function(err, results) {
		console.log( results );

		for( var sp in results ) {
			var row = results[sp];
			console.log( row.time_id + " " + row.weekday_id );
		}

		console.log("tot count : " + results.length );


		db.close();
	});

});
