require("dotenv").config();

const { API_PORT, ORIGIN, METHODS, ALLOWEDHEADERS, CREDENTIALS } = process.env;

const express = require("express");
const app = express();
const router = require("./src/route/index.route");
const cors = require("cors");

const port = API_PORT || 5002;

const corsOption = {
  origin: ORIGIN,
  methods: METHODS,
  allowedHeaders: ALLOWEDHEADERS,
  credentials: CREDENTIALS === "true", // jika string "true" di env
};

app.use(cors(corsOption));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

app.use("/api/v1", router);

app.get("*", (req, res) => {
  return res.status(404).json({
    status: 404,
    message: "Not found",
  });
});

app.listen(port, () => {
  console.log(`API Test successfully running on port ${port}`);
});
