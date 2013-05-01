
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , orm  = require('orm')
	, mot = require('./model-template')
	, nodemailer = require("nodemailer")
	, uuid = require("node-uuid")
	, flashify = require("flashify");

fs = require("fs");
path = require('path');
enums = require("./enums");
request = require("request");
async = require("async");

// create reusable transport method (opens pool of SMTP connections)
var smtpTransport = nodemailer.createTransport("SMTP",{
	service	: "Gmail",
	auth		: { 
		user: "ydh0120@gmail.com", 
		pass: "dyfhtlzn1"
	}
});



var app = express();


app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('hello-world'));
  app.use(express.session());
	app.use(flashify);

	app.use( orm.express("mysql://root:audghk02@127.0.0.1/smll", {
		define : function(db, models) {

			models.time    = db.define('time',    mot.time.fields,    { autoFetch : true });
			models.weekday = db.define('weekday', mot.weekday.fields, { autoFetch : true });
			models.feeling = db.define('feeling', mot.feeling.fields, { autoFetch : true });
			models.weather = db.define('weather', mot.weather.fields, { autoFetch : true });

			// define model
			models.user    = db.define("user", mot.user.fields, {cache: false, autoFetch : true} );
			models.package = db.define("package", mot.package.fields, {cache: false, autoFetch : true} );
			models.speech  = db.define("speech", mot.speech.fields, {cache: false, autoFetch : true});
			models.device  = db.define("device", mot.device.fields, {cache: false, autoFetch : true, autoFetchLimit : 2});
	
			// association
			models.device.hasOne('owner', models.user);
			models.package.hasOne('author', models.user);
			models.speech.hasOne('package', models.package);
			models.device.hasOne('package', models.package);
			
			models.speech.hasOne('time',    models.time, { autoFetch : true });
			models.speech.hasOne('weekday', models.weekday, { autoFetch : true });
			models.speech.hasOne('feeling', models.feeling, { autoFetch : true });
			models.speech.hasOne('weather', models.weather, { autoFetch : true });
		}

	}));
/*
	app.use( function(req, res, next) {
		req.models.user.find({ name : 'vendor'}, function(err, user) {
			if( err || user.length == 0 ) {
			} else {
				req.session.user = user[0];
			}
			next();
		});
	});
	*/
	

	app.use( function(req, res, next) {
		res.locals.user= req.session.user;
		next();
	});

  app.use(app.router);
  app.use(require('less-middleware')({ src: __dirname + '/public' }));
  app.use(express.static(path.join(__dirname, 'public')));

});

app.configure('development', function(){
  app.use(express.errorHandler());
});

var userAuth = function(req, res, next ) {
	if( req.session.user ) {
		return next();	
	} else {
		return res.render('index');
	}
};

var adminAuth = function(req, res, next ) {
	if( req.session.user.name == "admin" ) {
		return next();	
	} else {
		return res.send(401);
	}
};

var vendorAuth = function(req, res, next ) {
	if( req.session.user && req.session.user.name == "vendor" ) {
		return next();	
	} else {
		return res.redirect('/');
	}
};

//
// routes
//
app.all('/vendor*', vendorAuth, function(req, res, next) {
	next();
}); 

app.all('/admin*', adminAuth, function(req, res, next) {
	next();
}); 

var c_user = require('./routes/user');
app.get('/', userAuth, c_user.index );
app.put('/user/:user', c_user.update);
app.get('/user/:user/edit', c_user.edit);
app.get('/verify', c_user.verify);
app.post('/user', c_user.create);
app.get('/admin/user', c_user.admin.index);

// about 
app.get('/about', routes.about);
app.get('/how-it-works', routes.how);
app.get('/team', routes.team);
app.get('/getting-started', routes.getstart);
app.get('/tech', routes.tech);
app.get('/press', routes.press);
app.get('/faq', routes.faq);
app.get('/vendor', routes.vendor);
app.get('/terms', routes.terms);
app.get('/privacy', routes.privacy);

// device
var c_device = require('./routes/device');
app.get('/device', c_device.index);
app.post('/device', userAuth, c_device.create);
app.get('/device/new', userAuth, c_device.new)
app.get('/device/:device', userAuth, c_device.detail); 
app.get('/device/:device/edit', userAuth, c_device.edit);
app.put('/device/:device', userAuth, c_device.update);
app.delete('/device/:device_id', userAuth, c_device.remove);
app.get('/admin/device', c_device.admin.index );
app.get('/device/:device/ctx', c_device.ctx);

// package
var c_package = require('./routes/package');
app.get('/package', c_package.index);
app.get('/package/:package_id', c_package.detail);
app.get('/shop', c_package.shop.index);
app.get('/shop/package/:package_id', c_package.shop.detail );
app.get('/admin/package', c_package.admin.index);
app.get('/vendor/package/new', c_package.vendor.new);
app.get('/vendor/package/:package_id', c_package.vendor.detail);
app.delete('/vendor/package/:package', c_package.vendor.remove);
app.get('/vendor/package/:package/edit', c_package.vendor.edit );
app.put('/vendor/package/:package', c_package.vendor.update );
app.post('/vendor/package', c_package.vendor.create);
app.get('/vendor/package', c_package.vendor.index);

// speech
var c_speech = require('./routes/speech');
app.post('/speech', c_speech.create);
app.delete('/speech/:speech', c_speech.remove);
app.get('/vendor/package/:package/speech/new', c_speech.new);
app.put('/vendor/package/:package/speech/:speech', c_speech.update);
app.get('/vendor/package/:package/speech/:speech/edit', c_speech.edit);

app.get('/signup', routes.signup);
app.get('/signin', routes.signin);
app.get('/signout', routes.signout);


var c_session = require('./routes/session');
app.post('/session', c_session.create );


var c_connection = require('./routes/connection');
app.get('/connection/new', c_connection.new);
app.post('/connection', c_connection.create);
app.delete('/connection/:device_id', c_connection.remove)

// create server
http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
