const express = require("express");
const router = express.Router();

const {
    getAllAppoint,
    addAppoint,
    deleteAppoint,
    editAppointDetail,
    getAppointById,
    getAppointByPasien,
    getAppointByDokter,
    getAppointByPoli
} = require("../controller/appointment");

//GET ALL APPOINTMENT
router.get("/appointments/fetch-all", getAllAppoint);

//ADD NEW APPOINTMENT
router.post("/appointments/add-new", addAppoint);

//DELETE APPOINTMENT
router.delete("/appointments/:appId", deleteAppoint);

//EDIT APPOINTMENT DETAILS
router.put("/appointments/edit/:appId", editAppointDetail);

//GET APPOINTMENT BY ID
router.get("/appointments/:appId", getAppointById);

//GET APPOINTMENT BY PASIEN ID
router.post("/appointments/:idPasien", getAppointByPasien);

//GET APPOINTMENT BY DOKTER ID
router.post("/appointments/:idDokter", getAppointByDokter);

//GET APPOINTMENT BY POLI
router.post("/appointments/poli", getAppointByPoli);

module.exports = router;
