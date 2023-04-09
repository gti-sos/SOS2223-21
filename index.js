import express from "express";
import cors from "cors";
import { loadBackend_jorge } from './backend/jfs/modulo-jfs_v2.js';
//var modulo_pablo = require("./backend/pvl/modulo-pvl.js");
//var modulo_sete = require("./backend/src/modulo-src.js");
import { handler } from "./frontend/build/handler.js";

var app = express();

app.use(cors());
var port = process.env.PORT || 12345;
app.use(express.json());
//BACKEND
loadBackend_jorge(app);
//modulo_pablo.api(app);
//modulo_sete.api(app);

app.use(handler); //configurador svelte

app.listen(port, () => {
    console.log(`Server escuchando en el puerto ${port}`);
});

