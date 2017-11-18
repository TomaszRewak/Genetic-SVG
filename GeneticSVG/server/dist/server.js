var express = require('express');
var app = express();
var port = process.env.port || 1337;
app.use(express.static('public'));
app.listen(port, function () { return console.log("Example app listening on port " + port); });
//# sourceMappingURL=server.js.map