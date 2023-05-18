import cors from "cors";
import { handler } from "./frontend/build/handler.js";
import express from "express";
import { loadBackend_jorge_v1 } from './backend/jfs/modulo-jfs_v1.js';
import { loadBackend_jorge_v2 } from './backend/jfs/modulo-jfs_v2.js';
import { loadBackend_jorge_v3 } from './backend/jfs/modulo-jfs_v3.js';
import { LoadModulo_Pablo } from './backend/pvl/modulo-pvl.js';
import { LoadModulo_Pablo_v2 } from './backend/pvl/modulo-pvl-v2.js';
import { loadBackend_src_v2 } from './backend/src/modulo-src_v2.js';
//import { LoadModulo_Pablo } from './backend/pvl/modulo-pvl.js';

var app = express();

app.use(cors());

var port = process.env.PORT || 12345;
app.use(express.json());
//BACKEND
loadBackend_jorge_v1(app);
loadBackend_jorge_v2(app);
loadBackend_jorge_v3(app);
LoadModulo_Pablo(app);
LoadModulo_Pablo_v2(app);
loadBackend_src_v2(app);

app.use(handler); 

app.listen(port, () => {
    console.log(`Server escuchando en el puerto ${port}`);
});
