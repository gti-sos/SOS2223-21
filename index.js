var port = process.env.PORT || 12345;
/*F04*/
var cool = require("cool-ascii-faces");
var express = require("express");
var modulo_pablo = require('./modulo-pvl');
const pvl = require("./index-PVL");
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
    { province: "Granada", year: 2015, pib_current_price: 16170570.78, pib_percentage_structure: 10.75476647, pib_variation_rate: 4.166229745 }
];

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
var bodyParser = require("body-parser");
app.use(bodyParser.json());
modulo_pablo(app);

//f05 jorge
var datos_json_jorge = [];
const rutaJorge = "/api/v1/market-prices-stats";
//TAREA 10 GET jorge
app.get(rutaJorge + "/loadInitialData", (req, res) => {
    if (datos_json_jorge.length === 0) {
        datos_json_jorge.push(index_jorge.datos_aleatorios_jorge);
        res.json(datos_json_jorge);
        res.status(200).send("Se ha insertado correctamente los datos.");
        console.log("Se han insertado " + datos_json_jorge[0].length + " datos.");
    } else {
        res.send("El array ya contiene datos, son estos: \n");
        res.json(datos_json_jorge);
    }
    console.log("New GET to /market-prices-stats/loadInitialData");
});
//GET provincia + año
app.get(rutaJorge + '/:province' + '/:year', (req, res) => {
    const year = parseInt(req.params.year);
    const province = req.params.province;
    const provSelec = index_jorge.datos_jorge.filter(x => x.province === province);
    const yearSelec = provSelec.filter(x => x.year === year);
    if (yearSelec) {
        res.json(yearSelec).status(200);
        console.log("New GET to /market-prices-stats/" + province + "/" + year);
    } else {
        res.status(404).json({ message: `No existe ningún recurso para la provincia: ${province} en el año: ${year}.` });
    }
});
//POST rutaJorge
app.post(rutaJorge, (req, res) => {
    if (!req.body) {
        res.status(400).send("Hay que insertar datos.");
    } else {
        newData = req.body;
        if (index_jorge.datos_jorge.some(x =>
                x.province === newData.province &&
                x.pib_current_price === newData.pib_current_price &&
                x.pib_percentage_structure === newData.pib_percentage_structure &&
                x.pib_variation_rate === newData.pib_variation_rate)) {
            res.status(409).send("El recurso ya existe.");
        } else {
            index_jorge.datos_jorge.push(req.body);
            console.log(`newData = ${JSON.stringify(req.body, null, 2)}`);
            console.log("New POST to /market-prices-stats");
            res.status(201).send("El recurso se ha creado correctamente.");
        }
    }
});
//Ruta específica POST
app.post(rutaJorge + "/loadInitialData", (req, res) => {
    res.status(405).send("POST no está permitido en esta ruta.");
});
//PUT actualizar estadistica
app.put(rutaJorge + '/:province' + '/:year', (req, res) => {
    const province = req.params.province;
    const year = parseInt(req.params.year);

    const existe = index_jorge.datos_jorge.find(p => p.province === province && p.year === year);
    if (!existe || province !== req.body.province || year !== req.body.year) {
        return res.status(400).send("Estadística incorrecta.");
    } else {
        existe.pib_current_price = req.body.pib_current_price || existe.pib_current_price;
        existe.pib_percentage_structure = req.body.pib_percentage_structure || existe.pib_percentage_structure;
        existe.pib_variation_rate = req.body.pib_variation_rate || existe.pib_variation_rate;
        res.status(200).send("Estadística actualizada correctamente");
        console.log("New PUT to /market-prices-stats/" + province + "/" + year);
    }
});
//PUT rutaJorge
app.put(rutaJorge, (req, res) => {
    res.status(405).send("PUT no está permitido en esta ruta.");
});
// Ruta Específica PUT
app.put(rutaJorge + "/loadInitialData", (req, res) => {
    if (!req.body) {
        res.status(400).send("Hay que insertar datos.");
    } else {
        datos_json_jorge = req.body;
        res.status(200).send("El recurso se ha actualizado correctamente.");
    }
});
//DELETE rutaJorge
app.delete(rutaJorge, (req, res) => {
    index_jorge.datos_jorge = [];
    res.status(200).send("Los datos se han borrado correctamente.");
});
//DELETE de la ruta específica.
app.delete(rutaJorge + "/loadInitialData", (req, res) => {
    datos_json_jorge = [];
    res.status(200).send("El recurso se ha borrado correctamente.");
});
//GET periodo concreto
app.get(rutaJorge, (req, res) => {
    const from = req.query.from;
    const to = req.query.to;
    const datosSelecc = index_jorge.datos_jorge.filter(x => x.year >= from && x.year <= to);
    if (from && to) {
        if (from >= to) {
            res.status(400).send("El rango es incorrecto");
        } else {
            res.status(200).json(datosSelecc);
            console.log(`New GET to /market-prices-stats?from=${from}&to=${to}`);
        }
    } else {
        const { year } = req.query;
        if (year) {
            const yearSelecc = index_jorge.datos_jorge.filter(x => x.year === parseInt(year));
            console.log(`New GET to /market-prices-stats?year=${year}`);
            res.json(yearSelecc);
            res.status(200);
        } else {
            res.status(200);
            res.json(index_jorge.datos_jorge);
            console.log("New GET to /market-prices-stats");
        }
    }
});

//GET periodo concreto + provincia
app.get(rutaJorge + '/:province', (req, res) => {
    const province = req.params.province;
    const from = req.query.from;
    const to = req.query.to;
    const yearSelec = index_jorge.datos_jorge.filter(x => x.year >= from && x.year <= to);
    const provSelecc = yearSelec.filter(x => x.province == province);
    if (from && to) {
        if (from >= to) {
            res.status(400).send("El rango es incorrecto");
        } else {
            res.status(200).json(provSelecc);
            console.log(`New GET to /market-prices-stats/${province}?from=${from}&to=${to}`);
        }
    } else {
        const provSeleccionda = index_jorge.datos_jorge.filter(x => x.province === province);
        res.json(provSeleccionda);
        console.log("New GET to /market-prices-stats/" + province);
        res.status(200);

    }
});


/*F05*/
//f05 sete


//f05 sete
var datos_json_sete = [];
const rutaSete = "/api/v1/salaried-stats";
//TAREA 10 GET sete
app.get(rutaSete + "/loadInitialData", (req, res) => {
    if (datos_json_sete.length === 0) {
        datos_json_sete.push({ province: "Almería", year: 2010, pib_current_price: 149627412, pib_percentage_structure: 100, pib_variation_rate: 298281107 }, { province: "Cádiz", year: 2014, pib_current_price: 19540300.38, pib_percentage_structure: 13.62894036, pib_variation_rate: -0.83632259 }, { province: "Granada", year: 2010, pib_current_price: 21225978.10, pib_percentage_structure: 14.18588868, pib_variation_rate: 0.908546693 }, { province: "Cádiz", year: 2017, pib_current_price: 10986877.00, pib_percentage_structure: 6.751839242, pib_variation_rate: 11.72504816 }, { province: "Jaén", year: 2010, pib_current_price: 15922742.43, pib_percentage_structure: 10.64159449, pib_variation_rate: -2.5473448 }, { province: "Málaga", year: 2015, pib_current_price: 30011963.99, pib_percentage_structure: 19.96043729, pib_variation_rate: 3.930404178 }, { province: "Almería", year: 2011, pib_current_price: 12151269.59, pib_percentage_structure: 8.211824048, pib_variation_rate: -6.038435125 }, { province: "Cádiz", year: 2012, pib_current_price: 30011963.99, pib_percentage_structure: 19.96043729, pib_variation_rate: 3.930404178 }, { province: "Cádiz", year: 2018, pib_current_price: 14101232, pib_percentage_structure: 8.380260375, pib_variation_rate: 2.099969438 }, { province: "Granada", year: 2015, pib_current_price: 16170570.78, pib_percentage_structure: 10.75476647, pib_variation_rate: 4.166229745 });
        res.status(200).send("Se ha insertado correctamente los datos.");
        console.log("Se han insertado " + datos_json_sete[0].length + " datos.");
    } else {
        res.send("El array ya contiene datos, son estos: \n");
    }
    console.log("New GET to /salaried-stats/loadInitialData");
});

//GET provincia + año
app.get(rutaSete + '/:province' + '/:year', (req, res) => {
    const year = parseInt(req.params.year);
    const province = req.params.province;
    const provSelec = datos_json_sete.filter(x => x.province === province);
    const yearSelec = provSelec.filter(x => x.year === year);
    if (yearSelec) {
        res.json(yearSelec).status(200);
        console.log("New GET to /salaried-stats/" + province + "/" + year);
    } else {
        res.status(404).json({ message: `No existe ningún recurso para la provincia: ${province} en el año: ${year}.` });
    }
});

//GET
app.get(rutaSete, (req, res) => {
    if (datos_json_sete) {
        res.json(datos_json_sete).status(200);
        console.log("New GET to /salaried-stats/");
    } else {
        res.status(404).json({ message: `No existe ningún recurso:` });
    }
});

//POST rutaSete
app.post(rutaSete, (req, res) => {
    console.log(req.body);
    if (!req.body) {
        res.status(400).send("Hay que insertar datos.");
    } else {
        newData = req.body;
        if (datos_json_sete.some(x =>
                x.province === newData.province &&
                x.pib_current_price === newData.pib_current_price &&
                x.pib_percentage_structure === newData.pib_percentage_structure &&
                x.pib_variation_rate === newData.pib_variation_rate)) {
            res.status(409).send("El recurso ya existe.");
        } else {
            datos_json_sete.push(req.body);
            console.log(`newData = ${JSON.stringify(req.body, null, 2)}`);
            console.log("New POST to /salaried-stats");
            res.status(201).send("El recurso se ha creado correctamente.");
        }
    }
});

//Ruta específica POST
app.post(rutaSete + "/loadInitialData", (req, res) => {
    res.status(405).send("POST no está permitido en esta ruta.");
});

//PUT actualizar estadistica
app.put(rutaSete + '/:province' + '/:year', (req, res) => {
    const province = req.params.province;
    const year = parseInt(req.params.year);

    const existe = datos_json_sete.find(p => p.province === province && p.year === year);
    if (!existe || province !== req.body.province || year !== req.body.year) {
        return res.status(400).send("Estadística incorrecta.");
    } else {
        existe.pib_current_price = req.body.pib_current_price || existe.pib_current_price;
        existe.pib_percentage_structure = req.body.pib_percentage_structure || existe.pib_percentage_structure;
        existe.pib_variation_rate = req.body.pib_variation_rate || existe.pib_variation_rate;
        res.status(200).send("Estadística actualizada correctamente");
        console.log("New PUT to /salaried-stats/" + province + "/" + year);
    }
});
//PUT rutaSete
app.put(rutaSete, (req, res) => {
    res.status(405).send("PUT no está permitido en esta ruta.");
});


//DELETE rutaSete
app.delete(rutaSete, (req, res) => {
    datos_json_sete = [];
    res.status(200).send("Los datos se han borrado correctamente.");
});
//DELETE de la ruta específica.
app.delete(rutaSete + "/loadInitialData", (req, res) => {
    datos_json_sete = [];
    res.status(200).send("El recurso se ha borrado correctamente.");
});

//GET periodo concreto
app.get(rutaJorge, (req, res) => {
    const from = req.query.from;
    const to = req.query.to;
    const datosSelecc = datos_json_sete.filter(x => x.year >= from && x.year <= to);
    if (from && to) {
        if (from >= to) {
            res.status(400).send("El rango es incorrecto");
        } else {
            res.status(200).json(datosSelecc);
            console.log(`New GET to /salaried-stats?from=${from}&to=${to}`);
        }
    } else {
        const { year } = req.query;
        if (year) {
            const yearSelecc = datos_json_sete.filter(x => x.year === parseInt(year));
            console.log(`New GET to /salaried-stats?year=${year}`);
            res.json(yearSelecc);
        } else {
            res.json(datos_json_sete);
            console.log("New GET to /salaried-stats");
        }
    }
});

//GET periodo concreto + provincia
app.get(rutaSete + '/:province', (req, res) => {
    const province = req.params.province;
    const from = req.query.from;
    const to = req.query.to;
    const yearSelec = datos_json_sete.filter(x => x.year >= from && x.year <= to);
    const provSelecc = yearSelec.filter(x => x.province == province);
    if (from && to) {
        if (from >= to) {
            res.status(400).send("El rango es incorrecto");
        } else {
            res.status(200).json(provSelecc);
            console.log(`New GET to /salaried-stats/${province}?from=${from}&to=${to}`);
        }
    } else {
        const provSeleccionda = datos_json_sete.filter(x => x.province === province);
        res.json(provSeleccionda);
        console.log("New GET to /salaried-stats/" + province);
    }
});