/** import the express */
const express = require("express");
const router = express();
const basicValidation = require("../../../helper/basicValidation");

/** import controller */
const kegiatanController = require("../../controller/rekening/rekening.controller");

/** route declaration */
router.post("/", basicValidation, kegiatanController.getData); //getData with post method
// router.get("/:id", pengadaanController.getDetail);

/** export the users Route */
module.exports = router;
