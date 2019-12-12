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
module.exports.Item = Item;

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