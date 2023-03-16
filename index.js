var cool = require("cool-ascii-faces");
var express = require("express");
//var modulo_pablo = require('modulos/pvl/modulo-PVL.js');
var backend_jorge = require('./backend/jfs/modulo-jfs.js');
//const pvl = require("./modulos/pvl/index-PVL");


var port = process.env.PORT || 12345;


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
backend_jorge.api(app);
//modulo_pablo.api(app);

//f06
app.use("/", express.static("./public")); // barra es cualquier ruta
/*
.
.
.
.

.
.
.

.
.
.

.
.
.

.
.
.

.
.

.

.
.

.
.

.
.
.
.

.
.
.

.
.
.
.

.
.
.

.
.

.

.
.
.


.




.
.
.
.
.

.
.


















..


.

.
.

.
.
.

.
.

.
.

.
.

.
.

.
.
.

.

.
.

.
.
.

.
.

.
.

.
.

.
.

.
.
.

.
.

.
.

.
.

.
.

.
.
.

.
.
.
.

.
.

.
.
.
.

.
.

.
.
.

.
.

.
.
.

.
.

.
.

.
.
.

.

.
.
.

.
.
.

.
.
.

.
.

.

.
.

.
.
.

.
.

.
.
.
.

.
.

.
.

.

.
.
.

.

.

.
.

.
.
.

.

.
.

.

.
.
.

.
.

.
.

.
.
.

.
.

.
.
.
.
.

.
.

.
.

.

.
.
.

*/