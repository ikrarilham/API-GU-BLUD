/** import the connection.js */
const config = require("../../../helper/connection");
/** import the database modules */
const db = require("mssql/msnodesqlv8");

const kegiatanModel = {
  get: () => {
    const request = new db.Request();
    return new Promise((resolve, reject) => {
      const kegiatan = "gnr_list_kegiatan90";
      let query = `select kode as kodeKegiatan, nama as namaKegiatan from ${kegiatan}`;
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
module.exports = kegiatanModel;
