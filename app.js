
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var moment = require('moment');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('devhub', process.env.DEVHUB);
app.set('memo_no', process.env.NO);
app.set('memo_line', process.env.LINE);
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

function postDataToMemo(name, msg){
  if (!(app.get('memo_no') && app.get('memo_line'))){ return; }

  no = app.get('memo_no');
  line = app.get('memo_line');

	http.get(app.get('devhub') + "/memo?name="+name+"&msg="+msg+"&no="+no+"&line="+line, function(){});
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

  // for chat
	var commit_comments = [];
	commits.forEach(function(value){
		commit_comments.push("<br> - [" + value["message"].split("\n")[0] + "](" + value["url"] + ")");
	});

	var msg = ":arrow_up: " + pusher + " pushes to [" + repo + "]("+ url + ")" + commit_comments.join(" ");
	postData("gitbucket", msg);

  // for memo
	commit_comments = [];
	commits.forEach(function(value){
		commit_comments.push("<br>                 |  - [" + value["message"].split("\n")[0] + "](" + value["url"] + ")");
	});

  var now = moment().format("YYYY/MM/DD HH:mm");
	var memo_msg = now + " | [" + repo + "]("+ url + ") by " + pusher + commit_comments.join(" ");
	postDataToMemo("gitbucket", memo_msg);

	res.json({});
});
app.post('/github', function(req, res){
	var payload = req.body;

	// for ping
	if (payload["zen"]){
		res.json({});
		return;
	}

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
