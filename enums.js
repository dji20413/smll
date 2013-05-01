// enum type for speech table

//module.exports.time    = ['dawn', 'morning', 'noon', 'afternnon', 'evening', 'night'];
//module.exports.weekday = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
//module.exports.weather = ['Clear', 'Clouds'];
//module.exports.feeling = ['warm', 'cold', 'hot'];
module.exports.model   = ['Arduino'];


var date = [];
for( i = 1 ; i <= 31 ; i++ )
	date.push(i);
module.exports.date = date; 

var month = [];
for( i = 1 ; i <= 12 ; i++ )
	month.push(i);
module.exports.month = month; 
