/*F05 SETEFILLA*/

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