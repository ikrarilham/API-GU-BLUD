/** Import dotenv */
require("dotenv").config();

/** ENV Value Setting */
const { API_PORT, ORIGIN, METHODS, ALLOWEDHEADERS, CREDENTIALS } = process.env;

/** Import model */
const { urlencoded, json } = require("express");
const express = require("express");
const app = express();
const router = require("./src/route/index.route");
const cors = require("cors");
const bodyParser = require("body-parser");
const port = API_PORT || 5002;

/** Use the Modules */
/*** Preperation for CORS specific setting */
const corsOption = {
  origin: ORIGIN,
  method: METHODS,
  allowedHeaders: ALLOWEDHEADERS,
  credential: CREDENTIALS,
};
/*** end of preperation for CORS specific setting */
app.use(cors()); /** enable CORS */
app.use(bodyParser.json());
app.use(express.static("public")); /** static file */
app.use(urlencoded({ extended: true })); /** enable urlencoded */
app.use(json()); /** enable json */
app.use("/api/v1/", router); /** default prefix we use */

app.get("*", (req, res) => {
  return res.send({
    status: 404,
    message: "not found",
  });
});

app.listen(port, (req, res) => {
  return `API Test successfully running on port ${port}`;
});
