var express = require("express"); 
var app = express();
// var bodyParser  = require("body-parser");

app.use(express.static("public"));
// app.set("view engine", "ejs");
// app.use(bodyParser.urlencoded({extended: true}));


app.get("/", function(req, res){
	res.render("homepage.ejs");
});

app.listen(8000, process.env.IP, function(){
	console.log("სერვერი ჩაირთო!");
});