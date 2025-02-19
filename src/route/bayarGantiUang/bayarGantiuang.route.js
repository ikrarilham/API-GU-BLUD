/** import the express */
const express = require("express");
const router = express();
const basicValidation = require("../../../helper/basicValidation");

/** import controller */
const gantiUangController = require("../../controller/bayarGantiUang/bayarGantiUang.controller");

/** route declaration */
router.post("/", basicValidation, gantiUangController.getData); //getData with post method

/** export the users Route */
module.exports = router;
