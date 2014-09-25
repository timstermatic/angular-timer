var connect = require('connect');
var serveStatic = require('serve-static');
connect().use(serveStatic(__dirname)).listen(1337);
console.log("Server started - visit http://localhost:1337");
console.log("Use CTRL+C to stop");
