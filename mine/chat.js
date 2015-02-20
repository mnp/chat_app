var app = require('express.io')();
app.http().io();
var port = process.env.PORT || 3000;

var clients = {};
var clientSockets = {};

// routes
app.io.route('speak', function(req) {
    console.log("-> "+req.data)
    app.io.broadcast('speak', {
        user: clientSockets[req.socket.id],
        message: req.data
    });
});

app.io.route('set username', function(req) {
    var username = req.data;
    if(clients[username] === undefined) {
        clients[username] = req.socket.id;
        clientSockets[req.socket.id] = username;
        console.log("paired username:websocket -> "+req.data+":"+req.socket.id);
        req.io.respond({ OK: 'username set successfully' });
    } else {
        console.log("failed to pair username:websocket, username already in use");
        req.io.respond({ ERROR: 'username in use' });
    }
});




// Client HTML
app.get('/', function(req, res) {
    res.sendfile(__dirname + '/public/index.html');
});

app.listen(port);
