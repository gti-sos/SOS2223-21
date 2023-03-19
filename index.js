var express = require("express");
var bodyParser = require("body-parser");
var backend_jorge = require('./backend/jfs/modulo-jfs.js');
var modulo_pablo = require("./backend/pvl/modulo-pvl.js");

var port = process.env.PORT || 12345;

var app = express();
app.listen(port, () => {
    console.log(`Server escuchando en el puerto ${port}`);
});
app.use(bodyParser.json());
app.use("/", express.static("./public")); 

//BACKEND
backend_jorge.api(app);
modulo_pablo.api(app);

app.use("/", express.static("./public")); // barra es cualquier ruta

