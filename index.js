import express from "express";
import cors from "cors";
import { handler } from "./frontend/build/handler.js";
import { loadBackend_jorge } from './backend/jfs/modulo-jfs.js';
//var modulo_pablo = require("./backend/pvl/modulo-pvl.js");
//var modulo_sete = require("./backend/src/modulo-src.js");


var port = process.env.PORT || 12345;

var app = express();
app.listen(port, () => {
    console.log(`Server escuchando en el puerto ${port}`);
});
app.use(express.json());

//BACKEND
loadBackend_jorge(app);
//modulo_pablo.api(app);
//modulo_sete.api(app);


app.use(handler); //configurador svelte
app.use(cors);