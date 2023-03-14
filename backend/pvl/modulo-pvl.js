//Importaciones
const pvl = require("./index-PVL.js");
module.exports = (app) => {

    var workinplaces_stats = pvl.datos_ejemplos_pablo;
    const ruta = "/api/v1/workingplaces-stats";

    app.get("/samples/pvl", (req, res) => {
        res.send(pvl.media_variation_rate(pvl.datos_ejemplos_pablo, "Granada"));
        console.log("New request for pvl exercise");
    });

    //GET LISTA DE PUEBLOS

    app.get(ruta, (req, resp) => {
        resp.send(pvl.datos_ejemplos_pablo);
        resp.status(200);
        console.log("New request for pvl exercise");
    });

    //TAREA 10 GET PABLO
    app.get(ruta + "/loadInitialData", (req, res) => {
        if (workinplaces_stats.length === 0) {
            workinplaces_stats = pvl.datos_ejemplos_pablo;
            res.json(workinplaces_stats)
            res.status(200);
            console.log("New api request")
        } else {
            res.json('Ya tiene contenidos datos iniciales');
            console.log('No es necesario cargar datos iniciales')
        }
    });

    app.get(ruta, (req, res) => {
        const { year } = req.query;
        if (year) {
            const year = pvl.datos_ejemplos_pablo.filter(x => x.year === parseInt(year));
            console.log("New GET to /workingplaces-stats");
            res.json(year);
            res.status(200);
        } else {
            res.status(200);
            res.json(pvl.datos_ejemplos_pablo);
            console.log("New GET to /workingplaces-stats");
        }
    });
    //GET DATOS PROVINCIA
    app.get(ruta + '/:province', (req, res) => {
        const province = req.params.province.toLowerCase();
        const provSeleccionda = pvl.datos_ejemplos_pablo.filter(x => x.province.toLowerCase() === province);
        res.json(provSeleccionda);
        console.log("New GET to /workingplaces-stats/" + province);
        res.status(200);
    });

    //GET DATOS PROVINCIA Y AÑO
    app.get(ruta + '/:province' + '/:year', (req, res) => {
        const year = parseInt(req.params.year);
        const province = req.params.province.toLowerCase();
        const provSelec = pvl.datos_ejemplos_pablo.filter(x => x.province.toLowerCase() === province);
        const yearSelec = provSelec.filter(x => x.year === year);
        res.json(yearSelec);
        console.log("New GET to /workingplaces-stats/" + province + "/" + year);
        res.status(200);
    });
    //POST CREA
    app.post(ruta, (req, res) => {
        if (!req.body) {
            res.status(400).send("Hay que insertar datos.");
        } else {
            newData = req.body;
            if (pvl.datos_ejemplos_pablo.some(x =>
                x.province === newData.province &&
                x.work_place === newData.work_place &&
                x.percentage_structure === newData.percentage_structure &&
                x.variation_rate === newData.variation_rate)) {
                res.status(409).send("El recurso ya existe.");
            } else {
                pvl.datos_ejemplos_pablo.push(req.body);
                console.log(`newData = ${JSON.stringify(req.body, null, 2)}`);
                console.log("New POST to /workingplaces-stats");
                res.status(201).send("El recurso se ha creado correctamente.");
            }
        }
    });
    //POST FALLO LoadInitialData(405)
    app.post(ruta + "/loadInitialData", (req, res) => {
        res.status(405).send("POST no está permitido en esta ruta.");
    });
    //PUT ()
    app.put(ruta + '/:province' + '/:year', (req, res) => {
        const province = req.params.province;
        const year = parseInt(req.params.year);

        const existe = pvl.datos_ejemplos_pablo.find(p => p.province === province && p.year === year);
        if (!existe || province !== req.body.province || year !== req.body.year) {
            return res.status(400).send("Estadística incorrecta.");
        } else {
            existe.work_place = req.body.work_place || existe.work_place;
            existe.percentage_structure = req.body.percentage_structure || existe.percentage_structure;
            existe.variation_rate = req.body.variation_rate || existe.variation_rate;
            res.status(200).send("Estadística actualizada correctamente");
            console.log("New PUT to /workingplaces-stats/" + province + "/" + year);
        }
    });
    //PUT NO PERMITIDO loadInitialData
    app.put(ruta, (req, res) => {
        res.status(405).send("El método PUT no está permitido para esta ruta.");
    });


    //DELETE TODOS
    app.delete(ruta, (req, res) => {
        workinplaces_stats = [];
        res.status(200).send("Los datos se han borrado correctamente.");
    });
    //DELETE UNO SOLO
    app.delete(ruta, (req, res) => {
        workinplaces_stats = [];
        res.status(200).send("Los datos se han borrado correctamente.");
    });

    app.delete('/api/v1/workinplaces-stats/:province', (req, res) => {
        const province = req.params.province;
        const filteredStats = workinplaces_stats.filter(stats => stats.province === province);

        if (filteredStats.length === 0) {
            res.status(404).json(`No se encontraron datos para ${province}`);
        } else {
            const newData = workinplaces_stats.filter(stats => stats.province !== province);
            const deleted = newData.length !== workinplaces_stats.length;
            workinplaces_stats = newData;

            if (deleted) {
                res.status(204).json(`Se ha borrado ${province}`);
                console.log("Datos borrados");
            } else {
                res.status(404).json(`No se encontraron datos que coincidan con los criterios de eliminación para ${province}`);
            }
        }
    });

}