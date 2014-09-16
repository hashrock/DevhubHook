var fs = require("fs");
var request = require("request");

//Testing gitlab post
fs.readFile('test/gitlab.json', "utf8", function (err, data) {
    if (err) throw err;

    var options = {
        uri: 'http://localhost:4000/gitlab',
        form: JSON.parse(data),
        json: true
    };
    request.post(options, function(error, response, body){
        if(error){
            throw err;
        }
        console.log(body); // {} : success
    });
});

//Testing github post
fs.readFile('test/github.json', "utf8", function (err, data) {
    if (err) throw err;

    var options = {
        uri: 'http://localhost:4000/github',
        form: JSON.parse(data),
        json: true
    };
    request.post(options, function(error, response, body){
        if(error){
            throw err;
        }
        console.log(body); // {} : success
    });
});



