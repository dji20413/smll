
module.exports = {

	"create" : function(req, res) {
		console.log(req.body);

		req.models.user.find({
				email    : req.body.email,
				password : req.body.password
			}, function(err, users) {
				console.log(users);
				if( err || users.length == 0 ) {
					res.send("The email or password you entered is incorrect.", 403);
				} else {
					console.log("create new session : " + JSON.stringify( users[0] ));
					req.session.user = users[0];
					req.flash('Welcome ' + users[0].name);
					res.header('Location', '/');
					res.send( 201);
				}
		});
	}
}
