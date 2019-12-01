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