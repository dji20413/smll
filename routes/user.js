
/*
 * GET users listing.
 */

module.exports = {

	"index" : function(req, res, next) {
		if( req.session.user.name == "admin" ) {
			res.render('admin/index');
		} else if( req.session.user.name == "vendor" ) {
			req.models.package.find({ author_id : req.session.user.id }, function(err, packages) {
				res.render('vendor/index', {
					packages : packages
				});
			});
		} else {
			req.models.device.find({ owner_id : req.session.user.id }, function(err, devices) {
				res.render('user/index', { devices : devices });
			});
		}

	},

	"verify" : function(req, res) {
		console.log("GET /verify");
		console.log("key : " + req.query.key);

		req.models.user.find({verify: req.query.key}, function(err, user) {
			if( err || user.legnth == 0 ) {
				return res.send(404);
			} else {

				var u = user[0];

				u.verify = null;
				u.save( function(err) {
					// redirect to root 
					return res.redirect('/');
				});
			}
		});

	},

	"create" : function(req, res) {

		// show fields
		console.log("POST /user");
		console.log("name     : " + req.body.name );
		console.log("email    : " + req.body.email );
		console.log("password : " + req.body.password );

		var vKey = uuid.v1();

		// create user
		req.models.user.create([{
			name 			 : req.body.name,
			email			 : req.body.email,
			password	 : req.body.password,
			verify     : vKey,
			type       : "normal",
			created_at : new Date()
		}], function(err, item) {

			if( err || item.length == 0 ) {
				console.log(err);
				res.send(500);
			} else {

				var mailOptions = {
					from		: "YOO ✔ <ydh0120@gmail.com>", // sender address
					to			: "ydh0120@gmail.com", // list of receivers
					subject	: "Hello ✔", // Subject line
					html		: "<a href='http://10.211.55.6:3000/verify?key=" + vKey + "'> VERIFY </a>" // html body
				}

				// send mail with defined transport object
				smtpTransport.sendMail(mailOptions, function(err, response) {
					
					if(err){
						console.log(err);
					}else{
						console.log("Message sent: " + response.message);
					}
					
					smtpTransport.close(); // shut down the connection pool, no more messages

					// respoinse
					res.redirect('/');

				});
			}
		});

		// validation
		// create new user with no verify
		// send email

	},

	"update" : function(req, res) {

		req.models.user.get(req.params.user, function(err, user) {

			// email cannot be changed
			req.body.email = user.email;

			// password change 
			if( req.body.password == "" )
				req.body.password = user.password;

			// merge
			for (var attr in req.body) {
				 user[attr] = req.body[attr]; 
			}	

			// save
			user.save( function(err) {
				if( err ) {
					console.log(err);
					return res.send('Failed', 400);	
				}

				req.session.user = user;
				delete req.session.user.password;

				res.header('Location', '/');
				req.flash('Account infomations are updated');
				res.send(201);	
			});

		});
	},


	"edit" : function(req, res) {
		req.models.user.get(req.params.user, function(err, user) {
			res.render('user/edit', {
				user : user
			});
		});
	},

	"admin" : {
		"index" : function(req, res) {
			req.models.user.find({}, function(err, users ) {
				res.render('admin/user/index', { users : users});
			});
		}
	}
	
	
}
