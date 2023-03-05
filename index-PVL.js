var datos_ejemplos_pablo = [
    { province: "Almería", year: 2009, work_place: 272377, percentage_structure: 8.76, variation_rate: -6.36 },
    { province: "Cádiz", year: 2009, work_place: 416368, percentage_structure: 13.3943266, variation_rate: -7.539732768 },
    { province: "Córdoba", year: 2009, work_place: 288870, percentage_structure: 9.292786968, variation_rate: -3.759724143 },
    { province: "Granada", year: 2009, work_place: 331617, percentage_structure: 10.66793414, variation_rate: -6.283170835 },
    { province: "Huelva", year: 2009, work_place: 195755, percentage_structure: 6.297329293, variation_rate: -6.376293122 },
    { province: "Jaén", year: 2009, work_place: 227702, percentage_structure: 7.325046485, variation_rate: -3.870071643 },
    { province: "Málaga", year: 2009, work_place: 612440, percentage_structure: 19.7018536, variation_rate: -7.762559828 },
    { province: "Sevilla", year: 2009, work_place: 763411, percentage_structure: 24.55850657, variation_rate: -6.491141039 },
    { province: "Andalucia", year: 2009, work_place: 3108540, percentage_structure: 100, variation_rate: -6.412321803 },
    { province: "Granada", year: 2010, work_place: 320176, percentage_structure: 10.53571999, variation_rate: -3.450064382 },];

function media_variation_rate (entrada, provincia){
    var cuenta = 0;
    var suma = 0;
    entrada.forEach(e => { if (e.province == provincia){
        cuenta = cuenta + 1;
        suma = suma + e.variation_rate;
    }    
    });
    return "Media de las tasas de variación de "+ provincia+": " + suma/cuenta;
}


module.exports.media_variation_rate =  media_variation_rate;
module.exports.datos_ejemplos_pablo = datos_ejemplos_pablo;