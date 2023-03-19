//Importaciones
const pvl = require("./index-PVL.js");

var csv = require('csvdata');
var Datastore = require(`nedb`);
var db = new Datastore();

module.exports =  {
    api:(app) =>{
    var workinplaces_stats = pvl.datos_ejemplos_pablo;
    const ruta = "/api/v1/workingplaces-stats";
    
    //DOCS
    app.get(ruta + '/docs', function (req, res) {
        res.status(301).redirect('https://documenter.getpostman.com/view/26013124/2s93Jxr1Nx');
    });
    //GET FUNCION
    app.get("/samples/pvl", (req, res) => {
        res.send(pvl.variation_rating(pvl.datos_ejemplos_pablo, "Granada"));
        console.log("New request for pvl exercise");
    });

    //GET LISTA

    app.get(ruta, (req, resp) => {
        resp.send(pvl.datos_ejemplos_pablo);
        resp.status(200);
        console.log("New request for pvl exercise");
    });

    //TAREA 10 GET PABLO
    // GET LoadInitialData
    app.get(ruta + '/loadInitialData', (req, resp) => {
        console.log(`New Request /workingplaces-stats/loadInitialData.`);
        db.find({}, async (error, data) => {
            if(error){
                console.log(`Error loading Initial Data: ${error}.`);
                resp.sendStatus(500);
            }else if(data.length != 0){
                console.log(`There are data ${data.length} loaded.`);
                response.sendStatus(200);
            }else{
                let datos = await csv.load('./backend/pvl/Datos/Datos.csv');
                db.insert(datos);
                console.log(`Inserted ${datos.length} data in the database.`);
                resp.sendStatus(201);
            }
        });


        //GET QUERY/NO QUERY
        app.get(ruta, (request,response) => {
            var year_query = request.query.year;
            var province_query = request.query.province;
            var work_place_query = request.query.work_place;
            var percentage_structure = request.query.percentage_structure;
            var variation_rating = request.query.variation_rating;
            console.log(`New request to /workingplaces-stats.`);
            db.find({}, {_id: 0}, (error, data) => {
                if(error){
                    console.log(`Error getting workingplaces-stats.`);
                    response.sendStatus(500);
                }else if(data.length == 0){
                    console.log(`workingplaces-stats not found`);
                    response.sendStatus(404);
                }else{}


            })
        });


        //GET a recurso específico
        /*
        app.get(ruta+'workingplaces-stats/:year/:province/:gender', (request,response)=>{
            var year = request.params.year;
            var province = request.params.province;
            var gender = request.params.gender;
            db.find({"year":parseInt(year),"province":province,"gender":gender},(err,docs)=>{
                if(err){
                    console.log(`Error getting density-population/${year}/${province}/${gender}: ${err}`)
                    response.sendStatus(500);
                }else if(docs.length == 0){
                    console.log(`density-population/${year}/${province}/${gender} not found`);
                    response.sendStatus(404);
                }else{
                    console.log(`Data of density-population/${year}/${province}/${gender} returned`);
                    response.json(docs.map((c) => {
                        delete c._id;
                        return(c);
                    }))
                }
            });
        });*/

        //__________________________________________________POSTS_________________________________________________\\
                                                        //POST ruta\\
        app.post(ruta, (req, res) => {
            const body = req.body;
            console.log("New POST to /workingplaces-stats");
            db.find({}, async (err, data) => {
                if (err) {
                    console.log(`Algo ha salido mal: ${err}.`);
                    res.sendStatus(500);
                } else {
                    console.log(body.province);
                    console.log(body.work_place);
                    console.log(body.percentage_structure);
                    console.log(body.variation_rate);
                    console.log(body);
                    if (!body || !body.province || !body.work_place || !body.percentage_structure || !body.variation_rate) {
                        res.status(400).send("Hay que insertar datos o faltan campos.");
                    } else {
                        if (data.some(x =>
                            x.province === body.province &&
                            x.work_place === body.work_place &&
                            x.percentage_structure === body.percentage_structure &&
                            x.variation_rate === body.variation_rate)) {
                            res.status(409).send("El recurso ya existe.");
                        } else {
                            if (data.some(x => x.province === body.province)) {
                                db.insert(req.body);
                                console.log(`newData = ${JSON.stringify(body, null, 2)}`);
                                console.log("New POST to /workingplaces-stats");
                                res.status(201).send("El recurso se ha creado correctamente.");
                            }
                            else {
                                res.status(409).send("La provincia tiene que ser de Andalucía.");
                            }
                        }
                    }
                };
            });

        });


        //__________________________________________DELETES__________________________________________________\\
                                                //DELETE ALL\\
        app.delete(ruta, (request,response) => {
            console.log(`New DELETE total`);
            db.remove({},{multi:true},(err, num)=>{
                if(err){
                    console.log(`Error deleting density-population`);
                    response.sendStatus(500);
                }else{
                    console.log(`Data removed ${num}`);
                    response.sendStatus(200);
                }
            });
        });
                                                //DELETE SPECIFICO\\
        app.delete(ruta+"/:year/:province", (request,response) => {
            var year = request.params.year;
            var province = request.params.province;
            var gender = request.params.gender;
            console.log(`New DELETE`);
            db.remove({"year":parseInt(year),"province":province},{},(err, num)=>{
                if(err){
                    console.log(`Error deleting density-population/${year}/${province}: ${err}`);
                    response.sendStatus(500);
                }else{
                    console.log(`Data removed ${num}`);
                    response.sendStatus(200);
                }
            });
        });                                        

        //__________________________________________PUTS__________________________________________________\\
                                            //DENIEGUED PUT\\
        app.put(ruta, (request, response) => {
            console.log('Metodo no permitido');
            response.sendStatus(405);
        });
                                            //DENIEGUED PUT\\
        app.put(ruta+'/:year', (request, response) => {
            console.log('Metodo no permitido');
            response.sendStatus(405);
        });
    
                                            //DENIEGUED PUT\\
        app.put(ruta+'/:year/:province', (request, response) => {
            console.log('Metodo no permitido');
            response.sendStatus(405);
        });
    })


}
}