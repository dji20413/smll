
/*
 * GET home page.
 */

module.exports = {

	"signup" : function(req, res) {
		res.render('user/new');
	},

	"signin" : function(req, res) {
		res.render('session/new');
	},

	"signout" : function(req, res) {
		delete req.session.user;
		res.redirect('/');
	},

	"how" : function(req, res) {
  	res.render('howitworks', { title: 'Express' });
	},

	"terms" : function(req, res) {
  	res.render('terms');
	},

	"privacy" : function(req, res) {
  	res.render('privacy');
	},

	"about" : function(req, res) {
  	res.render('about');
	},

	"team" : function(req, res) {
		res.render('team');
	},

	"getstart" : function(req, res) {
		res.render('gettingstarted');
	},

	"tech" : function(req, res) {
		res.render('tech');
	},

	"press" :  function(req, res) {
		res.render('press');
	},

	"faq" : function(req, res) {
		res.render('faq');
	},

	"vendor" : function(req, res) {
		res.render('vendor');
	}
}
