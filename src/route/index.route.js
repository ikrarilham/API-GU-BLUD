/** import express */
const express = require("express");
const router = express();

/** import route */

/*** Admin Menu */
// const organisasiRoute = require("./admin/organisasi.route");
const usersRoute = require("./admin/user.route");
const authRoute = require("./auth/auth.route");

/*** pengadaan Menu */
const pengadaanRoute = require("./pengadaan/pengadaan.route");

/*** bayarGantiUang Menu */
const gantiUang = require("./bayarGantiUang/bayarGantiuang.route");

/*** rekanan Menu */
const rekanan = require("./rekanan/rekanan.route");

/*** kegiatan Menu*/
const kegiatan = require("./kegiatan/kegiatan.route");

/*** rekening Menu */
const rekening = require("./rekening/rekening.route");

/** function for base Prefix */
router.get("/", (req, res) => {
  return res.send("Testing API E-BMD SIPD");
});

/** Route Declaration */

/*** Admin Menu */
// router.use("/organisasi", organisasiRoute);
router.use("/users", usersRoute);
router.use("/auth", authRoute);

/*** pengadaan Menu */
router.use("/pengadaan", pengadaanRoute);

/*** bayarGantiUang Menu */
router.use("/gantiUang", gantiUang);

/*** rekanan Menu */
router.use("/rekanan", rekanan);

/*** kegiatan Menu  */
router.use("/kegiatan", kegiatan);

/*** rekening Menu */
router.use("/rekening", rekening);

/** export the index.router.js */
module.exports = router;
