const express = require("express");
const router = express.Router();

const guRoute = require("./gantiUang/gantiUang.route");

router.get("/", (req, res) => {
  return res.send("Connected to API E-BLUD GU");
});

router.use("/gantiUang", guRoute);

module.exports = router;
