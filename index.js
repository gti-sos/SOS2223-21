var port = process.env.PORT || 12345;
/*F04*/
var cool = require("cool-ascii-faces");
var express = require("express");

//esqueleto de un servidor web
var app = express();
//req = request res = response
app.get("/cool", (req, res) => {
    res.send(cool());
    console.log("New request for an ascii face");
});
app.listen(port, () => {
    //con esto nos  aseguramos quele mensaje no sale hasta que el servidor no esta escuchando de verdad
    console.log(`Server escuchando en el puerto ${port}`);
}); //puertos hasta 32k

const index_jorge = require("./index-JFS");
app.get("/samples/jfs", (req, res) => {
    res.send(index_jorge.jorge());
    console.log("New request for jfs exercise");
});
app.get("/samples/pvl", (req, res) => {
    res.send(pvl.media_variation_rate(pvl.datos_ejemplos_pablo, "Granada"));
    console.log("New request for pvl exercise");
});
var datos_ejemplos_sete = [
    { province: "Almería", year: 2010, pib_current_price: 149627412, pib_percentage_structure: 100, pib_variation_rate: 298281107 },
    { province: "Cádiz", year: 2014, pib_current_price: 19540300.38, pib_percentage_structure: 13.62894036, pib_variation_rate: -0.83632259 },
    { province: "Granada", year: 2010, pib_current_price: 21225978.10, pib_percentage_structure: 14.18588868, pib_variation_rate: 0.908546693 },
    { province: "Cádiz", year: 2017, pib_current_price: 10986877.00, pib_percentage_structure: 6.751839242, pib_variation_rate: 11.72504816 },
    { province: "Jaén", year: 2010, pib_current_price: 15922742.43, pib_percentage_structure: 10.64159449, pib_variation_rate: -2.5473448 },
    { province: "Málaga", year: 2015, pib_current_price: 30011963.99, pib_percentage_structure: 19.96043729, pib_variation_rate: 3.930404178 },
    { province: "Almería", year: 2011, pib_current_price: 12151269.59, pib_percentage_structure: 8.211824048, pib_variation_rate: -6.038435125 },
    { province: "Cádiz", year: 2012, pib_current_price: 30011963.99, pib_percentage_structure: 19.96043729, pib_variation_rate: 3.930404178 },
    { province: "Cádiz", year: 2018, pib_current_price: 14101232, pib_percentage_structure: 8.380260375, pib_variation_rate: 2.099969438 },
    { province: "Granada", year: 2015, pib_current_price: 16170570.78, pib_percentage_structure: 10.75476647, pib_variation_rate: 4.166229745 }];

function sete() {
    var seleccionados = datos_ejemplos_sete.filter((n) => n.province === "Cádiz").map((n) => { return n.pib_current_price });
    return "Media del precio actual del pib de Cádiz: " + seleccionados.reduce((a, b) => a + b, 0) / seleccionados.length;
}
app.get("/samples/src", (req, res) => {
    res.send(sete());
    console.log("Cálculo algoritmo");
});

/*F05*/
//f05 pablo
const pvl = require("./index-PVL");
const lector = require("./lector")
var XLSX = require("xlsx");
var bodyParser = require("body-parser");
app.use(bodyParser.json());
const BASE_API_URL = "/api/v1";

//var dat = pvl.datos_ejemplos_pablo;

var JSONP = lector.lector(XLSX.readFile("./Datos/Datos.xls"));
var datos_json = [];
app.get(BASE_API_URL + "/PABLO", (req, res) => {
    res.send(datos_json
    );
    console.log("New request for pvl exercise");
});

app.get(BASE_API_URL + "PABLO/loadInitialData", (req, res) => {
    if (datos_json
        .length() <= 0) {
        res.send(JSONP)

    } else {
        res.send(datos_json
        );
        console.log("Cálculo algoritmo");
    }
});
//f05 jorge
var datos_json_jorge = [];
const rutaJorge = "/api/v1/market-prices-stats";
//TAREA 10 jorge
app.get(rutaJorge + "loadInitialData", (req, res) => {
    if (datos_json_jorge.length === 0) {
        datos_json_jorge.push(index_jorge.datos_aleatorios_jorge);
        res.json(datos_json_jorge);
        console.log("Se han insertado " + datos_json_jorge[0].length + " datos.");
    } else {
        res.send("El array ya contiene datos");
    }
    console.log("New GET to /market-prices-stats/loadInitialData");
});
//POST nuevos datos jorge
app.get(rutaJorge, (request, response) => {
    var newData = request.body;
    console.log(`newData = ${JSON.stringify(newData, null, 2)}`);
    console.log("New POST to /market-prices-stats");
    contacts.push(newData);
    response.sendStatus(201);
});
//GET rutaJorge
app.get(rutaJorge, (req, res) => {
    res.json(index_jorge.datos_jorge);
    res.status(200);
});
//POST rutaJorge
app.post(rutaJorge, (req, res) => {
    if (!req.body) {
        res.status(400).send("Hay que insertar datos.");
    } else {
        if (index_jorge.datos_jorge.some(x => {
            x.province === req.body.province &&
                x.pib_current_price === req.body.pib_current_price &&
                x.pib_percentage_structure === req.body.pib_percentage_structure &&
                x.pib_variation_rate === req.body.pib_variation_rate})) {
            res.status(409).send("El recurso ya existe.");
        } else {
            index_jorge.datos_jorge.push(req.body);
            res.status(201).send("El recurso se ha creado correctamente.");
        }
    }
});
//PUT rutaJorge
app.put(rutaJorge, (req, res) => {
    res.status(405).send("El método PUT no está permitido.");
});

//DELETE rutaJorge
app.delete(rutaJorge, (req, res) => {
    index_jorge.datos_jorge = [];
    res.status(200).send("Los datos se han borrado correctamente.");
});