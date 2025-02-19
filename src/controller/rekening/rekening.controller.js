/**import crypto for hashing HMAC-SHA256 */
const crypto = require("crypto");
/** Import Secret Key for Signature */
const { SECRETKEYHMACSHA256, USERAUTH } = process.env;
/** import the products.model module */
const rekeningModel = require("../../model/rekening/rekening.model");

const rekeningController = {
  /** get function */
  getData: (req, res) => {
    const userAuthEncoded =
      "Basic" + " " + Buffer.from(USERAUTH).toString("base64");

    /*** Error Validation */
    /**** Request Id validation */
    if (!req.body.request_id) {
      return res.status(403).json({ error: "invalid request_id" });
    }
    /**** End of Request Id validation */
    /*** Error Validation */
    return rekeningModel.get(req.query).then((result) => {
      const headersContentType = req.headers["content-type"];
      const headersKodeDaerah = req.headers["x-kode_daerah"];
      const headersInstansi = req.headers["x-instansi_id"];
      const headersTimeS = req.headers["x-timestamp"];
      const bodyReqId = req.body.request_id; //request_id used in signature
      /*** Create signature with HMACSHA256 */
      const signature =
        headersKodeDaerah + headersInstansi + headersTimeS + bodyReqId;
      const signatureSHA = crypto
        .createHmac("sha256", SECRETKEYHMACSHA256)
        .update(signature)
        .digest("base64");
      /*** End of create signature with HMACSHA256 */
      /*** Header Config */
      res.set({
        "Content-Type": headersContentType,
        Authorization: userAuthEncoded,
        "X-Timestamp": new Date().toISOString(),
        "X-Signature": signatureSHA,
        "X-Kode_Daerah": headersKodeDaerah,
        "X-Instansi_ID": headersInstansi,
      });
      /*** End of header Config */
      const customJson = result.map((row) => {
        data = {
          kode_akun: row.kodeRekening,
          uraian_akun: row.namaRekening,
        };
        return data;
      });
      const costumeJsonSuccess = {
        response_code: "00",
        response_description: "Success",
        request_id: req.body.request_id,
        response_id: "",
        data: customJson,
      };
      return res.status(200).send(costumeJsonSuccess);
    });
  },
  /** End of the get function */
};

/** export the users Controller */
module.exports = rekeningController;
