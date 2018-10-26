var express = require("express");
var app=express();
var request=require("request");
var bodyParser = require("body-parser");
var mysql = require('mysql');
var user="";
var questions = [];
var name=" ";
var email=" ";

app.use(express.static(__dirname + '/public'));
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "shubham01",
  database: "DISASTER"
});
var data = [];
con.query("SELECT * FROM QUESTIONS", function (err,result, fields) {
	data=result;
	// console.log(data);
});
var temp= "Yooo";
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

app.get("/",function(req,res){
	res.render("homepage");
});

app.get("/signup",function(req,res){
	res.render("signup");
});

app.get("/login",function(req,res){
	res.render("login");
});

app.get("/feed",function(req,res){
	res.render("index",{data: data, temp: temp})
});
app.get("/profile",function(req,res){
  var sql2="SELECT * FROM " + user;
  con.query(sql2, function (err, result){
    questions=result;
    res.render("profile",{questions:questions, name : name , user: user, email: email })
  });
});
app.get("/new",function(req,res){
	var sql = "INSERT INTO USERS VALUES ('" + req.query.name + "','" + req.query.username + "','" + req.query.email + "','" + req.query.password + "')";
  var sql2 = "CREATE TABLE " + req.query.username + " ( QUESTION   VARCHAR(2000), ANSWER   VARCHAR(5000) );";
  con.query(sql2, function(err, result){
      con.query(sql, function (err, result) {
        if(err)
          res.render("signup");
        else
          res.render("homepage");
    });
  });
	
});

app.get("/checkin",function(req,res){
	var sql = "SELECT * FROM USERS";
	con.query(sql, function (err, result) {
  		var users = result;
  		for(var i=0;i<users.length;i++)
  		{
        name=users[i].NAME;
        email=users[i].EMAIL;
  			if(users[i].USERNAME===req.query.username && users[i].PASSWORD===req.query.password)
  			{
  				user=users[i].USERNAME;
          var sql2="SELECT * FROM " + user;
          
          con.query(sql2, function (err, result){
            questions=result;
            res.redirect("/profile");
          });
  			}
  			if(i==users[i].length-1)
  			{ 
  				res.redirect("/login");
  			}
  		}
	});
});

app.get("/final",function(req,res){
	var search = req.query.search;
	console.log(search);
	var sql = "INSERT INTO QUESTIONS VALUES (' " + search + " ',' ',' ')";
  	con.query(sql, function (err, result) {
  		if(err)
  			console.log(err);
  		else
    		console.log("1 record inserted");
	});
	con.query("SELECT * FROM QUESTIONS", function (err,result, fields) {
    	data=result;
    	res.redirect("/feed");
 	});
});
app.get("/answer/:id",function(req,res)
{
	var x=req.params.id;
	res.render("answer",{data:data,x:x});
});
app.get("/addanswer/:id",function(req,res)
{
	var x=req.params.id;
	var y = req.query.answer;
	var sql = "UPDATE QUESTIONS SET ANSWER= '" + y + "' , USERNAME = '"+ user + "' WHERE QUESTION = '" + data[x].QUESTION + "'";
  var sql2 = "INSERT INTO " + user + " VALUES('" + data[x].QUESTION +"','" + y +"')";
  con.query(sql2,function (err,result, fields) {
    console.log(user);
      con.query(sql, function (err,result, fields) {
        con.query("SELECT * FROM QUESTIONS", function (err,result, fields) {
          data=result;
        res.redirect("/feed");
      }); 
    });
  });
	
});
app.listen(3000,function(){
	console.log("Server is running on port 3000");
});