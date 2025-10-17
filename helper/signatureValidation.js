const { SECRETKEYHMACSHA256, kodeDaerah } = process.env;
const crypto = require("crypto");

const signatureValidation = (req, res, next) => {
  /**variable declaration */
  /*** Variable that used in Signature encode */
  const contentType = req.headers["content-type"];
  const reqSignature = req.headers["x-signature"];
  const instansiId = req.headers["x-instansiid"];
  const requestBody = req.body.request_id;
  const kodeBilling = req.body.idbilling || ""; // bisa undefined
  const kodeBillingPajak = req.body.idbilling || "";
  const timeStamp = req.headers["x-timestamp"];
  const path = req.originalUrl.toLowerCase();
  /*** End of Variable that used in Signature encode */
  /** end of variable declaration */
  /** validation condition */
  /*** create signature based on req */
  //const signature =
  //kodeDaerah + "|" + instansiId + "|" + requestBody + "|" + timeStamp;
  if (!/^\d+$/.test(req.body.request_id)) {
    console.warn(" request_id tidak valid (bukan angka):", req.body.request_id);
    return res.status(400).send({
      message: "Invalid request_id format",
      received: req.body.request_id,
    });
  }

  let signature = "";
  if (path.includes("/getbilling")) {
    // GETBILLING: (X-INSTANSI_ID|REQUEST_ID |X-TIMESTAMP)
    signature = instansiId + "|" + requestBody + "|" + timeStamp;
  } else if (
    path.includes("/inquiry") ||
    path.includes("/posting") ||
    path.includes("/reversal")
  ) {
    // INQUIRY, POSTING, REVERSAL: (X-INSTANSI_ID|REQUEST_ID|KODE_BILLING|X-TIMESTAMP)
    signature =
      instansiId + "|" + requestBody + "|" + kodeBilling + "|" + timeStamp;
  } else if (path.includes("/postingntpn")) {
    // POSTINGNTPN :(X-INSTANSI_ID|REQUEST_ID|KODE_BILLING_PAJAK|X-TIMESTAMP)
    signature =
      instansiId + "|" + requestBody + "|" + kodeBillingPajak + "|" + timeStamp;
  } else {
    return res.status(400).send({
      message: "Unsupported endpoint for signature validation",
    });
  }

  const signatureSHA = crypto
    .createHmac("sha256", SECRETKEYHMACSHA256)
    .update(signature)
    .digest("base64");
  /*** End of create signature based on req */
  /*** Condition for the req permission based on Signature req */
  console.log("Signature API", signatureSHA);
  console.log("Signature API", req.headers);

  // === Tambahkan log debug untuk compare ===
  console.log("=============================================");
  console.log(" SIGNATURE VALIDATION DEBUG LOG");
  console.log("---------------------------------------------");
  console.log(" Path Endpoint     :", path);
  console.log(" Timestamp Header  :", timeStamp);
  console.log(" Instansi ID       :", instansiId);
  console.log(" Request ID        :", requestBody);
  console.log(" idbilling      :", kodeBilling);
  console.log(" StringToSign (API):", signature);
  console.log(
    "🔑 Secret Key (ENV)  :",
    SECRETKEYHMACSHA256 ? "[OK]" : "[MISSING]"
  );
  console.log(" Signature (API)   :", signatureSHA);
  console.log(" Signature (Bank)  :", reqSignature);
  console.log(
    signatureSHA === reqSignature
      ? " Signature MATCH — Valid"
      : " Signature MISMATCH — Invalid"
  );
  console.log("=============================================");
  if (reqSignature != signatureSHA) {
    return res.status(403).send({
      message: "Invalid Signature",
    });
  } else {
    req.contentType = contentType;
    req.signature = signatureSHA;
    req.kodeDaerah = kodeDaerah;
    req.idbilling = kodeBilling;
    req.idbilling = kodeBillingPajak;
    req.instansiId = instansiId;
    req.requestBody = requestBody;
    req.timeStamp = timeStamp;
  }
  /*** End of Condition for the req permission based on Signature req */
  /** end of validation condition */
  next();
};

module.exports = signatureValidation;
