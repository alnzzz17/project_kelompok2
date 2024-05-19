require("dotenv").config();
const { Resepsionis, Dokter, Pasien } = require("../model/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const key = process.env.TOKEN_SECRET_KEY;
const fs = require("fs");

const getAllAppoint = async (req, res, next) => {
  try {
    const appointments = await Appointment.findAll({
      order: [["createdAt", "DESC"]],
    });
    res.status(200).json({
      status: "Success",
      message: "Successfully retrieved all appointments",
      appointments,
    });
  } catch (error) {
    next(error);
  }
}

//ADD NEW APPOINTMENT (DONE - NOT TESTED YET)
const addAppoint = async (req, res, next) => {
  //hanya role Admin dan Resepsionis yang dapat menambah Appointment 
  try {
    const header = req.headers;
    const authorization = header.authorization;
    let token;

    if (authorization !== undefined && authorization.startsWith("Bearer ")) {
      token = authorization.substring(7);
    } else {
      const error = new Error("You need to login");
      error.statusCode = 403;
      throw error;
    }

    //extract payload untuk mendapatkan userId dan role
    const decoded = jwt.verify(token, key);

    if (decoded.role !== "Admin" && decoded.role !== "Resepsionis") {
      const error = new Error("You don't have access!");
      error.statusCode = 403; //forbidden
      throw error;
    }
    //ambil data dari req body
    const {
      idPasien,
      idDokter,
      idResepsionis,
      dateTime,
      poli,
      queueNumber,
      assuranceType
    } = req.body;

    //insert data ke tabel appointment
    const newAppointment = await Appointment.create({
      idPasien,
      idDokter,
      idResepsionis,
      dateTime,
      poli,
      queueNumber,
      assuranceType
    });

    //kirim response jika berhasil
    res.status(201).json({
      status: "Success",
      message: "Appointment added successfully"
    });
  } catch (error) {
    //error handling
    res.status(error.statusCode || 500).json({
      status: "Error",
      message: error.message,
    });
  }
}

const deleteAppoint = async (req, res, next) => {
  try {
    const { id } = req.params;
    //memeriksa role
    const userRole = req.user.role;
    if (userRole !== "Admin" && userRole !== "Resepsionis") {
      throw new Error("Access denied");
    }

    const deletedAppointment = await Appointment.destroy({
      where: { idAppointment: id },
    });
    if (!deletedAppointment) {
      throw new Error("Appointment not found");
    }
    res.status(200).json({
      status: "Success",
      message: "Appointment deleted successfully",
    });
  } catch (error) {
    next(error);
  }
}

//EDIT APPOINTMENT DETAILS (DONE - TESTED)
const editAppointDetail = async (req, res, next) => {
  try {

    //ambil data dari parameter
    const { appId } = req.params;

    let currentRow;

    //cari data appointment dari tabel
    currentRow = await Appointment.findByPk(appId);
      if (!currentRow) {
        const error = new Error(`Appointment with id ${appId} does not exist`);
        error.statusCode = 400;
        throw error;
      }

    //update data
    const updateApp = await Appointment.update(
    {
      idPasien: req.body.idPasien,
      idDokter: req.body.idDokter,
      idResepsionis: req.body.idResepsionis,
      dateTime: req.body.dateTime,
      poli: req.body.poli,
      queueNumber: req.body.queueNumber,
      keluhan: req.body.keluhan,
      diagnosis: req.body.diagnosis,
      assuranceType: req.body.assuranceType,
      appStatus: req.body.appStatus,
      total: req.body.total,
      discount: req.body.discount,
      bill: req.body.bill
    },
    {
      where: { idAppointment: appId } //berdasarkan id dari parameter
    });

    //jika tidak ditemukan
    if (!updateApp) {
      throw new Error("Appointment not found");
    }
    
    //response jika berhasil di update
    res.status(200).json({
      status: "Success",
      message: "Appointment details updated successfully",
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      status: "Error",
      message: error.message,
    });
  }
}

const getAppointById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const appointment = await Appointment.findByPk(id);
    if (!appointment) {
      throw new Error("Appointment not found");
    }
    res.status(200).json({
      status: "Success",
      message: "Appointment retrieved successfully",
      appointment,
    });
  } catch (error) {
    next(error);
  }
}

const getAppointByPasien = async (req, res, next) => {
  try {
    const { idPasien } = req.params;
    const appointments = await Appointment.findAll({
      where: { idPasien },
    });
    res.status(200).json({
      status: "Success",
      message: "Appointments retrieved successfully",
      appointments,
    });
  } catch (error) {
    next(error);
  }
}

const getAppointByDokter = async (req, res, next) => {
  try {
    const { idDokter } = req.params;
    const appointments = await Appointment.findAll({
      where: { idDokter },
    });
    res.status(200).json({
      status: "Success",
      message: "Appointments retrieved successfully",
      appointments,
    });
  } catch (error) {
    next(error);
  }
}

const getAppointByPoli = async (req, res, next) => {
  try {
    const { poli } = req.query;
    const appointments = await Appointment.findAll({
      where: { poli },
    });
    res.status(200).json({
      status: "Success",
      message: "Appointments retrieved successfully",
      appointments,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAllAppoint,
  addAppoint,
  deleteAppoint,
  editAppointDetail,
  getAppointById,
  getAppointByPasien,
  getAppointByDokter,
  getAppointByPoli,
};
