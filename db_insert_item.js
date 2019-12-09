var mongoose = require("mongoose");
var schemas = require("./schemas");

var uri = "mongodb+srv://jtungay:Sekiro2019@cluster0-xwkkp.mongodb.net/test?retryWrites=true&w=majority";
mongoose.connect(uri, {useNewUrlParser: true});

var Item = new schemas.Item({
	"name": "Sekiro Shadows Die Twice [PS4]",
	"filename": "Sekiro-ps4.jpg",
	"description": "In Sekiro: Shadows Die Twice you are the 'one-armed wolf', a disgraced and disfigured warrior rescued from the brink of death. Bound to protect a young lord who is the descendant of an ancient bloodline, you become the target of many vicious enemies, including the dangerous Ashina clan. When the young lord is captured, nothing will stop you on a perilous quest to regain your honor, not even death itself. Explore late 1500s Sengoku Japan, a brutal period of constant life and death conflict, as you come face to face with larger than life foes in a dark and twisted world. Unleash an arsenal of deadly prosthetic tools and powerful ninja abilities while you blend stealth, vertical traversal, and visceral head to head combat in a bloody confrontation.",
	"category": ["PlayStation4", "Game"],
	"price": 27.99,
	"quantity": 10,
	"reviews": []
});
Item.save().then((test) => {
	console.log("Added to DB");
});