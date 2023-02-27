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

var seleccionados = datos_ejemplos_sete.filter((n) => n.province === "Cádiz").map((n) => { return n.pib_current_price});
console.log("Media del precio actual del pib de Cádiz: " + seleccionados.reduce((a, b) => a + b, 0) / seleccionados.length);
