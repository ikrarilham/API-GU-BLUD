/** import the express */
const express = require("express");
const router = express();
const basicValidation = require("../../../helper/basicValidation");

/** import controller */
const pengadaanController = require("../../controller/pengadaan/pengadaan.controller");

/** route declaration */
router.post("/", basicValidation, pengadaanController.getData); //getData with post method
// router.get("/:id", pengadaanController.getDetail);

/** export the users Route */
module.exports = router;
