//Importaciones
const pvl = require("./index-PVL.js");
module.exports =(app)=>{
    
    var JSONP = [];
const ruta = "/api/v1/workingplaces-stats";

app.get("/samples/pvl", (req, res) => {
    res.send(pvl.media_variation_rate(pvl.datos_ejemplos_pablo, "Granada"));
    console.log("New request for pvl exercise");
});
app.get(ruta, (req, resp) => {
    resp.send(pvl.datos_ejemplos_pablo);
    resp.status(200);
    console.log("New request for pvl exercise");
});

//TAREA 10 GET PABLO
app.get(ruta + "/loadInitialData", (req, res) => {
    if (JSONP.length === 0) {
      JSONP = pvl.datos_ejemplos_pablo;
      res.json(JSONP)
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
app.get(ruta + '/:province', (req, res) => {
    const province = req.params.province.toLowerCase();
    const provSeleccionda = pvl.datos_ejemplos_pablo.filter(x => x.province.toLowerCase() === province);
    res.json(provSeleccionda);
    console.log("New GET to /workingplaces-stats/" + province);
    res.status(200);
});
app.get(ruta + '/:province' + '/:year', (req, res) => {
    const year = parseInt(req.params.year);
    const province = req.params.province.toLowerCase();
    const provSelec = pvl.datos_ejemplos_pablo.filter(x => x.province.toLowerCase() === province);
    const yearSelec = provSelec.filter(x => x.year === year);
    res.json(yearSelec);
    console.log("New GET to /workingplaces-stats/" + province + "/" + year);
    res.status(200);
});
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
app.post(ruta + "/loadInitialData", (req, res) => {
    res.status(405).send("POST no está permitido en esta ruta.");
});
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
app.put(ruta, (req, res) => {
    res.status(405).send("El método PUT no está permitido para esta ruta.");
});
app.put(ruta + "/loadInitialData", (req, res) => {
    if (!req.body) {
        res.status(400).send("Hay que insertar datos.");
    } else {
        JSONP = req.body;
        res.status(200).send("El recurso se ha actualizado correctamente.");
    }
});
app.delete(ruta, (req, res) => {
    pvl.datos_ejemplos_pablo = [];
    res.status(200).send("Los datos se han borrado correctamente.");
});
app.delete(ruta + "/loadInitialData", (req, res) => {
    JSONP = [];
    res.status(200).send("El recurso se ha borrado correctamente.");
});
}