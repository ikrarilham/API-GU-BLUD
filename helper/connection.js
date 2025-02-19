/* Import From Node Modules*/
const db = require("mssql/msnodesqlv8");
// const { Sequelize } = require("sequelize");

/* Importing from ENV */
const { DB_USER, DB_PASSWORD, DB_SERVER, DB_DRIVER, DB_DATABASE, DB_PORT } =
  process.env;

/* Configurate the Database */
const config = {
  user: DB_USER,
  password: DB_PASSWORD,
  server: "LAPTOP-H5V0P3EO",
  driver: DB_DRIVER,
  database: DB_DATABASE,
  option: {
    trustedconnection: true,
    instancename: "",
  },
  port: DB_PORT,
};
/*End Configurate the Database */

/*Test the Connection */
db.connect(config, (err) => {
  if (err) {
    console.log("Connection Error", err);
  } else {
    console.log("Connected API E-BLUD");
  }
});
/*End of Test the Connection */

/* Exporting */
module.exports = config;
