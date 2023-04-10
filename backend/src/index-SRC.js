var datos_ejemplos_sete = [
    { province: "Almería", year: 2010, remuneration_of_employees: 149627412, remuneration_percentage_structure: 100, remuneration_variation_rate: 298281107 },
    { province: "Cádiz", year: 2014, remuneration_of_employees: 19540300.38, remuneration_percentage_structure: 13.62894036, remuneration_variation_rate: -0.83632259 },
    { province: "Granada", year: 2010, remuneration_of_employees: 21225978.10, remuneration_percentage_structure: 14.18588868, remuneration_variation_rate: 0.908546693 },
    { province: "Cádiz", year: 2017, remuneration_of_employees: 10986877.00, remuneration_percentage_structure: 6.751839242, remuneration_variation_rate: 11.72504816 },
    { province: "Jaén", year: 2010, remuneration_of_employees: 15922742.43, remuneration_percentage_structure: 10.64159449, remuneration_variation_rate: -2.5473448 },
    { province: "Málaga", year: 2015, remuneration_of_employees: 30011963.99, remuneration_percentage_structure: 19.96043729, remuneration_variation_rate: 3.930404178 },
    { province: "Almería", year: 2011, remuneration_of_employees: 12151269.59, remuneration_percentage_structure: 8.211824048, remuneration_variation_rate: -6.038435125 },
    { province: "Cádiz", year: 2012, remuneration_of_employees: 30011963.99, remuneration_percentage_structure: 19.96043729, remuneration_variation_rate: 3.930404178 },
    { province: "Cádiz", year: 2018, remuneration_of_employees: 14101232, remuneration_percentage_structure: 8.380260375, remuneration_variation_rate: 2.099969438 },
    { province: "Granada", year: 2015, remuneration_of_employees: 16170570.78, remuneration_percentage_structure: 10.75476647, remuneration_variation_rate: 4.166229745 }
];

//var media_remuneration_of_employees_province = datos_ejemplos_sete.filter((n) => n.province === "Cádiz").map((n) => { return n.remuneration_of_employees });
//console.log("La media de la remuneración de los empleados en Cádiz es: " + media_remuneration_of_employees_province.reduce((a, b) => a + b, 0) / media_remuneration_of_employees_province.length);

//module.exports.datos_ejemplos_sete = datos_ejemplos_sete;
export { datos_ejemplos_sete }