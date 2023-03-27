//************************ CONSTANTS AND REQUIRES *************************************************

const index_sete = require('./index-SRC.js');
const BASI_API_URL = "/api/v1/salaried-stats";
var Datastore = require('nedb');
var db = new Datastore();

module.exports = {
    api: (app) => {
        //The documentation of the API
        app.get(BASI_API_URL + '/docs', function(request, response) {
            response.status(301).redirect('https://documenter.getpostman.com/view/26077957/2s93K1ozB2');
        });
        //--------------------------------------------- GET ---------------------------------------------------------
        //****************************************GET loadInitialData ******************************************************************
        app.get(BASI_API_URL + "/loadInitialData", (request, response) => {
            console.log('New Request to /loadInitialData.');
            db.find({}, async(error, data) => {
                if (error) {
                    console.log(`Error loading Initial Data: ${error}.`);
                    response.sendStatus(5000);
                } else if (data.length != 0) {
                    console.log(`There are data ${data.lenght}loaded.`);
                    response.sendStatus(200);
                } else {
                    db.insert(index_sete.datos_ejemplos_sete)
                    console.log(`Inserted ${index_sete.datos_ejemplos_sete.length} data in database.`);
                    response.sendStatus(201);
                }
            });
        });

        //************************************* GET /salaried-stats/province/year *****************************************************

        app.get(BASI_API_URL + '/:province' + '/:year', (request, response) => {
            const year = parseInt(request.params.year);
            const province = request.params.province;
            const provSelec = index_sete.datos_ejemplos_sete.filter(x => x.province === province);
            const yearSelec = provSelec.filter(x => x.year === year);
            if (yearSelec) {
                response.json(yearSelec).status(200);
                console.log("New Request to /salaried-stats/" + province + "/" + year);
            } else {
                response.status(404).json({ message: `No existe ningún recurso para la provincia: $ { province }
                en el año: $ { year }.` });
            }
        });

        //*********************************************** //GET /salaried-stats: Lista de Recursos ***********************************************
        app.get(BASI_API_URL, (request, response) => {
            if (index_sete.datos_ejemplos_sete) {
                response.json(index_sete.datos_ejemplos_sete).status(200);
                console.log("New Request to /salaried-stats/");
            } else {
                response.status(404).json({ message: `salaried-stats not found: ` });
            }
        });


        //**************************   Recursos por provincia   GET /salaried-stats/province ****************************
        app.get(BASI_API_URL + '/:province', (request, response) => {
            const province = request.params.province;
            const from = request.query.from;
            const to = request.query.to;
            const yearSelec = index_sete.datos_ejemplos_sete.filter(x => x.year >= from && x.year <= to);
            const provSelecc = yearSelec.filter(x => x.province == province);
            if (from && to) {
                if (from >= to) {
                    response.status(400).send("El rango es incorrecto");
                } else {
                    response.status(200).json(provSelecc);
                    console.log(` New Request to / salaried - stats / $ { province } ? from = $ { from } & to = $ { to }`);
                }
            } else {
                const provSeleccionda = index_sete.datos_ejemplos_sete.filter(x => x.province === province);
                response.json(provSeleccionda);
                console.log("New Request to /salaried-stats/" + province);
            }
        });

        //--------------------------------------- POST ---------------------------------------------

        //**********************************************POST crear recurso***********************************************
        app.post(BASI_API_URL, (request, response) => {
            console.log(request.body);
            if (!request.body) {
                response.status(400).send("Hay que insertar datos.");
            } else {
                newData = request.body;
                if (index_sete.datos_ejemplos_sete.some(x =>
                        x.province === newData.province &&
                        x.remuneration_of_employees === newData.remuneration_of_employees &&
                        x.remuneration_percentage_structure === newData.remuneration_percentage_structure &&
                        x.remuneration_variation_rate === newData.remuneration_variation_rate)) {
                    response.status(409).send("The resource already exist");
                } else {
                    index_sete.datos_ejemplos_sete.push(request.body);
                    console.log(`newData = $ { JSON.stringify(request.body, null, 2) }`);
                    console.log("New POST to /salaried-stats");
                    response.status(201).send("El recurso se ha creado correctamente.");
                }
            }
        });

        //************************************ POST NO PERMITIDO A /salaried-stats/province *********************************

        app.post(BASI_API_URL + '/:province', (request, response) => {
            response.status(405).send("POST no permitido");
        });

        //************************************ POST NO PERMITIDO A /salaried-stats/province/year *********************************
        app.post(BASI_API_URL + '/:province' + '/:year', (request, response) => {
            response.status(405).send("POST no permitido");
        });

        //----------------------------------------- PUTS-----------------------------------------------------------
        //*************************** PUT  CORRECTO A  /salaried-stats/province/year  *******************************
        app.put(BASI_API_URL + '/:province' + '/:year', (request, response) => {
            const province = request.params.province;
            const year = parseInt(request.params.year);

            const existe = index_sete.datos_ejemplos_sete.find(p => p.province === province && p.year === year);
            if (!existe || province !== request.body.province || year !== request.body.year) {
                return response.status(400).send("Estadística incorrecta.");
            } else {
                existe.remuneration_of_employees = request.body.remuneration_of_employees || existe.remuneration_of_employees;
                existe.remuneration_percentage_structure = request.body.remuneration_percentage_structure || existe.remuneration_percentage_structure;
                existe.remuneration_variation_rate = request.body.remuneration_variation_rate || existe.remuneration_variation_rate;
                response.status(200).send("Estadística actualizada correctamente");
                console.log("New PUT to /salaried-stats/" + province + "/" + year);
            }
        });

        //***********************************  PUT NO PERMITIDO A /salaried-stats ****************************
        app.put(BASI_API_URL, (request, response) => {
            response.status(405).send("PUT no permitido a /salaried-stats.");
        });

        //***********************************  PUT NO PERMITIDO A /salaried-stats/province ****************************

        app.put(BASI_API_URL + '/:province', (request, response) => {
            response.status(405).send("PUT no permitido a /salaried-stats" + province);

        });

        //***********************************   DELETE A salaried-stats - all data    ****************************************
        app.delete(BASI_API_URL, (request, response) => {
            index_sete.datos_ejemplos_sete = [];
            response.status(200).send("All data delete");
        });
        //****************************  DELETE /salaried-stats/province/year  ******************************
        app.delete(BASI_API_URL + '/:province' + '/:year', (request, response) => {
            index_sete.datos_ejemplos_sete = [];
            response.status(200).send("Data remove");
        });
    }
};