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
//var session = require('express-session');
var validator = require('express-validator');
var cookieParser = require('cookie-parser');
var morgan = require('morgan');
var sha256 = require('sha256');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(upload.array());
app.use(cookieParser());
//app.use(session({secret: "Your secret key", saveUninitialized: false, resave: false}));


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
	schemas.Item.findOne({"_id": request.params.id}, function(err, item) {
		response.setHeader("Content-Type", "application/json");
		response.send(item);
	});
});

// app.get("/getuseremail/:email", function (request, response) {	//unneeded and a security flaw - it was used to test something - hanging on to it just in case
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

function createHash(password, salt){//as a function so i can run tests - also so signup and login can use it - also sessionID uses it to make itself longer and unique and 'random'
	return sha256.x2(password+salt);//one of my fav parts - x2 means that it is double hashed
}
function createSalt(){//seperate function for tests
	var salt = '';
	var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789$';
	var charactersLength = characters.length;
	for ( var i = 0; i < 29; i++ ) {
		salt += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return salt;
}
app.post('/signup', function(req, res){
	var firstname = req.body.firstname;
	var lastname = req.body.lastname;
	var email = req.body.email;
	var password = req.body.password;
	var streetName = req.body.streetName;
	var city = req.body.city;
	var county = req.body.county;
	var postcode = req.body.postcode;

	if(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email) === true){
		schemas.User.find({"email": email}, function(err, user) {
			if (user.length != 0){
				res.status("401");
				res.json({
					message: "User Already Exists! Login or choose another user id"
				});
			} else{
				var salt = createSalt();
				var hash = createHash(password, salt);
				
				var User = new schemas.User({
					"firstname": firstname,
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
						message: "Added successfully"
					});
				});
			}
		});
	}
	//req.session.user = newUser;
	//res.redirect('/protected_page');
});

app.post('/login', function(req, res){
	var email = req.body.email;
	var password = req.body.password;

	if(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email) === true){//email correct format
		schemas.User.find({"email": email}, function(err, user) {//search for email
			if (user.length === 0){// email not found
				res.status("401");
				res.json({
					message: "Invalid Email or Password"
				});
			} else{//email is found
				var salt = user[0].salt;
				var hash = createHash(password, salt);
				if(hash != user[0].password){//password not correct
					res.status("401");
					res.json({
						message: "Invalid Email or Password"
					});
				} else{//password is correct
					var Session = new schemas.Session({//create new session
						sessionID: createHash(user[0]._id, ''),
						userID: user[0]._id
					});
					schemas.Session.insertMany(Session, function(err){
						if (err) throw err;
						res.status("200");
						res.json({
							message: Session.sessionID
						});
					});
				}
			}
		});
	}
});

app.post("/logout", function(req, res){
	schemas.Session.deleteOne({"sessionID": req.body.sessionID}, function(err, sess) {
		if (err){
			res.status("500");
			throw err;
		}
		res.status("200");
		res.json({
			message: "Session logged out successfully"
		});
	});
});

app.post("/getuserdetails", function(req, res){
	schemas.Session.findOne({"sessionID": req.body.sessionID}, function(err, sess) {
		if (sess){// session found
			schemas.User.findOne({"_id": sess.userID}, function(err, user) {//get user
				res.setHeader("Content-Type", "application/json");
				user.password = "";//security flaw if I send passwords back
				user.salt = "";
				res.status("200");
				res.send(user);
			});
		} else{
			res.status("401");
			res.json({
				message: "Invalid Session ID"
			});
		}
	});
});

app.post("/order", function(req, res){
	var sessionID = req.body.sessionID;
	var items = req.body.items;

	var total = 0.0;
	for (var i = 0; i < items.length; i++){//
		var itemID = items[i];
		schemas.Item.findOne({"_id": itemID}, function(err, item) {//get cost myself or user can input their own with their own post req
			if(item){//item found
				total += item.price;
			} else{
				res.status("401");
				res.json({
					message: "Invalid Item ID"
				});
			}
		});
	}
	
	var d = new Date();
	var year = d.getFullYear();
	var month = d.getMonth();
	var day = d.getDate();
	var hour = d.getHours();

	schemas.Session.findOne({"sessionID": sessionID}, function(err, sess) {
		var userID = sess.userID;
		if (sess){// session found
			var Order = new schemas.Order({
				"userID": userID,
				"items": items,
				"cost": total,
				"year": year,
				"month": month,
				"day": day,
				"hour": hour
			});
			Order.save().then((test) => {
				res.status("200");
				res.json({
					message: "Added successfully"
				});
			});
		} else{
			res.status("401");
			res.json({
				message: "Invalid Session ID"
			});
		}
	});
});

//sends index.html
app.get("/", function(request, response) {
	response.render("index");
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
module.exports.createSalt = createSalt;