const index_jorge = require('./index-JFS.js');
const rutaJorge = "/api/v1/market-prices-stats";

module.exports = {
    api: (app) => {
        /*F05*/
        var datos_json_jorge = [];
        //INICIALIZA DATOS
        app.get(rutaJorge + "/loadInitialData", (req, res) => {
            if (datos_json_jorge.length === 0) {
                datos_json_jorge = index_jorge.datos_jorge;
                res.json(datos_json_jorge).status(200);
                console.log("Se han insertado " + datos_json_jorge.length + " datos.");
            } else {
                res.send("El array ya contiene datos, son estos: \n").json(datos_json_jorge);
            }
            console.log("New GET to /market-prices-stats/loadInitialData");
        });
        //GET provincia + año
        app.get(rutaJorge + '/:province' + '/:year', (req, res) => {
            const year = parseInt(req.params.year);
            const province = req.params.province;
            const provSelec = datos_json_jorge.filter(x => x.province === province);
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
            const body = req.body;
            if (!body || !body.province || !body.pib_current_price || !body.pib_percentage_structure || !body.pib_variation_rate) {
                res.status(400).send("Hay que insertar datos o faltan campos.");
            } else {
                newData = req.body;
                if (datos_json_jorge.some(x =>
                    x.province === newData.province &&
                    x.pib_current_price === newData.pib_current_price &&
                    x.pib_percentage_structure === newData.pib_percentage_structure &&
                    x.pib_variation_rate === newData.pib_variation_rate)) {
                    res.status(409).send("El recurso ya existe.");
                } else {
                    datos_json_jorge.push(req.body);
                    console.log(`newData = ${JSON.stringify(req.body, null, 2)}`);
                    console.log("New POST to /market-prices-stats");
                    res.status(201).send("El recurso se ha creado correctamente.");
                }
            }
        });
        //POST Ruta específica 
        app.post(rutaJorge + '/:pronvince/:year', (req, res) => {
            res.status(405).send("POST no está permitido en esta ruta.");
        });

        //PUT actualizar estadistica
        app.put(rutaJorge + '/:province' + '/:year', (req, res) => {
            const province = req.params.province;
            const year = parseInt(req.params.year);
            const existe = datos_json_jorge.find(p => p.province === province && p.year === year);
            if (!existe) {
                res.status(400).send("Estadística incorrecta.");
            } else {
                if (!req.body.province || !req.body.year || !req.body.pib_current_price || !req.body.pib_percentage_structure || !req.body.pib_variation_rate) {
                    res.status(400).send("Faltan campos en el body.");
                } else {
                    existe.province = req.body.province;
                    existe.year = req.body.year;
                    existe.pib_current_price = req.body.pib_current_price;
                    existe.pib_percentage_structure = req.body.pib_percentage_structure;
                    existe.pib_variation_rate = req.body.pib_variation_rate;
                    res.status(200).send("Estadística actualizada correctamente");
                    console.log("New PUT to /market-prices-stats/" + province + "/" + year);
                }
            }
        });
        //PUT rutaJorge
        app.put(rutaJorge, (req, res) => {
            res.status(405).send("PUT no está permitido en esta ruta.");
        });
        //DELETE rutaJorge
        app.delete(rutaJorge, (req, res) => {
            datos_json_jorge = [];
            res.status(200).send("Los datos se han borrado correctamente.");
        });
        //DELETE de la ruta específica.
        app.delete(rutaJorge + "/:province/:year", (req, res) => {
            const province = req.params.province;
            const year = req.params.year;
            datos_json_jorge = datos_json_jorge.filter(item => item.province !== province && item.year !== year);
            res.status(200).send("El recurso se ha borrado correctamente.");
        });
        //GET periodo concreto o por año o get rutaJorge
        app.get(rutaJorge, (req, res) => {
            const from = req.query.from;
            const to = req.query.to;
            const datosSelecc = datos_json_jorge.filter(x => x.year >= from && x.year <= to);
            if (from && to) {
                if (from >= to) {
                    res.status(400).send("El rango es incorrecto");
                } else {
                    res.status(200).json(datosSelecc);
                    console.log(`New GET to /market-prices-stats?from=${from}&to=${to}`);
                }
            }
            else {
                const { year } = req.query;
                if (year) {
                    const yearSelecc = datos_json_jorge.filter(x => x.year === parseInt(year));
                    console.log(`New GET to /market-prices-stats?year=${year}`);
                    res.json(yearSelecc).status(200);
                } else {
                    res.status(200).json(datos_json_jorge);
                    console.log("New GET to /market-prices-stats");
                }
            }
        });

        //GET periodo concreto + provincia
        app.get(rutaJorge + '/:province', (req, res) => {
            const province = req.params.province;
            const from = req.query.from;
            const to = req.query.to;
            const yearSelec = datos_json_jorge.filter(x => x.year >= from && x.year <= to);
            const provSelecc = yearSelec.filter(x => x.province == province);
            if (from && to) {
                if (from >= to) {
                    res.status(400).send("El rango es incorrecto");
                } else {
                    res.status(200).json(provSelecc);
                    console.log(`New GET to /market-prices-stats/${province}?from=${from}&to=${to}`);
                }
            }
            else {
                const provSeleccionda = datos_json_jorge.filter(x => x.province === province);
                res.json(provSeleccionda).status(200);
                console.log("New GET to /market-prices-stats/" + province);
            }
        })
    }
};


