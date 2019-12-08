var mongoose = require("mongoose");

var Item = mongoose.model("Item", {
	name: String,
	filename: String,
	description: String,
	category: [String],
	price: Number,
	quantity: Number,
	reviews: [String]
});
module.exports.Item = Item;

var User = mongoose.model("User", {
	fistname: String,
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