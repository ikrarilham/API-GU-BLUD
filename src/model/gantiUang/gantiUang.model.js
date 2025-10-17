const db = require("mssql/msnodesqlv8");
const connectDatabase = require("../../../helper/connection");
const { response } = require("express");

const formatDate = (date) => {
  if (!date) return null;
  return new Date(date).toISOString().slice(0, 10).replace(/-/g, "");
};

const gantiUangModel = {
  // ==================== LIST BILLING ====================
  getBilling: async ({ request_id }) => {
    const config = connectDatabase();
    try {
      await db.connect(config);

      const request = new db.Request();

      const query = `
      SELECT 
        a.idbilling AS idbilling,
        a.Nobukti AS noBukti
      FROM Tu_BukuBank_temp a
      WHERE ISNULL(a.idbilling, '') <> ''
    `;

      const result = await request.query(query);

      db.close();

      if (!result.recordset || result.recordset.length === 0) {
        return {
          responseCode: "99",
          responseMessage: "Data billing tidak ditemukan",
          message: "Tidak ada data billing dalam antrian.",
          data: [],
        };
      }

      // Kelompokkan hasil ke dalam satu objek dengan array idbilling dan nobukti
      const idbillingList = result.recordset.map((row) => row.idbilling);
      const noBuktiList = result.recordset.map((row) => row.noBukti);

      return {
        responseCode: "00",
        responseMessage: "Success",
        message: `Ada ${result.recordset.length} Transaksi GU dalam antrian. IdBilling-nya disajikan di data.`,
        data: [
          {
            idbilling: idbillingList,
            noBukti: noBuktiList,
          },
        ],
      };
    } catch (err) {
      db.close();
      return {
        responseCode: "99",
        responseMessage: "Query listBilling gagal",
        message: err.message,
        data: [],
      };
    }
  },

  // ==================== INQUIRY ====================
  inquiry: async ({ idbilling }) => {
    const config = connectDatabase();
    try {
      await db.connect(config);
      console.log("🟢 DB connected, idbilling:", idbilling);

      const request = new db.Request();
      request.input("idbilling", db.VarChar, idbilling);

      const result = await request.query(
        `SELECT * FROM [dbo].[F_TU_GU_FOR_BANK](@idbilling)`
      );
      console.log("✅ Result dari F_TU_GU_FOR_BANK:", result.recordset?.length);

      if (!result.recordset || result.recordset.length === 0) {
        db.close();
        return {
          responseCode: "99",
          responseMessage: "ID Billing tidak ditemukan",
          message: `Tidak ada transaksi GU untuk idbilling ${idbilling}`,
          data: [],
        };
      }

      const rekeningResult = await request.query(`
        SELECT 
            a.NamaRekeningTujuan AS NamaRekTujuan, 
            a.KodeBankTujuan AS kodebank,
            a.BankTujuan AS Nama_bank,
            ISNULL(b.kdswift,'') AS Kodeswift,   -- ambil dari tabel gnr_kode_bank
            a.NoRekeningTujuan AS No_Rek,
            a.Pengeluaran AS Nominal
        FROM Tu_BukuBank_temp a
        LEFT JOIN gnr_kode_bank b ON a.KodeBankTujuan = b.kode   -- relasi antar tabel
        WHERE a.idbilling = @idbilling;
      `);
      console.log("✅ Rekening list:", rekeningResult.recordset?.length);

      const pajakResult = await request.query(`
        SELECT * FROM [dbo].[F_TU_PAJAK_GU_FOR_BANK] (@idbilling)
      `);
      console.log("✅ Pajak list:", pajakResult.recordset?.length);

      db.close();
      return {
        responseCode: "00",
        responseMessage: "Success",
        message: `Terdapat ${result.recordset.length} transaksi GU.`,
        data: result.recordset,
        rekening_list: rekeningResult.recordset,
        pajak_list: pajakResult.recordset,
      };
    } catch (err) {
      console.error("❌ ERROR di inquiry():", err.message);
      db.close();
      return {
        responseCode: "99",
        responseMessage: "Query inquiry gagal",
        message: err.message,
        data: [],
      };
    }
  },

  // ==================== POSTING ====================
  /*posting: async ({ idbilling, request_id }) => {
    const config = connectDatabase();
    try {
      await db.connect(config);

      const request = new db.Request();
      request.input("idBill", db.VarChar(50), idbilling);

      // Cek apakah idbilling ada
      const checkQuery = `
      SELECT 1 FROM Tu_BukuBank_temp WHERE idbilling = @idBill
    `;
      const checkResult = await request.query(checkQuery);

      if (!checkResult.recordset || checkResult.recordset.length === 0) {
        db.close();
        return {
          responseCode: "99",
          responseMessage: "Data tidak ditemukan",
          message: `IdBilling ${idbilling} tidak ditemukan.`,
          data: [],
        };
      }

      // Lanjut eksekusi SP jika data ditemukan
      await request.execute("SP_BkBankExec_GU");

      db.close();
      return {
        responseCode: "00",
        responseMessage: "Success",
        message: `OK.`,
        data: { request_id, idbilling },
      };
    } catch (err) {
      db.close();
      return {
        responseCode: "99",
        responseMessage: "Query posting gagal",
        message: err.message,
        data: [],
      };
    }
  },*/
  // ==================== POSTING ====================
  posting: async ({ idbilling, request_id, tgltransaksi, kodeTransaksi }) => {
    const config = connectDatabase();
    try {
      await db.connect(config);

      const request = new db.Request();
      request.input("idBill", db.VarChar(50), idbilling);

      // Cek apakah idbilling ada
      const checkQuery = `SELECT 1 FROM Tu_BukuBank_temp WHERE idbilling = @idBill`;
      const checkResult = await request.query(checkQuery);

      if (!checkResult.recordset || checkResult.recordset.length === 0) {
        db.close();
        return {
          responseCode: "99",
          responseMessage: "Data tidak ditemukan",
          message: `IdBilling ${idbilling} tidak ditemukan.`,
          data: [],
        };
      }

      // Jika tanggalcair dikirim, update dulu ke tabel temp
      if (tgltransaksi && tgltransaksi.trim() !== "") {
        const updateNote = new db.Request();
        updateNote.input("idBill", db.VarChar(50), idbilling);
        updateNote.input("TanggalCair", db.VarChar(500), tgltransaksi);
        await updateNote.query(`
        UPDATE Tu_BukuBank_temp 
        SET tanggal_cair = @TanggalCair 
        WHERE idbilling = @idBill
      `);
      }

      // Eksekusi SP
      //await request.execute("SP_BkBankExec_GU");

      // Jalankan stored procedure
      const spRequest = new db.Request();
      spRequest.input("idBill", db.VarChar(50), idbilling);
      await spRequest.execute("SP_BkBankExec_GU");

      db.close();
      return {
        responseCode: "00",
        responseMessage: "Success",
        message: "OK",
        data: { request_id, idbilling, tgltransaksi, kodeTransaksi },
      };
    } catch (err) {
      db.close();
      return {
        responseCode: "99",
        responseMessage: "Query posting gagal",
        message: err.message,
        data: [],
      };
    }
  },

  // ==================== REVERSAL ====================
  reversal: async ({ idbilling, tgltrx, note }) => {
    const config = connectDatabase(); // tidak perlu 'year' lagi

    try {
      await db.connect(config);

      const request = new db.Request();
      request.input("idbilling", db.VarChar(50), idbilling);
      request.input("tgltrx", db.VarChar(10), tgltrx);
      request.input("note", db.VarChar(255), note);

      const result = await request.execute("SP_Reversal_GU");

      db.close();

      return {
        response_code: result.recordset?.[0]?.response_code || "00",
        response_description:
          result.recordset?.[0]?.response_message || "Success",
        message: result.recordset?.[0]?.message || "OK",
      };
    } catch (err) {
      db.close();
      return {
        response_code: "99",
        response_description: "Reversal gagal",
        message: err.message,
        data: [],
      };
    }
  },

  // ==================== POSTING NTPN ====================
  postingNTPN: async ({ idbilling, ntpn, tgltrxntpn, tglbukuntpn }) => {
    const config = connectDatabase();
    try {
      await db.connect(config);

      const request = new db.Request();
      request.input("idBilling", db.VarChar(50), idbilling);

      // Cek apakah idbilling ada
      const checkQuery = `
      SELECT 1 FROM Tu_BukuPajak_temp WHERE idbilling = @idBilling
    `;
      const checkResult = await request.query(checkQuery);

      if (!checkResult.recordset || checkResult.recordset.length === 0) {
        db.close();
        return {
          responseCode: "99",
          responseMessage: "Data tidak ditemukan",
          message: `IdBilling ${idbilling} tidak ditemukan di Tu_BukuPajak_temp.`,
          data: [],
        };
      }

      // Input parameter lainnya untuk stored procedure
      request.input("ntpn", db.VarChar(50), ntpn);
      request.input("tgltrxntpn", db.VarChar(10), tgltrxntpn);
      request.input("tglbukuntpn", db.VarChar(10), tglbukuntpn);

      const result = await request.execute("spPostingntpnGU");

      db.close(); // Tutup koneksi di sini (try)

      // Dedup hasil query
      let data = [];
      if (result.recordset && result.recordset.length > 0) {
        const uniqueMap = new Map();
        for (const row of result.recordset) {
          const key = `${row.IdBilling}|${row.TglTrx_NTPN}|${row.TglBuku_NTPN}`;
          if (!uniqueMap.has(key)) uniqueMap.set(key, row);
        }
        data = Array.from(uniqueMap.values());
      }

      return {
        responseCode: "00",
        responseMessage: "Success",
        message: `OK`,
        data,
      };
    } catch (err) {
      db.close(); // Tutup koneksi di catch jika terjadi error
      return {
        responseCode: "99",
        responseMessage: "Query postingNTPN gagal",
        message: err.message,
        data: [],
      };
    }
  },
};

module.exports = gantiUangModel;
