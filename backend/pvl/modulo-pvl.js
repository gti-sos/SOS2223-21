//Importaciones
const pvl = require("./index-PVL.js");

var csv = require('csvdata');
var Datastore = require(`nedb`);
var db = new Datastore();

module.exports =  {
    api:(app) =>{
        const ruta = "/api/v1/workingplaces-stats";
        const provincias =["Andalucía", "Jaén", "Almería", "Sevilla", "Huelva", "Málaga", "Cádiz", "Córdoba", "Granada"];
        var workinplaces_stats = pvl.datos_ejemplos_pablo;
        
    
        //___________________________________________________DOCS________________________________________________\\
        app.get(ruta + '/docs', function (req, res) {
            res.status(301).redirect('https://documenter.getpostman.com/view/26063650/2s93K1oKMy');
                });

        //__________________________________________________GETS__________________________________________________\\
                                                // GET LoadInitialData \\
        app.get(ruta + "/loadInitialData", (req, response) => {
            console.log(`New Request /workingplaces-stats/loadInitialData.`);
            db.find({}, async (error, data) => {
                if(error){
                    console.log(`Error loading Initial Data: ${error}.`);
                    resp.sendStatus(500);
                }else if(data.length != 0){
                    console.log(`There are data ${data.length} loaded.`);
                    response.sendStatus(201);
                }else{
                    let datos = await csv.load('./backend/pvl/Datos/Datos.csv');
                    db.insert(datos);
                    console.log(`Inserted ${datos.length} data in the database.`);
                    response.sendStatus(201);
                }
            });


                                                    //GET GLOBAL\\
            app.get(ruta , (req, res) => {
                const from = parseInt(req.query.from);
                const to = parseInt(req.query.to);
                const limit = parseInt(req.query.limit);
                const offset = parseInt(req.query.offset);
                function jsonContainsParam(json, param) {
                    return Object.keys(json).indexOf(param) !== -1;
                }
                var requer = req.query;
                if (jsonContainsParam(requer, "offset")) delete requer.offset
                if (jsonContainsParam(requer, "limit")) delete requer.limit
                if (jsonContainsParam(requer, "from")) delete requer.from
                if (jsonContainsParam(requer, "to")) delete requer.to
                const queryParams = new Map();
                for (const [key, value] of Object.entries(requer)) {
                if (!isNaN(value)) {
                    queryParams.set(key, parseFloat(value));
                } 
                else {
                    queryParams.set(key, value);
                }
                }
                console.log(queryParams);
                console.log(requer);
                obj = Object.fromEntries(queryParams);
                console.log(obj);
                db.find(obj, async (err, data) => {
                    if (err) {
                        console.log(`Sometime has grown: ${err}.`);
                        res.sendStatus(500);
                    } else {
                        console.log("From: ",from,"To: ",to,"Offset: ",offset,"limit: ", limit)
                        let datosfiltrados = data;
                        
                        if (from >= to) {
                            res.sendStatus(400);
                            console.log(`Range of ${from} to ${to} not valid.`);
                        }else{
                            console.log(`New Request /workingplaces-stats/`);
                            // Filtrar por from y to
                            if (from && to) {
                                datosfiltrados = datosfiltrados.filter(x => x.year >= from && x.year <= to);
                            } else if (from) {
                                datosfiltrados = datosfiltrados.filter(x => x.year >= from);
                            } else if (to) {
                                datosfiltrados = datosfiltrados.filter(x => x.year <= to);
                            }
                            
                        }       
                        if (offset && limit) {
                            datosfiltrados = datosfiltrados.slice(offset, offset + limit);
                        } else if (offset) {
                            datosfiltrados = datosfiltrados.slice(offset);
                        } else if (limit) {
                            datosfiltrados = datosfiltrados.slice(0, limit);
                        }
                        let datos = datosfiltrados.map(x=>{delete x._id; return x});
                        if(datos.length > 0){
                            res.status(200).send(datos);
                        }else {
                            res.sendStatus(404);
                            console.log("Data not found");
                        }
                    };
            });


        });                            
        app.get(ruta+"/:province/:year" , (req, res) => {
            const from = parseInt(req.query.from);
            const to = parseInt(req.query.to);
            const limit = parseInt(req.query.limit);
            const offset = parseInt(req.query.offset);
            function jsonContainsParam(json, param) {
                return Object.keys(json).indexOf(param) !== -1;
            }
            var requer = req.query;
            if (jsonContainsParam(requer, "offset")) delete requer.offset
            if (jsonContainsParam(requer, "limit")) delete requer.limit
            if (jsonContainsParam(requer, "from")) delete requer.from
            if (jsonContainsParam(requer, "to")) delete requer.to
            const queryParams = new Map();
            for (const [key, value] of Object.entries(requer)) {
              if (!isNaN(value)) {
                queryParams.set(key, parseFloat(value));
              } 
              else {
                queryParams.set(key, value);
              }
            }
            
            if(!jsonContainsParam(queryParams, "province")) queryParams.set("province", req.params.province)
            if(!jsonContainsParam(queryParams, "year")) queryParams.set("year", parseInt(req.params.year))
            console.log(requer);
            console.log(queryParams);
            obj = Object.fromEntries(queryParams);
            
            db.find(obj, async (err, data) => {
                if (err) {
                    console.log(`Sometime has grown: ${err}.`);
                    res.sendStatus(500);
                } else {
                    console.log("From",from,"To",to,"Offset",offset,"limit", limit)
                    let datosfiltrados = data;
                    
                    if (from >= to) {
                        res.sendStatus(400);
                        console.log(`Range of ${from} to ${to} not valid.`);
                    }else{
                        console.log(`New Request /workingplaces-stats/${req.params.province}/${req.params.year}`);
                        // Filtrar por from y to
                        if (from && to) {
                            datosfiltrados = datosfiltrados.filter(x => x.year >= from && x.year <= to);
                        } else if (from) {
                            datosfiltrados = datosfiltrados.filter(x => x.year >= from);
                        } else if (to) {
                            datosfiltrados = datosfiltrados.filter(x => x.year <= to);
                        }
                        
                           
                        if (offset && limit) {
                            datosfiltrados = datosfiltrados.slice(offset, offset + limit);
                        } else if (offset) {
                            datosfiltrados = datosfiltrados.slice(offset);
                        } else if (limit) {
                            datosfiltrados = datosfiltrados.slice(0, limit);
                        }
                        // Filtrar por offset y limit
                        let datos = datosfiltrados.map(x=>{delete x._id; return x});
                        if(datos.length > 0){
                            res.status(200).send(datos);
                        }else {
                            res.sendStatus(404);
                            console.log("Data not found");
                        }
                    }
                };
            });
        }); 
        app.get(ruta+'/:province', (request, response) => {
            console.log('GET not Allowed');
            response.sendStatus(405);
        });
            
        //__________________________________________________POSTS_________________________________________________\\
                                                        //POST ruta\\
        app.post(ruta, (req, res) => {
        console.log("new post attempt to /workingplaces-stats");
        var vacios = 0;
            for (const campo in req.body) {
                if (req.body[campo] === '') {
                  vacios+=1;
                } }
        if (vacios !=0 || !req.body || !req.body.province || !req.body.work_place || !req.body.percentage_structure || !req.body.variation_rating) {
            res.status(400).send("Data needs to be inserted or fields are missing.");
        } else {
            const newData = req.body;
            db.find({
                province: newData.province,
                year: newData.year,
                work_place: newData.work_place,
                percentage_structure:newData.percentage_structure,
                variation_rating:newData.variation_rating,
            }, (err, docs) => {
                console.log("Este es el doc")
                console.log(docs[0]);
                if (docs.length > 0) {
                    res.status(409).send("The resource already exists.");
                } else if (!provincias.includes(req.body.province)){
                    res.status(409).send("The province must be in Andalucía.");
                }                 
                else {
                    db.insert(newData, (err, doc) => {
                        if (err) {
                            res.status(500).send(`Something has gone wrong: ${err}.`);
                        } else {
                            console.log(`newData = ${JSON.stringify(doc, null, 2)}`);
                            console.log("New POST to /workingplaces-stats");
                            res.status(201).send("The resource has been created successfully.");
                        }
                    });
                }
            });
        }
    });


       
                                   //POST NOT ALLOWED\\
        app.post(ruta+'/:province', (request, response) => {
            console.log('POST not Allowed');
            response.sendStatus(405);
        });
                                    //POST NOT ALLOWED\\
        app.post(ruta+'/:province/:year', (request, response) => {
            console.log('POST not Allowed');
            response.sendStatus(405);
        });



        //__________________________________________DELETES__________________________________________________\\
                                                //DELETE ALL\\
        app.delete(ruta, (request,response) => {
            console.log(`New DELETE total`);
            db.remove({},{multi:true},(err, numRemoved)=>{
                if(err){
                    console.log(`Error deleting workingplaces-stats`);
                    response.sendStatus(500);
                }else{
                    console.log(`Data removed ${numRemoved}`);
                    response.sendStatus(200);
                }
            });
        });
                                                //DELETE SPECIFICO\\
        app.delete(ruta+"/:province/:year/", (request,response) => {
            var province = request.params.province;
            var year = request.params.year;
            console.log(`New DELETE /province/`);
            db.remove({"province":province, "year":parseInt(year)},{},(err, numRemoved)=>{
                if(err){
                    console.log(`Error deleting workingplaces-stats/${province}/${year}: ${err}`);
                    response.sendStatus(500);
                }else{
                    console.log(`Data removed ${numRemoved}`);
                    response.sendStatus(200);
                }
            });
        });        
                                        //DELETE MULTIPLE SPECIFICO\\
        /*
        app.delete(ruta+"/:province", (request,response) => {
            var province = request.params.province;
            console.log(`New DELETE for ${province}`);
            db.remove({"province":province},{multi:true},(err, numRemoved)=>{
                if(err){
                    console.log(`Error deleting workingplaces-stats/${province}: ${err}`);
                    response.sendStatus(500);
                }else{
                    console.log(`Data removed ${numRemoved}`);
                    response.sendStatus(200);
                }
            });
        });
        */
        //__________________________________________PUTS__________________________________________________\\
                                            //PUT NOT ALLOWED\\
        app.put(ruta, (request, response) => {
            console.log('Put not Allowed');
            response.sendStatus(405);
        });
                                            //PUT NOT ALLOWED\\
        app.put(ruta+'/:province', (request, response) => {
            console.log('Put not Allowed');
            response.sendStatus(405);
        });
    
                                            //CORRECT PUT\\
app.put(ruta + '/:province/:year', (request, response) => {
    const province = request.params.province;
    const year = parseInt(request.params.year);
    var vacios = 0;
    db.find({ province: province, year: year }, async (err, data) => {
        console.log(province, "D",request.body.province);
        console.log(year, "Y",request.body.year);
        for (const campo in request.body) {
            if (request.body[campo] === '') {
              vacios+=1;
            } }
        if (err) {
            console.log(`Something has gone wrong: ${err}.`);
            response.sendStatus(500);
            
        }else if(province != request.body.province || year != request.body.year || data.length == 0){
            response.status(400).send("Data not found")
        }
         else {
            if (vacios !=0 || Object.keys(request.body).length != 5) {
                response.status(400).send("Any field of the body is empty or the total is less than 5");
            } else {
                if (provincias.includes(request.body.province)) {
                    db.update({ province: province, year: year }, {
                        $set: request.body}, {}, async (error, dat) => {
                        if (error) {
                            console.log(`Something has gone wrong: ${err}.`);
                            response.sendStatus(500);
                        } else {
                            response.status(200).send("Stats updated successfully");
                            console.log("New PUT to /market-prices-stats/" + province + "/" + year);
                        }
                    });
                }
                else {
                    response.status(409).send("The province must be in Andalucia.");
                }
            }
        }
    });
});

    })


}
}