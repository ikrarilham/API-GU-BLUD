/** import the connection.js */
const config = require("../../../helper/connection");
/** import the database modules */
const db = require("mssql/msnodesqlv8");

const rekeningModel = {
  get: () => {
    const request = new db.Request();
    return new Promise((resolve, reject) => {
      const rekening = "gnr_kode_rekening90";
      let query = `select kode as kodeRekening, nama as namaRekening from ${rekening}`;
      request.query(query, (err, result) => {
        if (err) {
          return reject(err.message);
        } else {
          return resolve(result.recordset);
        }
      });
    });
  },
  /** End of get function */
};

/** Export the users Model */
module.exports = rekeningModel;
