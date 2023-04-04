import { datos_jorge } from './index-JFS.js';
const rutaJorge = "/api/v2/market-prices-stats";
import Datastore from 'nedb';
var db = new Datastore();


function loadBackend_jorge(app) {
    //POSTMAN DOCUMENTATION
    app.get(rutaJorge + '/docs', function (req, res) {
        res.status(301).redirect('https://documenter.getpostman.com/view/26013124/2s93RQTZb2');
    });
    /*------------GET------------*/
    //GET carga de datos
    app.get(rutaJorge + "/loadInitialData", (req, res) => {
        console.log("New GET to /market-prices-stats/loadInitialData");
        db.find({}, async (err, data) => {
            if (err) {
                console.log(`Algo ha salido mal cargando los datos: ${err}.`);
                res.sendStatus(500);
            } else if (data.length != 0) {
                console.log(`Ya hay datos cargados.`);
                res.sendStatus(200);
            } else {
                db.insert(datos_jorge);
                console.log(`Se han insertado ${datos_jorge.length} datos.`);
                res.sendStatus(201);
            }
        });
    });

    //GET provincia + año
    app.get(rutaJorge + '/:province' + '/:year', (req, res) => {
        const year = parseInt(req.params.year);
        const province = req.params.province;
        const limit = req.query.limit;
        const offset = req.query.offset;
        console.log("New GET to /market-prices-stats/" + province + "/" + year);
        const filteredConditions = new Map();
        filteredConditions.set('province', province);
        filteredConditions.set('year', year);
        var obj;
        const pib_current_price_over = parseFloat(req.query.pib_current_price_over);
        if (!isNaN(pib_current_price_over)) filteredConditions.set('pib_current_price', { '$gte': pib_current_price_over });
        const pib_percentage_structure_over = parseFloat(req.query.pib_percentage_structure_over);
        if (!isNaN(pib_percentage_structure_over)) filteredConditions.set('pib_percentage_structure', { '$gte': pib_percentage_structure_over });
        const pib_variation_rate_over = parseFloat(req.query.pib_variation_rate_over);
        if (!isNaN(pib_variation_rate_over)) filteredConditions.set('pib_variation_rate', { '$gte': pib_variation_rate_over });
        const pib_current_price_lower = parseFloat(req.query.pib_current_price_lower);
        if (!isNaN(pib_current_price_lower)) filteredConditions.set('pib_current_price', { '$lte': pib_current_price_lower });
        const pib_percentage_structure_lower = parseFloat(req.query.pib_percentage_structure_lower);
        if (!isNaN(pib_percentage_structure_lower)) filteredConditions.set('pib_percentage_structure', { '$lte': pib_percentage_structure_lower });
        const pib_variation_rate_lower = parseFloat(req.query.pib_variation_rate_lower);
        if (!isNaN(pib_variation_rate_lower)) filteredConditions.set('pib_variation_rate', { '$lte': pib_variation_rate_lower });
        if (filteredConditions.length === 0) obj = {};
        else obj = Object.fromEntries(filteredConditions);
        db.find(obj).skip(offset).limit(limit).exec(async (err, data) => {
            if (err) {
                console.log(`Algo ha salido mal: ${err}.`);
                res.sendStatus(500);
            } else {
                if (data.length === 0) {
                    res.sendStatus(404);
                    console.log(`No existe ningún recurso para la provincia: ${province}, en el año: ${year}.`);
                } else {
                    const recurso = data.map((x) => {
                        delete x._id;
                        return x;
                    });
                    res.status(200).json(recurso[0]);
                }
            };
        });
    });
    //GET provincia o provincia + periodo concreto 
    app.get(rutaJorge + '/:province', (req, res) => {
        const province = req.params.province;
        const from = req.query.from;
        const to = req.query.to;
        const limit = req.query.limit;
        const offset = req.query.offset;
        const filteredConditions = new Map();
        filteredConditions.set('province', province);
        var obj;
        const year = parseInt(req.query.year);
        if (!isNaN(year)) filteredConditions.set('year', year);
        const pib_current_price_over = parseFloat(req.query.pib_current_price_over);
        if (!isNaN(pib_current_price_over)) filteredConditions.set('pib_current_price', { '$gte': pib_current_price_over });
        const pib_percentage_structure_over = parseFloat(req.query.pib_percentage_structure_over); /* */
        if (!isNaN(pib_percentage_structure_over)) filteredConditions.set('pib_percentage_structure', { '$gte': pib_percentage_structure_over });
        const pib_variation_rate_over = parseFloat(req.query.pib_variation_rate_over);
        if (!isNaN(pib_variation_rate_over)) filteredConditions.set('pib_variation_rate', { '$gte': pib_variation_rate_over });
        const pib_current_price_lower = parseFloat(req.query.pib_current_price_lower);
        if (!isNaN(pib_current_price_lower)) filteredConditions.set('pib_current_price', { '$lte': pib_current_price_lower });
        const pib_percentage_structure_lower = parseFloat(req.query.pib_percentage_structure_lower);
        if (!isNaN(pib_percentage_structure_lower)) filteredConditions.set('pib_percentage_structure', { '$lte': pib_percentage_structure_lower });
        const pib_variation_rate_lower = parseFloat(req.query.pib_variation_rate_lower);
        if (!isNaN(pib_variation_rate_lower)) filteredConditions.set('pib_variation_rate', { '$lte': pib_variation_rate_lower });
        if (filteredConditions.length === 0) obj = {};
        else obj = Object.fromEntries(filteredConditions);
        db.find(obj).skip(offset).limit(limit).exec(async (err, data) => {
            const dataSelec = data.filter(x => x.year >= from && x.year <= to);
            if (err) {
                console.log(`Algo ha salido mal: ${err}.`);
                res.sendStatus(500);
            } else {
                if (from && to) {
                    if (from >= to) {
                        res.sendStatus(400);
                        console.log(`El rango desde: ${from} hasta ${to} es incorrecto.`);
                    } else {
                        res.json(dataSelec);
                        console.log(`New GET to /market-prices-stats/${province}?from=${from}&to=${to}`);
                    }
                } else {
                    res.json(data.map((x) => {
                        delete x._id;
                        return x;
                    }));
                    console.log("New GET to /market-prices-stats/" + province);
                }
            };
        });
    });
    //GET periodo concreto/año concreto/datos DB
    app.get(rutaJorge, (req, res) => {
        const from = req.query.from;
        const to = req.query.to;
        const limit = req.query.limit;
        const offset = req.query.offset;
        const filteredConditions = new Map();
        var obj;
        const year = parseInt(req.query.year);
        if (!isNaN(year)) filteredConditions.set('year', year);
        const pib_current_price_over = parseFloat(req.query.pib_current_price_over);
        if (!isNaN(pib_current_price_over)) filteredConditions.set('pib_current_price', { '$gte': pib_current_price_over });
        const pib_percentage_structure_over = parseFloat(req.query.pib_percentage_structure_over);
        if (!isNaN(pib_percentage_structure_over)) filteredConditions.set('pib_percentage_structure', { '$gte': pib_percentage_structure_over });
        const pib_variation_rate_over = parseFloat(req.query.pib_variation_rate_over);
        if (!isNaN(pib_variation_rate_over)) filteredConditions.set('pib_variation_rate', { '$gte': pib_variation_rate_over });
        const pib_current_price_lower = parseFloat(req.query.pib_current_price_lower);
        if (!isNaN(pib_current_price_lower)) filteredConditions.set('pib_current_price', { '$lte': pib_current_price_lower });
        const pib_percentage_structure_lower = parseFloat(req.query.pib_percentage_structure_lower);
        if (!isNaN(pib_percentage_structure_lower)) filteredConditions.set('pib_percentage_structure', { '$lte': pib_percentage_structure_lower });
        const pib_variation_rate_lower = parseFloat(req.query.pib_variation_rate_lower);
        if (!isNaN(pib_variation_rate_lower)) filteredConditions.set('pib_variation_rate', { '$lte': pib_variation_rate_lower });
        if (filteredConditions.length === 0) obj = {};
        else obj = Object.fromEntries(filteredConditions);
        db.find(obj).skip(offset).limit(limit).exec(async (err, data) => {
            if (err) {
                console.log(`Algo ha salido mal: ${err}.`);
                res.sendStatus(500);
            } else {
                if (from && to) {
                    const dataSelec = data.filter(x => x.year >= from && x.year <= to);
                    if (from >= to) {
                        res.sendStatus(400);
                        console.log(`El rango desde ${from} hasta ${to} es incorrecto.`);
                    } else {
                        res.status(200).json(dataSelec.map((x) => {
                            delete x._id;
                            return x;
                        }));
                        console.log(`New GET to /market-prices-stats?from=${from}&to=${to}`);
                    }
                } else {
                    res.status(200).json(data.map((x) => {
                        delete x._id;
                        return x;
                    }));
                    console.log("New GET to /market-prices-stats");
                }
            };
        });
    });
    /*------------POST------------*/
    //POST rutaJorge
    app.post(rutaJorge, (req, res) => {
        const body = req.body;
        console.log("New POST to /market-prices-stats");
        db.find({}, async (err, data) => {
            if (err) {
                console.log(`Algo ha salido mal: ${err}.`);
                res.sendStatus(500);
            } else {
                if (!body || !body.province || !body.pib_current_price || !body.pib_percentage_structure || !body.pib_variation_rate) {
                    res.status(400).send("Hay que insertar datos o faltan campos.");
                } else {
                    if (data.some(x =>
                        x.province === body.province && x.year === body.year)) {
                        res.status(409).send("El recurso ya existe.");
                    } else {
                        if (datos_jorge.some(x => x.province === body.province)) {
                            db.insert(req.body);
                            console.log(`newData = ${JSON.stringify(body, null, 2)}`);
                            console.log("New POST to /market-prices-stats");
                            res.status(201).send("El recurso se ha creado correctamente.");
                        } else {
                            res.status(409).send("La provincia tiene que ser de Andalucía.");
                        }
                    }
                }
            };
        });

    });
    //POST Ruta específica 
    app.post(rutaJorge + '/:pronvince/:year', (req, res) => {
        res.status(405).send("POST no está permitido en esta ruta.");
    });
    /*------------PUT------------*/
    //PUT actualizar estadistica
    app.put(rutaJorge + '/:province' + '/:year', (req, res) => {
        const province = req.params.province;
        const year = parseInt(req.params.year);
        console.log("New PUT to /market-prices-stats/" + province + "/" + year);
        db.find({ province: province, year: year }, async (err, data) => {
            if (err) {
                console.log(`Algo ha salido mal: ${err}.`);
                res.sendStatus(500);
            }
            if (data.length === 0) {
                res.status(400).send("Estadística incorrecta.");
            } else {
                if (!req.body.province || !req.body.year || !req.body.pib_current_price || !req.body.pib_percentage_structure || !req.body.pib_variation_rate) {
                    res.status(400).send("Faltan campos en el body.");
                } else {
                    if (data.some(x => x.province === req.body.province)) {
                        db.update({ province: province, year: year }, {
                            $set: {
                                province: req.body.province,
                                year: req.body.year,
                                pib_current_price: req.body.pib_current_price,
                                pib_percentage_structure: req.body.pib_percentage_structure,
                                pib_variation_rate: req.body.pib_variation_rate
                            }
                        }, {}, async (error, dataRemoved) => {
                            if (dataRemoved === 0) {
                                res.sendStatus(404);
                            } else {
                                if (dataRemoved === 1) {
                                    res.status(200).send("Estadística actualizada correctamente");
                                }
                                else {
                                    res.sendStatus(500);
                                }
                            }
                            if (error) {
                                console.log(`Algo ha salido mal: ${err}.`);
                                res.sendStatus(500);
                            }
                        });
                    } else {
                        res.status(409).send("La provincia tiene que ser de Andalucía.");
                    }
                }
            }
        });
    });
    //PUT rutaJorge
    app.put(rutaJorge, (req, res) => {
        res.status(405).send("PUT no está permitido en esta ruta.");
    });
    /*------------DELETE------------*/
    //DELETE rutaJorge
    app.delete(rutaJorge, (req, res) => {
        db.remove({}, { multi: true }, async (err, dataRemoved) => {
            if (err) {
                console.log(`Ha habido un error borrando ${dataRemoved.length} datos: ${err}`);
                res.sendStatus(500);
            } else {
                res.status(200).send(`Los datos se han borrado correctamente. Datos borrados: ${dataRemoved}`);
                console.log(`Se han borrado los datos correctamente.`)
            }
        });
    });
    //DELETE recurso especifido
    app.delete(rutaJorge + "/:province/:year", (req, res) => {
        const province = req.params.province;
        const year = parseInt(req.params.year);
        db.remove({ province: province, year: year }, (err, dataRemoved) => {
            if (err) {
                console.log(`Ha habido un error borrando /${province}/${year}: ${err}`);
                res.sendStatus(500);
            } else {
                console.log(`Recurso /${province}/${year} borrado correctamnte. Datos borrados: ${dataRemoved}`);
                res.status(200).send("El recurso se ha borrado correctamente.");
            }
        });
    });
};
export { loadBackend_jorge };