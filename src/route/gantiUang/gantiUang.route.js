const express = require("express");
const router = express.Router();
const basicValidation = require("../../../helper/basicValidation");
const signatureValidation = require("../../../helper/signatureValidation");

const guController = require("../../controller/gantiUang/gantiUang.controller");

router.post(
  "/getbilling",
  basicValidation,
  signatureValidation,
  guController.getBilling
);
router.post(
  "/inquiry",
  basicValidation,
  signatureValidation,
  guController.inquiry
);
router.post(
  "/posting",
  basicValidation,
  signatureValidation,
  guController.posting
);
router.post(
  "/reversal",
  basicValidation,
  signatureValidation,
  guController.reversal
);
router.post(
  "/postingntpn",
  basicValidation,
  signatureValidation,
  guController.postingNTPN
);

module.exports = router;
