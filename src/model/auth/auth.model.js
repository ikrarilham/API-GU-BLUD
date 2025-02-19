const db = require("mssql/msnodesqlv8");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");

const authModel = {
  // login: ({ username, password }) => {
  //   console.log(username, password);
  //   return new Promise((resolve, reject) => {
  //     db.query(
  //       `SELECT * FROM auth WHERE username=$1`,
  //       [username],
  //       (err, result) => {
  //         if (err) return reject(err.message);
  //         if (result.rows.length == 0) return reject("username/password salah");

  //         bcrypt.compare(
  //           password,
  //           result.rows[0].password,
  //           function (err, hashingResult) {
  //             if (err) return reject(err.message);
  //             if (!hashingResult) return reject("username/password salah");
  //             return resolve(result.rows[0]);
  //           }
  //         );
  //       }
  //     );
  //   });
  // },
  login: (auth) => {
    console.log(auth);
    const userAuth = "adminsuper:54Kti";
    const userAuthEncoded = Buffer.from(userAuth).toString("base64");
    console.log("Basic" + " " + userAuthEncoded);
  },

  register: ({ username, password }) => {
    return new Promise((resolve, reject) => {
      db.query(
        `INSERT INTO auth (id, username, password) VALUES ($1, $2, $3)`,
        [uuidv4(), username, password],
        (err, result) => {
          if (err) {
            return reject(err.message);
          } else {
            return resolve("ADD_SUCCESS");
          }
        }
      );
    });
  },
};

module.exports = authModel;
