import cors from "cors";
import { handler } from "./frontend/build/handler.js";
import express from "express";
import { loadBackend_jorge } from './backend/jfs/modulo-jfs_v2.js';
import { loadBackend_jorge_v1 } from './backend/jfs/modulo-jfs.js';
import { LoadModulo_Pablo } from './backend/pvl/modulo-pvl.js';
import { LoadModulo_Pablo_v2 } from './backend/pvl/modulo-pvl-v2.js';
//var modulo_sete = require("./backend/src/modulo-src.js");
//import { LoadModulo_Pablo } from './backend/pvl/modulo-pvl.js';
import { loadBackend_src } from './backend/src/modulo-src.js';

var app = express();

app.use(cors());
var port = process.env.PORT || 12345;
app.use(express.json());
//BACKEND
loadBackend_jorge(app);
loadBackend_jorge_v1(app);
LoadModulo_Pablo(app);
LoadModulo_Pablo_v2(app);
//modulo_sete.api(app);
loadBackend_src(app);

app.use(handler); //configurador svelte

app.listen(port, () => {
    console.log(`Server escuchando en el puerto ${port}`);
});