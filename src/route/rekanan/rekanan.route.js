/** import the express */
const express = require("express");
const router = express();
const basicValidation = require("../../../helper/basicValidation");

/** import controller */
const rekananController = require("../../controller/rekanan/rekanan.controller");

/** route declaration */
router.post("/", basicValidation, rekananController.getData); //getData with post method

/** export the users Route */
module.exports = router;
