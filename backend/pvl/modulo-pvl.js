//Importaciones
const pvl = require("./index-PVL.js");

var csv = require('csvdata');
var Datastore = require(`nedb`);
var db = new Datastore();

module.exports =  {
    api:(app) =>{
        const ruta = "/api/v1/workingplaces-stats";
        const provincias =["Andalucía", "Jaén", "Almería", "Sevilla", "Huelva", "Málaga", "Cádiz", "Córdoba"];
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
                    response.sendStatus(200);
                }else{
                    let datos = await csv.load('./backend/pvl/Datos/Datos.csv');
                    db.insert(datos);
                    console.log(`Inserted ${datos.length} data in the database.`);
                    response.sendStatus(201);
                }
            });


                                                    //GET GLOBAL\\
            app.get(ruta , (req, res) => {
            const year = parseInt(req.params.year);
            const province = req.params.province;
            const limit = req.query.limit;
            const offset = req.query.offset;
            const work_place = req.query.work_place;
            const percentage_structure = req.query.percentage_structure;
            const variation_rate = req.query.variation_rate;
            console.log(req.query);
            const cond0 = !!req.query.year && !!req.query.province && !!req.query.work_place && !!req.query.percentage_structure && !!req.query.variation_rate
            const cond1 = !!req.query.year && !!req.query.province && !!req.query.work_place && !!req.query.percentage_structure 
            const cond2 = !!req.query.year && !!req.query.province && !!req.query.work_place 
            const cond3 = !!req.query.year && !!req.query.province 
            const cond4 = !!req.query.year 
            console.log(!!req.query.year && !!req.query.province && !!req.query.offset);
            console.log("New GET to /market-prices-stats/" + province + "/" + year);
            if (cond0){

            } else if (cond1){
                let datos = db.filter(x=>x.province === req.query.province &&x.province === req.query.year &&x.province === req.query.work_place &&x.province === req.query.percentage_structure &&x.province === req.query.variation_rate);
            }
            else if (cond2){
                
            }
            else if (cond3){
                
            }
            else if (cond4){
                let datos = db.filter(x=>x.year === parseInt(req.query.year));
            }
            return datos;
        });                             
            


                                    //GET recurso especifico\\
            app.get(ruta+'/:province/:year', (request,response)=>{
                var province = request.params.province;
                var year = request.params.year;
                
                db.find({"province":province, "year":parseInt(year)},(err,data)=>{
                    if(err){
                        console.log(`Error getting workingplaces-stats/${province}: ${err}`)
                        response.sendStatus(500);
                    }else if(data.length == 0){
                        console.log(`workingplaces-stats/${province} not found`);
                        response.sendStatus(404);
                    }else{
                        console.log(`Data of workingplaces-stats/${province} returned`);
                        response.json(data.filter(x =>x.province === province && parseInt(x.year)===parseInt(year)));
                        }
                    });});
        //__________________________________________________POSTS_________________________________________________\\
                                                        //POST ruta\\
        app.post(ruta, (req, res) => {
        console.log("new post attempt to /workingplaces-stats");
        var vacios = 0;
            for (const campo in req.body) {
                if (req.body[campo] === '') {
                  vacios+=1;
                } }
        if (vacios !=0 || !req.body || !req.body.province || !req.body.work_place || !req.body.percentage_structure || !req.body.variation_rate) {
            res.status(400).send("Data needs to be inserted or fields are missing.");
        } else {
            const newData = req.body;
            db.find({
                province: newData.province,
                year: newData.year,
                work_place: newData.work_place,
                percentage_structure:newData.percentage_structure,
                variation_rate:newData.variation_rate,
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
            
        }else if(province != request.body.province || year != request.body.year){
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