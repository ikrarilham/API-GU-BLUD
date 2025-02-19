/**import crypto for hashing HMAC-SHA256 */
const crypto = require("crypto");
/** Import Secret Key for Signature */
const { SECRETKEYHMACSHA256, USERAUTH } = process.env;
/** import the products.model module */
const gantiUangModel = require("../../model/bayarGantiUang/bayarGantiUang.model");

const gantiUangController = {
  /** get function */
  getData: (req, res) => {
    const userAuthEncoded =
      "Basic" + " " + Buffer.from(USERAUTH).toString("base64");

    /*** Temporary Error validation for pengadaan */
    /**** Request Id validation */
    if (!req.body.request_id) {
      return res.status(403).json({ error: "invalid request_id" });
    }
    /**** End of Request Id validation */
    /**** No Surat validation */
    if (!req.body.noSurat) {
      return res
        .status(403)
        .json({ error: "please insert the valid No Surat" });
    }
    /**** End of No Surat validation */
    /**** Bentuk Kontrak validation */
    if (!req.body.bentukKontrak) {
      return res
        .status(403)
        .json({ error: "Please insert the Bentuk Kontrak First" });
    }
    if (
      req.body.bentukKontrak == 3 ||
      req.body.bentukKontrak == 4 ||
      req.body.bentukKontrak == 5
    ) {
      return res
        .status(403)
        .json({ error: "Bentuk Kontrak for APBD must be 1 or 2" });
    }
    /**** End of Bentuk Kontrak validation */
    /**** Kode SKPD Validation */
    if (!req.body.kodeSkpd) {
      return res.status(403).json({ error: "Invalid Kode SKPD" });
    }
    /**** End of Kode SKPD Validation */
    /*** End of Temporary Error validation for pengadaan */
    /*** Declare the body request into Variable */
    const noSurat = req.body.noSurat;
    const bentukKontrak = req.body.bentukKontrak;
    const kodeSkpd = req.body.kodeSkpd;
    /*** End of the Declare the body request into Variable */
    return (
      gantiUangModel
        .get(bentukKontrak, kodeSkpd, noSurat) //throw the parameter to get function in model
        .then((result) => {
          id = result.map((row) => row.IdBast);
          /*** return the idBast from result and firstResult back to model  */
          return Promise.all(
            id.map((idBast) => gantiUangModel.getRincian(idBast)) //maping the array contain idBast that used in model
          ).then((rincianResult) => ({
            result,
            rincianResult: rincianResult.flat(),
          }));
          /*** End of return the idBast from result and firstResult back to model  */
        })
        /*** Step for costumize the Json and final result*/
        .then(({ result, rincianResult }) => {
          /*** Variable for Custom Response Header */
          const headersContentType = req.headers["content-type"];
          const headersKodeDaerah = req.headers["x-kode_daerah"];
          const headersInstansi = req.headers["x-instansi_id"];
          const headersTimeS = req.headers["x-timestamp"];
          const bodyReqId = req.body.request_id; //request_id used in signature
          /*** End of Variable for Custom Response Header */
          /*** Create Signature with HMACSHA256 */
          const signature =
            headersKodeDaerah + headersInstansi + headersTimeS + bodyReqId;
          const signatureSHA = crypto
            .createHmac("sha256", SECRETKEYHMACSHA256)
            .update(signature)
            .digest("base64");
          /*** End of the Create Signature with HMACSHA256 */
          /*** Header Config */
          res.set({
            "Content-Type": headersContentType,
            Authorization: userAuthEncoded,
            "X-Timestamp": new Date().toISOString(),
            "X-Signature": signatureSHA,
            "X-Kode_Daerah": headersKodeDaerah,
            "X-Instansi_ID": headersInstansi,
          });
          /*** End of Header Config */
          const responseArray = result.map((row) => {
            /*** Seperating the result with rincianResult */
            const relatedRincian = rincianResult.filter(
              (rincian) => rincian.IdBast === row.IdBast //Use the idBast for the Relation
            );
            /*** End of Seperating the result with rincianResult */
            /*** Costumize the Json Body */
            const data = {
              no_kontrak: row.nomorKontrak,
              tgl_kontrak: row.tanggalSpk,
              no_pembayaran: row.NoSurat,
              tgl_pembayaran: row.tanggalBast,
              kode_akun_kegiatan: row.kodeKegiatan,
              uraian_akun_kegiatan: row.namaKegiatan,
              kode_rekanan: row.kodeRekanan,
              nama_rekanan: row.namaRekanan,
              data_rincian: relatedRincian.map((rincian) => ({
                kode_akun_belanja: rincian.kodeRekening,
                uraian_akun_belanja: rincian.namaRekening,
                nominal: rincian.Nominal,
              })),
            };
            return data;
            /*** End of Costumize the Json Body */
          });
          /*** Costum Success Json Response  */
          const costumeJsonSuccess = {
            response_code: "00",
            response_description: "Success",
            request_id: req.body.request_id,
            response_id: "",
            kode_skpd: result[0].kode,
            nama_skpd: result[0].nama,
            data: responseArray,
          };
          /*** End of Costum Success Json Response  */
          return res.status(200).send(costumeJsonSuccess); //return the Json
        })
        /*** End of the Step for costumize the Json and final result*/
        .catch((error) => {
          /*** Costum Failed Json Response */
          const costumeJsonFailed = {
            response_code: "01",
            response_description: "Not Found",
            request_id: req.body.request_id,
            response_id: "",
          };
          /*** End of Costum Failed Json Response */
          return res.status(500).send(costumeJsonFailed); //catch the error message
        })
    );
  },
  /** End of the get function */
};

/** export the users Controller */
module.exports = gantiUangController;
