var XLSX = require("xlsx");

const ExcelAJSON = (dato) => {
  const excel = dato;
  var nombreHoja = excel.SheetNames; // regresa un array
  let datos = XLSX.utils.sheet_to_json(excel.Sheets[nombreHoja[0]]);

  const jDatos = [];
  for (let i = 0; i < datos.length; i++) {
    const dato = datos[i];
    jDatos.push({...dato});
  }
  return jDatos;
};

module.exports.lector = ExcelAJSON;