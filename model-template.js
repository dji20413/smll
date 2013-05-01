/* model-template.js */

var enums = require('./enums');


module.exports.time = {
	fields : {
		name  :  String,
		score :  Number
	},
	options : {
		methods :{
		},
		validations : {
		}
	}
}

module.exports.weather = {
	fields : {
		name  :  String,
		score :  Number
	},
	options : {
		methods :{
		},
		validations : {
		}
	}
}

module.exports.weekday = {
	fields : {
		name  :  String,
		score :  Number
	},
	options : {
		methods :{
		},
		validations : {
		}
	}
}

module.exports.feeling = {
	fields : {
		name  :  String,
		score :  Number
	},
	options : {
		methods :{
		},
		validations : {
		}
	}
}

module.exports.user = {

	fields : { 
		name			 : String,
		email			 : String,
		password 	 : String,
		verify     : String,
		type       : String,
		created_at : Date 
	},
	
	options : {
		methods :{
		},
		validations : {
		}
	}
};

module.exports.package = {

	fields : { 
		name			 : String,
		desc			 : String,
		language	 : String,
		level      : String,
		picture    : String,
		created_at : Date 
	},
	
	options : {
		methods :{
		},
		validations : {
		}
	}
};

module.exports.speech = {

	fields : { 
		script		 : String,
		file       : String,
		score      : Number,
		month      : Number, 
		date       : Number,
	},
	
	options : {
		methods :{
		},
		validations : {
		}
	}
};

module.exports.device = {

	fields : { 
		name		 	 : String,	// device name
		model      : enums.model, 
		serial		 : String,	// device serial number
		ip         : String,  // ip address of last connection 
		where      : String,  // logical location
		lon        : Number,  // geolocation
		lat        : Number,  // geolocation 
		updated_at : Date,
		created_at : Date
	},
	
	options : {
		methods :{
		},
		validations : {
		}
	}
};


