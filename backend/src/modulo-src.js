/*F05 SETEFILLA*/

//************************ CONSTANTS AND REQUIRES *************************************************

const index_sete = require('./index-SRC.js');
var Datastore = require('nedb');
var db = new Datastore();
var datos_json_sete = [];
const rutaSete = "/api/v1/salaried-stats";

module.exports = {
        api: (app) => {
                //POSTMAN DOCUMENTATION
                app.get(rutaSete + '/docs', function(req, res) {
                    res.status(301).redirect('https://documenter.getpostman.com/view/26013124/2s93Jxr1Nx');
                });
                /*------------GET------------*/
                //GET carga de datos
                app.get(rutaSete + "/loadInitialData", (req, res) => {
                    console.log("New GET to /salaried-stats/loadInitialData");
                    db.find({}, async(err, data) => {
                        if (err) {
                            console.log(`Error carga de datos: ${err}.`);
                            res.sendStatus(500);
                        } else if (data.length != 0) {
                            console.log(`Ya hay datos cargados.`);
                            res.sendStatus(200);
                        } else {
                            db.insert(index_sete.datos_json_sete);
                            console.log(`Se han insertado ${index_sete.datos_json_sete.length} datos.`);
                            res.sendStatus(201);
                        }
                    });
                });

                //--------------------------------------------- GET ---------------------------------------------------------

                //****************************************GET loadInitialData ******************************************************************
                app.get(rutaSete + "/loadInitialData", (req, res) => {
                    if (datos_json_sete.length === 0) {
                        datos_json_sete.push({ province: "Almería", year: 2010, remuneration_of_employees: 149627412, remuneration_percentage_structure: 100, remuneration_variation_rate: 298281107 }, { province: "Cádiz", year: 2014, remuneration_of_employees: 19540300.38, remuneration_percentage_structure: 13.62894036, remuneration_variation_rate: -0.83632259 }, { province: "Granada", year: 2010, remuneration_of_employees: 21225978.10, remuneration_percentage_structure: 14.18588868, remuneration_variation_rate: 0.908546693 }, { province: "Cádiz", year: 2017, remuneration_of_employees: 10986877.00, remuneration_percentage_structure: 6.751839242, remuneration_variation_rate: 11.72504816 }, { province: "Jaén", year: 2010, remuneration_of_employees: 15922742.43, remuneration_percentage_structure: 10.64159449, remuneration_variation_rate: -2.5473448 }, { province: "Málaga", year: 2015, remuneration_of_employees: 30011963.99, remuneration_percentage_structure: 19.96043729, remuneration_variation_rate: 3.930404178 }, { province: "Almería", year: 2011, remuneration_of_employees: 12151269.59, remuneration_percentage_structure: 8.211824048, remuneration_variation_rate: -6.038435125 }, { province: "Cádiz", year: 2012, remuneration_of_employees: 30011963.99, remuneration_percentage_structure: 19.96043729, remuneration_variation_rate: 3.930404178 }, { province: "Cádiz", year: 2018, remuneration_of_employees: 14101232, remuneration_percentage_structure: 8.380260375, remuneration_variation_rate: 2.099969438 }, { province: "Granada", year: 2015, remuneration_of_employees: 16170570.78, remuneration_percentage_structure: 10.75476647, remuneration_variation_rate: 4.166229745 });
                        // Si se crean datos el estado es 200
                        res.status(200).send("Se ha insertado correctamente los datos.");
                        console.log("Se han insertado " + datos_json_sete[0].length + " datos.");
                    } else {
                        // Si existen datos no se introducen
                        res.send("El array ya contiene datos, son estos: \n");
                    }
                    console.log("New GET to /salaried-stats/loadInitialData");
                });

                //*************************************GET primero por provincia y luego por año*****************************************************

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

                //***********************************************GET lista de recursos ***********************************************
                app.get(rutaSete, (req, res) => {
                    if (datos_json_sete) {
                        res.json(datos_json_sete).status(200);
                        console.log("New GET to /salaried-stats/");
                    } else {
                        res.status(404).json({ message: `No existe ningún recurso:` });
                    }
                });

                //****************************** GET periodo concreto ****************************************
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

                //**************************      GET periodo concreto + provincia ****************************
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

                //--------------------------------------- POST ---------------------------------------------

                //**********************************************POST crear recurso***********************************************
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

                //POST NO PERMITIDO
                //********************************************POST a ruta específica *************************************
                app.post(rutaSete + "/loadInitialData", (req, res) => {
                    res.status(405).send("POST no está permitido en esta ruta.");
                });

                //----------------------------------------- PUTS-----------------------------------------------------------
                //*************************** PUT  CORRECTO A  /salaried-stats/province/year  *******************************
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
                //***********************************  PUT NO PERMITIDO A /salaried-stats ****************************
                app.put(rutaSete, (req, res) => {
                    res.status(405).send("PUT no está permitido en esta ruta.");
                });


                //***********************************   DELETE A salaried-stats - all data    ****************************************
                app.delete(rutaSete, (req, res) => {
                    datos_json_sete = [];
                    res.status(200).send("Los datos se han borrado correctamente.");
                });
                //****************************  DELETE /salaried-stats/province/year  ******************************
                app.delete(rutaSete + '/:province' + '/:year', (req, res) => {
                    datos_json_sete = [];
                    res.status(200).send("El recurso se ha borrado correctamente.");
                });