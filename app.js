var express = require("express"); 
var app = express();
var fs = require("fs");
// var bodyParser  = require("body-parser");

app.use(express.static("public"));
// app.set("view engine", "ejs");
// app.use(bodyParser.urlencoded({extended: true}));




//test
//app.use(express.static(__dirname + "/public"))  // !!ამის გარეშე რატომ მუშაობს!!
app.get("/test", function(req, res){
	fs.readFile('./public/test/test.html', function(err, data){
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