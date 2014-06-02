
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('devhub', process.env.DEVHUB);
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.bodyParser());
app.use(app.router);

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

function postData(name, msg){
	http.get(app.get('devhub') + "/notify?name="+name+"&msg="+msg, function(){});
}

app.post('/gitlab', function(req, res){
	var data = req.body;
	var msg = data.user_name + " pushes to [" + data.repository.name + "](" + data.repository.homepage + ")" ;
	postData("gitlab", msg);
	res.json({});
});
app.post('/redmine', function(req, res){
	var data = req.body;
	var action = data.payload.action;
	var author = data.payload.issue.author.login;
	var subject = data.payload.issue.subject;
	var url = data.payload.url;
	var msg = author + " " + action + " [" + subject + "]("+ url + ")";
	postData("redmine", msg);
	res.json({});
});
app.post('/gitbucket', function(req, res){
	var data = req.body;
	var payload = JSON.parse(data.payload);
	var pusher = payload["pusher"]["name"];
	var commits = payload["commits"];
	var repo = payload["repository"]["name"];
	var url = payload["repository"]["url"];

	var commit_comments = [];
	commits.forEach(function(value){
		commit_comments.push("<br> - [" + value["message"].split("\n")[0] + "](" + value["url"] + ")");
	});

	var msg = pusher + " pushes to [" + repo + "]("+ url + ")" + commit_comments.join(" ");
	postData("gitbucket", msg);
	res.json({});
});
app.post('/github', function(req, res){
	var payload = req.body;
	var pusher = payload["pusher"]["name"];
	var commits = payload["commits"];
	var repo = payload["repository"]["name"];
	var url = payload["repository"]["url"];

	var commit_comments = [];
	commits.forEach(function(value){
		commit_comments.push("<br> - [" + value["message"].split("\n")[0] + "](" + value["url"] + ")");
	});

	var msg = pusher + " pushes to [" + repo + "]("+ url + ")" + commit_comments.join(" ");
	postData("github", msg);
	res.json({});
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
