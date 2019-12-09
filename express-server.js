var mongoose = require("mongoose");

var uri = "mongodb+srv://jtungay:Sekiro2019@cluster0-xwkkp.mongodb.net/test?retryWrites=true&w=majority";
var port = process.env.PORT || 8080	//process.env.PORT is for heroku

// Schemas.js, so we can get the card and game models from there
var schemas = require("./schemas");

// Import Express and initialise the application.
express = require("express");
var app = express();
app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	next();
});

var bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer(); 
var session = require('express-session');
var cookieParser = require('cookie-parser');
var morgan = require('morgan');
var bcrypt = require('bcrypt');
var sha256 = require('sha256');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(upload.array());
app.use(cookieParser());
app.use(session({secret: "Your secret key"}));

app.use(express.static(__dirname));

app.get("/listitems", function(request, response) {
	// Find all items.
	schemas.Item.find(function(err, items) {
		// Set the response header to indicate JSON content
		// and return the array of Card data.
		response.setHeader("Content-Type", "application/json");
		response.send(items);
	});
});

app.get("/item/:id", function (request, response) {
	schemas.Item.find({"_id": request.params.id}, function(err, item) {
		response.setHeader("Content-Type", "application/json");
		response.send(item);
	});
});

// app.get("/getuseremail/:email", function (request, response) {
// 	schemas.User.find({"email": request.params.email}, function(err, user) {
// 		response.setHeader("Content-Type", "application/json");
// 		response.send(user);
// 	});
// });

app.get("/searchitems/:querystr", function (request, response) {
	var query = request.params.querystr;//can also do "/"+querystr+"/gi"
	schemas.Item.find({"name": {$regex:query,$options:"$gi"}}, function(err, item) {
		response.setHeader("Content-Type", "application/json");
		response.send(item);
	});
});

//sends index.html
app.get("/", function(request, response) {
	response.render("index");
});

function createHash(password, salt){//as a function so i can run tests
	return sha256.x2(password+salt);//one of my fav parts
}
app.post('/signup', function(req, res){
	var fistname = req.body.firstname;
	var lastname = req.body.lastname;
	var email = req.body.email;
	var password = req.body.password;
	var streetName = req.body.streetName;
	var city = req.body.city;
	var county = req.body.county;
	var postcode = req.body.postcode;

	schemas.User.find({"email": email}, function(err, item) {
		if (item.length != 0){
			res.status("401");
			res.json({
				message: "User Already Exists! Login or choose another user id"
			});
		} else{
			const salt = bcrypt.genSaltSync();
			var hash = createHash(password, salt);
	
			var User = new schemas.User({
				"fistname": fistname,
				"lastname": lastname,
				"email": email,
				"password": hash,
				"salt": salt,
				"streetName": streetName,
				"city": city,
				"county": county,
				"postcode": postcode
			});
			User.save().then((test) => {
				res.status("200");
				res.json({
					message: "Added"
				});
			});
		}
	});
	
	//req.session.user = newUser;
	//res.redirect('/protected_page');
});

// Run the server.
app.listen(port, function() {
	mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true}).then((test) => {
		console.log("Connected to DB");
	});
	console.log("Listening...");
})

//for testing
module.exports = app;
module.exports.createHash = createHash;
module.exports.bcrypt = bcrypt;