var port = process.env.PORT || 12345;
var cool = require("cool-ascii-faces");
var express = require("express");
//var modulo_pablo = require('modulos/pvl/modulo-PVL.js');
var modulo_jorge = require('./modulos/jfs/modulo-jfs.js');
//const pvl = require("./modulos/pvl/index-PVL");

var app = express();
app.get("/cool", (req, res) => {
    res.send(cool());
    console.log("New request for an ascii face");
});
app.listen(port, () => {
    console.log(`Server escuchando en el puerto ${port}`);
});

/*F05*/
var bodyParser = require("body-parser");
app.use(bodyParser.json());
modulo_jorge.api(app);
//modulo_pablo.api(app);