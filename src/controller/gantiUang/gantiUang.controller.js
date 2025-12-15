const gantiUangModel = require("../../model/gantiUang/gantiUang.model");

// Helper untuk format angka desimal
const formatDecimal = (value) =>
  value != null ? Number(value).toFixed(2) : null;

const gantiUangController = {
  // ==================== LIST BILLING ====================
  getBilling: (req, res) => {
    const { request_id } = req.body;
    //const year = req.headers["year"];

    gantiUangModel
      .getBilling({ request_id })
      .then((result) => {
        console.log("getBilling", result);
        res.status(200).send({
          responseCode: result.responseCode,
          responseMessage: result.responseMessage,
          //request_id: request_id || null,
          message: result.message,
          data: result.data,
        });
      })
      .catch((err) => {
        res.status(500).send({
          responseCode: err.responseCode || "99",
          responseMessage: err.responseMessage || "Failed",
          //request_id: request_id || null,
          message: err.message,
        });
      });
  },
  /*getBilling: async (req, res) => {
    const { request_id, data1, data2 } = req.body;

    try {
      const result = await gantiUangModel.getBilling({
        request_id,
        data1,
        data2,
      });

      res.status(200).json({
        responseCode: result.responseCode,
        responseMessage: result.responseMessage,
        request_id,
        message: result.message,
        data1: result.data1,
        data2: result.data2,
      });
    } catch (err) {
      res.status(500).json({
        responseCode: "99",
        responseMessage: "Failed",
        request_id,
        message: err.message,
        data1: [],
        data2: [],
      });
    }
  },*/

  // ==================== INQUIRY ====================
  /*inquiry: (req, res) => {
    const { request_id, idbilling } = req.body;

    gantiUangModel
      .inquiry({ idbilling })
      .then((result) => {
        // Jika tidak ditemukan, kirim response minimalis
        if (result.responseCode !== "00" && result.responseCode !== "02") {
          return res.status(200).send({
            responseCode: result.responseCode,
            responseMessage: result.responseMessage,
            message: result.message, // ambil pesan asli dari model
          });
        }

        // Kalau valid, tampilkan data lengkap
        const customJsonData = result.data.map((row) => ({
          idbilling: row.idbilling,
          Kdstatus: row.Kdstatus,
          Nobukti: row.Nobukti,
          Tgl_posting: row.Tgl_posting,
          SKPD: row.SKPD,
          Dari: row.Dari,
          Nama: row.Nama,
          Nominal: formatDecimal(row.Nominal),
          Potongan_pajak: formatDecimal(row.Potongan_pajak),
          Potongan_lain: formatDecimal(row.Potongan_lain),
          total_potongan: formatDecimal(row.total_potongan),
          Jml_Bruto: formatDecimal(row.Jml_Bruto),
          Untuk: row.Untuk,
          Kepada: row.Kepada,
          NPWP: row.NPWP,
          No_Rek: row.No_Rek,
          Nama_Bank: row.Nama_Bank,
          No_Telp: row.No_Telp,
          Keterangan: row.Keterangan,
          Rek_Debet: row.Rek_Debet,
          IsRekanan: row.IsRekanan,
          NoDokumen: row.NoDokumen,
          TglDokumen: row.TglDokumen,
          KodeSwift: row.KodeSwift,
        }));

        const customJsonRekeningList = result.rekening_list.map((row) => ({
          Kepada: row.NamaRekTujuan,
          kodebank: row.kodebank,
          Nama_bank: row.Nama_bank,
          Kodeswift: row.Kodeswift,
          No_Rek: row.No_Rek,
          Nominal: formatDecimal(row.Nominal),
        }));

        const customJsonPajakList = result.pajak_list.map((row) => ({
          idbilling: row.idbilling,
          kode_billing_pajak: row.kode_billing_pajak,
          deskripsi: row.deskripsi,
          amount_pajak: formatDecimal(row.amount_pajak),
          ntpn: row.ntpn,
          no_dokumen: row.no_dokumen,
          tgl_dokumen: row.tgl_dokumen,
          SKPD: row.SKPD,
          IsRekanan: row.IsRekanan,
          isBayar: row.isBayar,
          tax_code: row.tax_code,
          MasaPajak: row.MasaPajak,
          accountcode: row.accountcode,
        }));

        res.status(200).send({
          responseCode: result.responseCode,
          responseMessage: result.responseMessage,
          message: result.message, // tampilkan message asli dari model
          data: customJsonData,
          rekening_list: customJsonRekeningList,
          pajak_list: customJsonPajakList,
        });
      })
      .catch((err) => {
        res.status(500).send({
          responseCode: "99",
          responseMessage: "Failed",
          message: err.message,
        });
      });
  },*/

  // ==================== INQUIRY ====================
  inquiry: (req, res) => {
    const { request_id, idbilling } = req.body;

    gantiUangModel
      .inquiry({ idbilling })
      .then((result) => {
        // Jika data tidak ditemukan
        if (result.responseCode !== "00" && result.responseCode !== "02") {
          return res.status(200).send({
            responseCode: result.responseCode,
            responseMessage: result.responseMessage,
            message: result.message,
          });
        }

        // ==================== DATA HEADER ====================
        const customJsonData = (result.data || []).map((row) => ({
          idbilling: row.idbilling,
          Kdstatus: row.Kdstatus,
          Nobukti: row.Nobukti,
          Tgl_posting: row.Tgl_posting,
          SKPD: row.SKPD,
          Dari: row.Dari,
          Nama: row.Nama,
          Nominal: formatDecimal(row.Nominal),
          Potongan_pajak: formatDecimal(row.Potongan_pajak),
          Potongan_lain: formatDecimal(row.Potongan_lain),
          total_potongan: formatDecimal(row.total_potongan),
          Jml_Bruto: formatDecimal(row.Jml_Bruto),
          Untuk: row.Untuk,
          Kepada: row.Kepada,
          NPWP: row.NPWP,
          No_Rek: row.No_Rek,
          Nama_Bank: row.Nama_Bank,
          No_Telp: row.No_Telp,
          Keterangan: row.Keterangan,
          Rek_Debet: row.Rek_Debet,
          IsRekanan: row.IsRekanan,
          NoDokumen: row.NoDokumen,
          TglDokumen: row.TglDokumen,
          KodeSwift: row.KodeSwift,
        }));

        // ==================== DATA REKENING TUJUAN ====================
        const customJsonRekeningList = (result.rekening_list || []).map(
          (row) => ({
            Kepada: row.NamaRekTujuan,
            kodebank: row.kodebank,
            Nama_bank: row.Nama_bank,
            Kodeswift: row.Kodeswift,
            No_Rek: row.No_Rek,
            Nominal: formatDecimal(row.Nominal),
          })
        );

        // ==================== DATA POTONGAN PAJAK ====================
        const customJsonPajakList = (result.pajak_list || []).map((row) => ({
          idbilling: row.idbilling,
          kode_billing_pajak: row.kode_billing_pajak,
          deskripsi: row.deskripsi,
          amount_pajak: formatDecimal(row.amount_pajak),
          ntpn: row.ntpn,
          no_dokumen: row.no_dokumen,
          tgl_dokumen: row.tgl_dokumen,
          SKPD: row.SKPD,
          IsRekanan: row.IsRekanan,
          isBayar: row.isBayar,
          tax_code: row.tax_code,
          MasaPajak: row.MasaPajak,
          accountcode: row.accountcode,
        }));

        // ==================== RESPONSE ====================
        res.status(200).send({
          responseCode: result.responseCode,
          responseMessage: result.responseMessage,
          message: result.message,
          data: customJsonData,
          rekening_list: customJsonRekeningList,
          pajak_list: customJsonPajakList,
        });
      })
      .catch((err) => {
        console.error("❌ ERROR di controller inquiry():", err.message);
        res.status(500).send({
          responseCode: "99",
          responseMessage: "Failed",
          message: err.message,
        });
      });
  },

  // ==================== POSTING ====================
  /*posting: (req, res) => {
    const { request_id, idbilling } = req.body;
    //const year = req.headers["year"];

    gantiUangModel
      .posting({ idbilling, request_id })
      .then((result) => {
        console.log("posting", result);
        res.status(200).send({
          responseCode: result.responseCode,
          responseMessage: result.responseMessage,
          //request_id: request_id || null,
          message: result.message,
        });
      })
      .catch((err) => {
        res.status(500).send({
          responseCode: err.responseCode || "99",
          responseMessage: err.responseMessage || "Failed",
          //request_id: request_id || null,
          message: err.message,
        });
      });
  },*/
  // ==================== POSTING ====================
  posting: (req, res) => {
    const { request_id, idbilling, tgltransaksi, kodeTransaksi } = req.body;

    gantiUangModel
      .posting({ idbilling, request_id, tgltransaksi, kodeTransaksi })
      .then((result) => {
        console.log("posting", result);
        res.status(200).send({
          responseCode: result.responseCode,
          responseMessage: result.responseMessage,
          message: result.message,
        });
      })
      .catch((err) => {
        res.status(500).send({
          responseCode: err.responseCode || "99",
          responseMessage: err.responseMessage || "Failed",
          message: err.message,
        });
      });
  },

  reversal: (req, res) => {
    const { idbilling, tgltrx, note } = req.body;

    gantiUangModel
      .reversal({ idbilling, tgltrx, note })
      .then((result) => {
        console.log("reversal", result);
        res.status(200).send({
          response_code: result.response_code,
          response_description: result.response_description,
          message: result.message,
          data: result.data,
        });
      })
      .catch((err) => {
        res.status(500).send({
          response_code: err.response_code || "99",
          response_description: err.response_description || "Failed",
          message: err.message,
        });
      });
  },

  // ==================== POSTING NTPN ====================
  postingNTPN: (req, res) => {
    const { request_id, idbilling, ntpn, tgltrxntpn, tglbukuntpn } = req.body;
    //const year = req.headers["year"];

    gantiUangModel
      .postingNTPN({ idbilling, ntpn, tgltrxntpn, tglbukuntpn })
      .then((result) => {
        console.log("postingNTPN", result);
        res.status(200).send({
          responseCode: result.responseCode,
          responseMessage: result.responseMessage,
          //request_id: request_id || null,
          message: result.message,
          data: result.data,
        });
      })
      .catch((err) => {
        res.status(500).send({
          responseCode: err.responseCode || "99",
          responseMessage: err.responseMessage || "Failed",
          //request_id: request_id || null,
          message: err.message,
        });
      });
  },
};

module.exports = gantiUangController;
