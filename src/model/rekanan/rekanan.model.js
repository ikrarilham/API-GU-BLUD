/** import the connection.js */
const config = require("../../../helper/connection");
/** import the database modules */
const db = require("mssql/msnodesqlv8");

const rekananModel = {
  get: () => {
    const request = new db.Request();
    return new Promise((resolve, reject) => {
      const rekanan = "rekanan";
      let query = `select rekanan_id as kodeRekanan, nama as namaRekanan from ${rekanan}`;
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
module.exports = rekananModel;
