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

//one of my fav parts, this is a part for sending emails
var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'saywatt0@gmail.com',
    pass: 'What are you looking at1'
  }
});

var Storage = multer.diskStorage({//used to help add images https://dzone.com/articles/upload-files-or-images-to-server-using-nodejs
	destination: function(req, file, callback) {
		callback(null, "./product-images");
	},
	filename: function(req, file, callback) {
		callback(null, file.originalname);
	}
});//also, another one of my fav features
var upload = multer({
	storage: Storage
}).array("imgUploader", 3); //Field name and max count

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//app.use(upload.array());
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
					//setup email
					var mailOptions = {
						from: 'saywatt0@gmail.com',
						to: email,
						subject: 'Welcome!',
						text: 'Welcome '+firstname+'. This is a confirmation that you have created an account with SayWatt.'
					};
					//send email
					transporter.sendMail(mailOptions, function(error, info){
						if (error) {
						  console.log(error);
						} else {
						  console.log('Email sent: ' + info.response);
						}
					});

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

app.post('/adminlogin', function(req, res){
	var username = req.body.username;
	var password = req.body.password;

	schemas.Admin.find({"username": username}, function(err, user) {//search for admin
		if (user.length === 0){// admin not found
			res.status("401");
			res.json({
				message: "Invalid Email or Password"
			});
		} else{//admin is found
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

app.post("/getadmindetails", function(req, res){
	schemas.Session.findOne({"sessionID": req.body.sessionID}, function(err, sess) {
		if (sess){// session found
			schemas.Admin.findOne({"_id": sess.userID}, function(err, user) {//get user
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
				"hour": hour,
				"dispatched": false
			});
			schemas.Order.insertMany(Order, function(err){
				if (err) throw err;
				
				schemas.User.findOne({"_id": sess.userID}, function(err, user) {//get user
					//setup email
					var mailOptions = {
						from: 'saywatt0@gmail.com',
						to: user.email,
						subject: 'Order Confirmation!',
						text: 'User-id '+user._id+' . order-id '+Order._id
					};
					//send email
					transporter.sendMail(mailOptions, function(error, info){
						if (error) {
							console.log(error);
						} else {
							console.log('Email sent: ' + info.response);
						}
					});
				});

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

app.post("/addimage", function(req, res) {
	upload(req, res, function(err) {
		if (err) {
			return res.end("Something went wrong!");
		}
		return res.end("File uploaded sucessfully!");
	});
});

app.post("/additem", function(req, res){
	var sessionID = req.body.sessionID;
	var name = req.body.name;
	var description = req.body.description;
	var filename = req.body.filename;
	var price = req.body.price;
	var quantity = req.body.quantity;
	var category = req.body.category + '';//this concatination makes category a string so that .split() works
	category = category.split(',')

	schemas.Session.findOne({"sessionID": sessionID}, function(err, sess) {
		if (sess){// session found
			schemas.Admin.findOne({"_id": sess.userID}, function(err, user) {//get user
				if(user){
					var Item = new schemas.Item({
						"name": name,
						"filename": filename,
						"description": description,
						"category": category,
						"price": price,
						"quantity": quantity,
						"reviews": []
					});
					Item.save().then((test) => {
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
		} else{
			res.status("401");
			res.json({
				message: "Invalid Session ID"
			});
		}
	});
});

app.post("/removeitem", function(req, res){
	var sessionID = req.body.sessionID;
	var itemID = req.body.id;

	schemas.Session.findOne({"sessionID": sessionID}, function(err, sess) {
		if (sess){// session found
			schemas.Admin.findOne({"_id": sess.userID}, function(err, user) {//get user
				if(user){
					schemas.Item.deleteOne({"_id": itemID}, function(err, sess) {
						if (err){
							res.status("500");
							throw err;
						}
						res.status("200");
						res.json({
							message: "Removed Successfully"
						});
					});
				} else{
					res.status("401");
					res.json({
						message: "Invalid Session ID"
					});
				}
			});
		} else{
			res.status("401");
			res.json({
				message: "Invalid Session ID"
			});
		}
	});
});

app.post("/getorders", function(req, res){
	var sessionID = req.body.sessionID;

	schemas.Session.findOne({"sessionID": sessionID}, function(err, sess) {
		if (sess){// session found
			schemas.Admin.findOne({"_id": sess.userID}, function(err, user) {//get user
				if(user){
					schemas.Order.find({"dispatched": false}, function(err, orders) {
						res.setHeader("Content-Type", "application/json");
						res.status("200");
						res.send(orders);
					});
				} else{
					res.status("401");
					res.json({
						message: "Invalid Session ID"
					});
				}
			});
		} else{
			res.status("401");
			res.json({
				message: "Invalid Session ID"
			});
		}
	});
});

app.post("/updatedispatchment", function(req, res){
	var sessionID = req.body.sessionID;
	var orderID = req.body.orderID;
	var custID;
	var newOrder;

	schemas.Order.findOne({"_id": orderID}, function(err, order) {
		custID = order.userID;
		newOrder = order;
	});

	schemas.Session.findOne({"sessionID": sessionID}, function(err, sess) {
		if (sess){// session found
			schemas.Admin.findOne({"_id": sess.userID}, function(err, user) {//get user
				if(user){
					newOrder.dispatched = true;
					newOrder.save().then((test) => {
						schemas.User.findOne({"_id": custID}, function(err, cust) {//get user
							//setup email
							var mailOptions = {
								from: 'saywatt0@gmail.com',
								to: cust.email,
								subject: 'Order Dispatched!',
								text: 'User-id '+cust._id+' . order-id '+orderID
							};
							//send email
							transporter.sendMail(mailOptions, function(error, info){
								if (error) {
									console.log(error);
								} else {
									console.log('Email sent: ' + info.response);
								}
							});
						});
	
						res.status("200");
						res.json({
							message: "Changed Successfully"
						});
					});
				} else{
					res.status("401");
					res.json({
						message: "Invalid Session ID"
					});
				}
			});
		} else{
			res.status("401");
			res.json({
				message: "Invalid Session ID"
			});
		}
	});
});



var WebSocketServer = require('websocket').server;
var http = require('http');
var server = http.createServer(function(request, response) {
    console.log((new Date()) + ' Received request for ' + request.url);
    response.writeHead(404);
    response.end();
});
server.listen(9000, function() {
    console.log((new Date()) + 'Server is listening on port 9000');
});
wsServer = new WebSocketServer({
    httpServer: server,
    // You should not use autoAcceptConnections for production
    // applications, as it defeats all standard cross-origin protection
    // facilities built into the protocol and the browser.  You should
    // *always* verify the connection's origin and decide whether or not
    // to accept it.
    autoAcceptConnections: false
});
function originIsAllowed(origin) {
  // put logic here to detect whether the specified origin is allowed.
  return true;
}
wsServer.on('request', function(request) {
    if (!originIsAllowed(request.origin)) {
      // Make sure we only accept requests from an allowed origin
      request.reject();
      console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
      return;
    }
    
    var connection = request.accept(null, request.origin);
    console.log((new Date()) + ' Connection accepted.');
	const changeStream = schemas.Order.watch();
	changeStream.on('change', next => {
		console.log("New change in order collection")
		connection.sendUTF("change");
	});
    connection.on('close', function(reasonCode, description) {
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
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