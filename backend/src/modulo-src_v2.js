//************************ CONSTANTS AND REQUIRES *************************************************

import { datos_ejemplos_sete } from './index-SRC.js';
const BASI_API_URL = "/api/v2/salaried-stats";
import Datastore from 'nedb';
var db = new Datastore();

function loadBackend_src_v2(app) {
    //The documentation of the API
    app.get(BASI_API_URL + '/docs', function(request, response) {
        response.status(301).redirect('https://documenter.getpostman.com/view/26077957/2s93K1ozB2');
        response.status(301).redirect('https://documenter.getpostman.com/view/26077957/2s93Xzvh7c');
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
                console.log(`There are data ${data.length}loaded.`);
                response.sendStatus(200);
            } else {
                db.insert(datos_ejemplos_sete)
                console.log(`Inserted ${datos_ejemplos_sete.length} data in database.`);
                response.sendStatus(201);
            }
        });
    });

    //************************************* GET /salaried-stats/province/year *****************************************************
    app.get(`${BASI_API_URL}/:province/:year`, (req, res) => {
        let year = req.params.year;
        let province = req.params.province;
        console.log(`New request to /salaried-stats/${province}/${year}`);
        db.find({ 'year': parseInt(year), 'province': province }, { _id: 0 }, (err, data) => {
            if (err) {
                console.log(`Error getting salaried-stats/${province}/${year}: ${err}`);
                // Estado 500: Internal Server Error
                res.sendStatus(500);
            } else if (data.length == 0) {
                console.log(`salaried-stats/${province}/${year} not found`);
                // Estado 404: Not Found
                res.sendStatus(404);
            } else {
                console.log(`Data salaried-stats/${province}/${year} returned`);
                res.json(data[0]);
            }
        });
    });
    //*********************************************** //GET /salaried-stats: Lista de Recursos ***********************************************
    app.get(BASI_API_URL, (request, response) => {
        var year_query = request.query.year;
        var province_query = request.query.province;
        var remuneration_of_employees_under = request.query.remuneration_of_employees;
        var remuneration_percentage_structure_under = request.query.remuneration_percentage_structure_under;
        var remuneration_variation_rate_under = request.query.remuneration_variation_rate_under;
        db.find({}, async(error, data) => {
            if (error) {
                console.log(`Error loading Initial Data: ${error}.`);
                response.sendStatus(5000);
            } else {
                let i = -1;
                if (!request.query.offset) {
                    var offset = -1;
                } else {
                    var offset = parseInt(request.query.offset);
                }
                var datos = data.filter((x) => {
                    return (((year_query == undefined) || parseInt(year_query) === x.year) &&
                        ((province_query == undefined) || (parseInt(province_query) === x.province)) &&
                        ((remuneration_of_employees_under == undefined) || (parseInt(remuneration_of_employees_under) >= x.remuneration_of_employees)) &&
                        ((remuneration_percentage_structure_under == undefined) || (parseInt(remuneration_percentage_structure_under) >= x.remuneration_of_employees)) &&
                        ((remuneration_variation_rate_under == undefined) || (parseInt(remuneration_variation_rate_under) >= x.remuneration_variation_rate))
                    )
                }).filter((x) => {
                    i = i + 1;
                    if (request.query.limit == undefined) {
                        var cond = true;
                    } else {
                        var cond = (offset + parseInt(request.query.limit)) >= i;
                    }
                    return (i > offset) && cond;
                });
                if (data.length == 0) {
                    console.log(`salaried- stats not found`);
                    response.sendStatus(404);
                } else {
                    console.log(`Data of salaried-stats returned: ${data.length}`);
                    response.json(datos);
                }
            }
        });
    });


    //**************************   Recursos por provincia   GET /salaried-stats/province ****************************
    app.get(BASI_API_URL + '/:province', (request, response) => {
        const province = request.params.province;
        const from = request.query.from;
        const to = request.query.to;
        const yearSelec = datos_ejemplos_sete.filter(x => x.year >= from && x.year <= to);
        const provSelecc = yearSelec.filter(x => x.province == province);
        if (from && to) {
            if (from >= to) {
                response.status(400).send("El rango es incorrecto");
            } else {
                response.status(200).json(provSelecc);
                console.log(` New Request to / salaried - stats / $ { province } ? from = $ { from } & to = $ { to }`);
            }
        } else {
            const provSeleccionda = datos_ejemplos_sete.filter(x => x.province === province);
            response.json(provSeleccionda);
            console.log("New Request to /salaried-stats/" + province);
        }
    });

    //--------------------------------------- POST ---------------------------------------------

    //**********************************************POST crear recurso***********************************************
    /*
        app.post(BASI_API_URL, (request, response) => {
            console.log(request.body);
            if (!request.body) {
                response.status(400).send("Hay que insertar datos.");
            } else {
                newData = request.body;
                if (datos_ejemplos_sete.some(x =>
                        x.province === newData.province &&
                        x.remuneration_of_employees === newData.remuneration_of_employees &&
                        x.remuneration_percentage_structure === newData.remuneration_percentage_structure &&
                        x.remuneration_variation_rate === newData.remuneration_variation_rate)) {
                    response.status(409).send("The resource already exist");
                } else {
                    db.insert(request.body);
                    console.log(`Created`);
                    res.sendStatus(201);
                }
            }
        });
*/
    app.post(BASI_API_URL, (request, response) => {
        var newReq = request.body;
        console.log("New POST to /salaried-stats");
        db.find({ 'province': parseInt(newReq.province), 'year': newReq.year, 'remuneration_of_employees': newReq.remuneration_of_employees }, (error, data) => {
            if (error) {
                console.log(`Error getting /salaried-stats/${year}/${province}/${remuneration_of_employees}: ${error}.`);
                response.sendStatus(500);
            } else if (data.length == 0) {
                newReq.year = parseInt(newReq.year);
                newReq.remuneration_percentage_structure = parseInt(newReq.remuneration_percentage_structure);
                newReq.remuneration_variation_rate = parseInt(newReq.remuneration_variation_rate);
                db.insert(newReq);

                console.log(BASI_API_URL + `/${newReq.year}/${newReq.province}/${newReq.remuneration_of_employees}`);
                response.sendStatus(201);
            } else {
                console.log(`/salaried-stats/${newReq.year}/${newReq.province} already exist.`);
                response.sendStatus(409);
            }
        });
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
    //*************************** PUT A /salaried-stats/province/year  *******************************
    app.put(BASI_API_URL + '/:province' + '/:year', (request, response) => {
        const province = request.params.province;
        const year = parseInt(request.params.year);

        const existe = datos_ejemplos_sete.find(p => p.province === province && p.year === year);
        if (!existe || province !== request.body.province || year !== request.body.year) {
            return response.status(400).send("No se puede actualizar");
        } else {
            existe.remuneration_of_employees = request.body.remuneration_of_employees || existe.remuneration_of_employees;
            existe.remuneration_percentage_structure = request.body.remuneration_percentage_structure || existe.remuneration_percentage_structure;
            existe.remuneration_variation_rate = request.body.remuneration_variation_rate || existe.remuneration_variation_rate;
            response.status(200).send("Actualizado correctamente");
            console.log("New PUT to /salaried-stats/" + province + "/" + year);
        }
    });

    //***********************************  PUT NO PERMITIDO A /salaried-stats ****************************
    app.put(BASI_API_URL, (request, response) => {
        response.status(405).send("PUT no permitido a /salaried-stats.");
    });

    /*
    //***********************************  PUT NO PERMITIDO A /salaried-stats/province ****************************

    app.put(BASI_API_URL + '/:province', (request, response) => {
        response.status(405).send("PUT no permitido a /salaried-stats/" + province);

    });
    */

    //***********************************   DELETE A salaried-stats - all data    ****************************************
    app.delete(BASI_API_URL, (request, response) => {
        console.log("New DELETE to all data.");
        db.remove({}, { multi: true }, (error, data) => {
            if (error) {
                console.log("Error deleting /salaried-stats");
                response.sendStatus(500);
            } else {
                console.log(`All data removed: ${data}.`);
                response.sendStatus(200);
            }
        });
    });
    //****************************  DELETE /salaried-stats/province/year  ******************************
    app.delete(BASI_API_URL + '/:province/:year', (request, response) => {
        const province = request.params.province;
        const year = request.params.year;
        db.remove({ province: province, year: year });
        response.status(200).send("Data remove");
    });
}


export { loadBackend_src_v2 };