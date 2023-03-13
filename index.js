var port = process.env.PORT || 12345;
var cool = require("cool-ascii-faces");
var express = require("express");
var modulo_pablo = require('./modulo-pvl.js');
var modulo_jorge = require('./modulo-jfs.js');

const pvl = require("./index-PVL");
var app = express();
app.get("/cool", (req, res) => {
    res.send(cool());
    console.log("New request for an ascii face");
});
app.listen(port, () => {
    console.log(`Server escuchando en el puerto ${port}`);
});
app.get("/samples/jfs", (req, res) => {
    res.send(index_jorge.jorge());
    console.log("New request for jfs exercise");
});

/*F05*/
var bodyParser = require("body-parser");
app.use(bodyParser.json());
modulo_jorge.api(app);
//modulo_pablo.api(app);


