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

//ADD NEW APPOINTMENT (DONE - TESTED)
const addAppoint = async (req, res, next) => {
  try {
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

const editAppointDetail = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [updated] = await Appointment.update(req.body, {
      where: { idAppointment: id },
    });
    if (!updated) {
      throw new Error("Appointment not found");
    }
    res.status(200).json({
      status: "Success",
      message: "Appointment details updated successfully",
    });
  } catch (error) {
    next(error);
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
