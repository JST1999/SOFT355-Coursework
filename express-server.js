var mongoose = require("mongoose");

var uri = "mongodb+srv://jtungay:Sekiro2019@cluster0-xwkkp.mongodb.net/test?retryWrites=true&w=majority";
var port = process.env.PORT || 8080

// Schemas.js, so we can get the card and game models from there
var schemas = require("./schemas");

// Import Express and initialise the application.
express = require("express");
var app = express();
app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	next();
});

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

app.get("/searchitems/:querystr", function (request, response) {
	var query = request.params.querystr;//can also do "/"+querystr+"/gi"
	schemas.Item.find({"name": {$regex:query,$options:"$gi"}}, function(err, item) {
		response.setHeader("Content-Type", "application/json");
		response.send(item);
	});
});

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

module.exports = app;