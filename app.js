var express = require("express"); 
var app = express();
var fs = require("fs");
var bodyParser  = require("body-parser");

//app.use(express.static("public"));
// app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));


app.get("/projects/:project", function(req, res){
	var projectName = req.params.project;
	fs.readFile('./public/' + projectName + '/index.html', function(err, data){
		if (err){
			console.log(err);
			res.render("404.ejs");
		} else {
			var code = data.toString();
			res.send(code);
		}
		
	});
	// fs.readFile('./public/piano/index.html', function(err, data){
	// 	if (err) throw err;
	// 	var code = data.toString();
	// 	res.send(code);
	// })
});


//test

app.get("/test1", function(req, res){
	fs.readFile('./public/test/index.html', function(err, data){
		if (err) throw err;
		var code = data.toString();
		res.send(code);
	});
});

app.get("/", function(req, res){
	res.render("homepage.ejs");
});

app.listen(8000, process.env.IP, function(){
	console.log("Server started");
});