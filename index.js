const pvl = require("./index-PVL");
//var dat = pvl.datos_ejemplos_pablo;

var cool = require("cool-ascii-faces");
var express = require("express");
var port = process.env.PORT || 12345;
//esqueleto de un servidor web
var app = express();
//req = request res = response
app.get("/cool", (req, res) => {
    res.send(cool());
    console.log("New request for an ascii face");
});
app.listen(port, () => {
    //con esto nos  aseguramos quele mensaje no sale hasta que el servidor no esta escucha ndo de verdad
    console.log(`Server escuchando en el puerto ${port}`);
}); //puertos hasta 32k

var datos_ejemplos_jorge = [
    { province: "Almería", year: 2010, pib_current_price: 149627412, pib_percentage_structure: 100, pib_variation_rate: 298281107 },
    { province: "Cádiz", year: 2014, pib_current_price: 19540300.38, pib_percentage_structure: 13.62894036, pib_variation_rate: -0.83632259 },
    { province: "Granada", year: 2010, pib_current_price: 21225978.10, pib_percentage_structure: 14.18588868, pib_variation_rate: 0.908546693 },
    { province: "Huelva", year: 2017, pib_current_price: 10986877.00, pib_percentage_structure: 6.751839242, pib_variation_rate: 11.72504816 },
    { province: "Jaén", year: 2010, pib_current_price: 15922742.43, pib_percentage_structure: 10.64159449, pib_variation_rate: -2.5473448 },
    { province: "Málaga", year: 2015, pib_current_price: 30011963.99, pib_percentage_structure: 19.96043729, pib_variation_rate: 3.930404178 },
    { province: "Almería", year: 2011, pib_current_price: 12151269.59, pib_percentage_structure: 8.211824048, pib_variation_rate: -6.038435125 },
    { province: "Cádiz", year: 2012, pib_current_price: 30011963.99, pib_percentage_structure: 19.96043729, pib_variation_rate: 3.930404178 },
    { province: "Córdoba", year: 2018, pib_current_price: 14101232, pib_percentage_structure: 8.380260375, pib_variation_rate: 2.099969438 },
    { province: "Granada", year: 2015, pib_current_price: 16170570.78, pib_percentage_structure: 10.75476647, pib_variation_rate: 4.166229745 }];
function jorge() {
    var seleccionados = datos_ejemplos_jorge.filter((n) => n.province === "Granada").map((n) => { return n.pib_variation_rate });
    return ("Media de las tasas de variación de Granada: " + seleccionados.reduce((a, b) => a + b, 0) / seleccionados.length);
}
app.get("/samples/jfs", (req, res) => {
    res.send(jorge());
    console.log("New request for jfs exercise");
});

app.get("/samples/pvl", (req, res) => {
    res.send(pvl.media_variation_rate(pvl.datos_ejemplos_pablo, "Granada"));
    console.log("New request for pvl exercise");
});


var datos_ejemplos_sete = [
    { province: "Almería", year: 2010, pib_current_price: 149627412, pib_percentage_structure: 100, pib_variation_rate: 298281107 },
    { province: "Cádiz", year: 2014, pib_current_price: 19540300.38, pib_percentage_structure: 13.62894036, pib_variation_rate: -0.83632259 },
    { province: "Granada", year: 2010, pib_current_price: 21225978.10, pib_percentage_structure: 14.18588868, pib_variation_rate: 0.908546693 },
    { province: "Cádiz", year: 2017, pib_current_price: 10986877.00, pib_percentage_structure: 6.751839242, pib_variation_rate: 11.72504816 },
    { province: "Jaén", year: 2010, pib_current_price: 15922742.43, pib_percentage_structure: 10.64159449, pib_variation_rate: -2.5473448 },
    { province: "Málaga", year: 2015, pib_current_price: 30011963.99, pib_percentage_structure: 19.96043729, pib_variation_rate: 3.930404178 },
    { province: "Almería", year: 2011, pib_current_price: 12151269.59, pib_percentage_structure: 8.211824048, pib_variation_rate: -6.038435125 },
    { province: "Cádiz", year: 2012, pib_current_price: 30011963.99, pib_percentage_structure: 19.96043729, pib_variation_rate: 3.930404178 },
    { province: "Cádiz", year: 2018, pib_current_price: 14101232, pib_percentage_structure: 8.380260375, pib_variation_rate: 2.099969438 },
    { province: "Granada", year: 2015, pib_current_price: 16170570.78, pib_percentage_structure: 10.75476647, pib_variation_rate: 4.166229745 }];

function sete(){
var seleccionados = datos_ejemplos_sete.filter((n) => n.province === "Cádiz").map((n) => { return n.pib_current_price});
return "Media del precio actual del pib de Cádiz: " + seleccionados.reduce((a, b) => a + b, 0) / seleccionados.length;}

app.get("/samples/src", (req, res) => {
    res.send(sete());
    console.log("Cálculo algoritmo");
});

