import { handler } from "./frontend/build/handler.js";
import express from "express";
import cors from "cors";
import { loadBackend_jorge } from './backend/jfs/modulo-jfs_v2.js';
//import { LoadModulo_Pablo } from './backend/pvl/modulo-pvl.js';
import { loadBackend_src } from './backend/src/modulo-src.js';

var app = express();

app.use(cors());
var port = process.env.PORT || 12345;
app.use(express.json());
//BACKEND
loadBackend_jorge(app);
//LoadModulo_Pablo(app);
loadBackend_src(app);

app.use(handler); //configurador svelte

app.listen(port, () => {
    console.log(`Server escuchando en el puerto ${port}`);
});