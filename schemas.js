var mongoose = require("mongoose");

var Item = mongoose.model("Item", {//items in database
	name: String,
	filename: String,
	description: String,
	category: [String],
	price: Number,
	quantity: Number,
	reviews: [String]
});
module.exports.Item = Item;//so express-server can use it

var User = mongoose.model("User", {//users in database
	firstname: String,
	lastname: String,
	email: String,
	password: String,
	salt: String,
	streetName: String,
	city: String,
	county: String,
	postcode: String
});
module.exports.User = User;

var Session = mongoose.model("Session", {//sessions
	sessionID: String,
	userID: String
});
module.exports.Session = Session;