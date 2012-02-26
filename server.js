
var express     = require('express')
var routes      = require('./routes');

var app = module.exports = express.createServer();

// Load application environment
require('./config/environment');
require('./lib/sockets.js')

// ROUTING
app.get('/*.(js|css)', function(req, res) {
    res.sendfile('./'+req.url);
});

app.get('/', routes.index);
app.get('/chat', routes.messages);

app.listen(8000);
console.log("Server Started!")