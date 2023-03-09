var datos_jorge = [
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
var datos_aleatorios_jorge = [
    { province: "Sevilla", year: 2018, pib_current_price: 119925348, pib_percentage_structure: 98, pib_variation_rate: 189174206 },
    { province: "Córdoba", year: 2013, pib_current_price: 17759903.92, pib_percentage_structure: 16.82368639, pib_variation_rate: -0.62537103 },
    { province: "Cádiz", year: 2012, pib_current_price: 24637591.48, pib_percentage_structure: 18.25799462, pib_variation_rate: -0.123775277 },
    { province: "Jaén", year: 2008, pib_current_price: 15402333.66, pib_percentage_structure: 10.0403527, pib_variation_rate: -3.72062337 },
    { province: "Huelva", year: 2011, pib_current_price: 16999185.05, pib_percentage_structure: 8.96036131, pib_variation_rate: -1.534965 },
    { province: "Málaga", year: 2010, pib_current_price: 26913529.71, pib_percentage_structure: 20.03734709, pib_variation_rate: 0.130541768 },
    { province: "Sevilla", year: 2015, pib_current_price: 9241458.63, pib_percentage_structure: 6.136019776, pib_variation_rate: -2.322956735 },
    { province: "Jaén", year: 2016, pib_current_price: 35709027.73, pib_percentage_structure: 17.56713921, pib_variation_rate: 2.373861509 },
    { province: "Cádiz", year: 2017, pib_current_price: 15541051.78, pib_percentage_structure: 10.61013552, pib_variation_rate: 0.846319108 },
    { province: "Málaga", year: 2019, pib_current_price: 14863749.11, pib_percentage_structure: 9.259032992, pib_variation_rate: -4.142498233 }
];

function jorge() {
    var seleccionados = datos_jorge
        .filter((n) => n.province === "Granada").map((n) => { return n.pib_variation_rate });
    return ("Media de las tasas de variación de Granada: " + seleccionados.reduce((a, b) => a + b, 0) / seleccionados.length);
}

module.exports.jorge = jorge;
module.exports.datos_jorge = datos_jorge;
module.exports.datos_aleatorios_jorge = datos_aleatorios_jorge;