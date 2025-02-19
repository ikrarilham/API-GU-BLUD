/** import the connection.js */
const config = require("../../../helper/connection");
/** import the database modules */
const db = require("mssql/msnodesqlv8");
/** import the UUID Version 4 as 'uuidv4' */
const { v4: uuidv4 } = require("uuid");
// const poolManager = require("../../../helper/poolManager");

const usersModel = {
  //query function
  //   query: (queryParams, sortType = "asc", limit = 5) => {
  //     if (queryParams.search && queryParams.cat) {
  //       return `WHERE username LIKE '%${queryParams.search}%' AND gender LIKE '%${queryParams.cat}%' ORDER BY username ${sortType} LIMIT ${limit}`;
  //     } else if (queryParams.search || queryParams.cat) {
  //       return `WHERE username LIKE '%${queryParams.search}%' OR gender LIKE '%${queryParams.cat}%' ORDER BY username ${sortType} LIMIT ${limit}`;
  //     } else {
  //       return `ORDER BY username ${sortType} limit ${limit}`;
  //     }
  //   }, //end of query function
  /** Get Users */
  get:
    (config,
    () => {
      const request = new db.Request();
      return new Promise((resolve, reject) => {
        request.query(`SELECT * from users`, (err, result) => {
          console.log(result.recordset);
          if (err) {
            return reject(err.message);
          } else {
            return resolve(result.recordset);
          }
        });
      });
    }),
  getDetail: (pegawaiId) => {
    return new Promise((resolve, reject) => {
      db.query(
        `SELECT * from users where pegawai_id='${pegawaiId}'`,
        (err, result) => {
          console.log(result.recordset);
          if (err) {
            return reject(err.message);
          } else {
            return resolve(result.recordset);
          }
        }
      );
    });
  },

  /** End of Get Users */
};

/** Export the users Model */
module.exports = usersModel;
