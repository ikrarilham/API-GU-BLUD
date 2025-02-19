/** import the connection.js */
const config = require("../../../helper/connection");
/** import the database modules */
const db = require("mssql/msnodesqlv8");
/** import the UUID Version 4 as 'uuidv4' */
const { v4: uuidv4 } = require("uuid");
// const poolManager = require("../../../helper/poolManager");

const gantiUangModel = {
  /** Search Query */
  //   query: (queryParams, sortType = "asc", limit = 5) => {
  //     if (queryParams.search && queryParams.cat) {
  //       return `WHERE username LIKE '%${queryParams.search}%' AND gender LIKE '%${queryParams.cat}%' ORDER BY username ${sortType} LIMIT ${limit}`;
  //     } else if (queryParams.search || queryParams.cat) {
  //       return `WHERE username LIKE '%${queryParams.search}%' OR gender LIKE '%${queryParams.cat}%' ORDER BY username ${sortType} LIMIT ${limit}`;
  //     } else {
  //       return `ORDER BY username ${sortType} limit ${limit}`;
  //     }
  //   },
  /** End of Search Query */
  /** get function */
  get:
    (config,
    (bentukKontrak, kodeSkpd, noSurat) => {
      const request = new db.Request();
      return new Promise((resolve, reject) => {
        /*** Used table name declaration  */
        const bast = "tu_bast";
        const bastDetail = "tu_bast_detail";
        const spk = "tu_spk";
        const organisasi = "gnr_organisasi";
        const kegiatan = "gnr_list_kegiatan90";
        const rekening = "gnr_kode_rekening90";
        /*** End of used table name declaration  */
        /*** Used Query */
        /**** bentukKontrak 1-2 */
        let firstQuery = `SELECT  b.nama, b.kode, c.JumlahBayar as nominal, a.Pihak3 as kodeRekanan, 
            a.nmpihak3 as namaRekanan, a.tanggal_dokumen as tanggalBast, d.kode as kodeKegiatan, 
            d.nama as namaKegiatan, a.* from ${bast} a, ${organisasi} b, ${bastDetail} c, ${kegiatan} d, ${rekening} e where 
            sumberpengadaan=1 
            and bentukKontrak=${bentukKontrak} 
            and b.kode='${kodeSkpd}' 
            and a.noSurat='${noSurat}'
            and a.OrganisasiId=b.org_id 
            and a.idbast=c.idbast 
            and a.KegiatanId=d.kegiatanid 
            and c.RekeningId=e.rekeningid  order by idbast asc`;
        /**** End of bentukKontrak 1-2 */
        /*** End of Used Query */
        /*** Condition based on bentukKontrak */
        switch (bentukKontrak) {
          case "1":
          case "2":
            query = firstQuery;
            break;
          case "3":
          case "4":
          case "5":
            query = secondQuery;
            break;
        }
        /*** End of condition based on bentukKontrak */
        /*** Return the query result to Controller */
        request.query(query, (err, result) => {
          if (err) {
            return reject(err.message);
          } else {
            return resolve(result.recordset);
          }
        });
        /*** End of return the query result to Controller */
      });
    }),
  /** End of get function */
  /** Get Rincian Function */
  getRincian:
    (config, //config = db connection variable (SQL Server), idBast = idBast from the controller
    (idBast) => {
      const request = new db.Request();
      return new Promise((resolve, reject) => {
        /*** Main Query for funtion getRincan */
        query = `Select a.IdBast, a.Nominal, b.kode as kodeRekening, b.nama as namaRekening  from tu_bast_rincian a, 
        gnr_kode_rekening90 b where idbast=${idBast} and a.RekeningId=b.rekeningid order by idBast asc`;
        /***End of main Query for funtion getRincan */
        request.query(query, (err, result) => {
          if (err) {
            return reject(err.message);
          } else {
            return resolve(result.recordset);
          }
        });
      });
    }),
  /** End of get Rincian Function */
};

/** Export the users Model */
module.exports = gantiUangModel;
