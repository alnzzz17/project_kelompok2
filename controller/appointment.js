require("dotenv").config();
const {
  Resepsionis,
  Dokter,
  Pasien
} = require("../model/User");
const Appointment = require("../model/Appointment");
const Poli = require("../model/Poli");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const key = process.env.TOKEN_SECRET_KEY;
const fs = require("fs");

//GET ALL APPOINTMENT (DONE - TESTED)
const getAllAppoint = async (req, res, next) => {
  try {
    const appointments = await Appointment.findAll({
      order: [
        ["createdAt", "ASC"]
      ],
      include: {
        model: Poli,
        attributes: ["nama"],
      }
    });
    res.status(200).json({
      status: "Success",
      message: "Successfully retrieved all appointments",
      appointments,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      status: "Error",
      message: error.message,
    });
  }
}

//ADD NEW APPOINTMENT (DONE - TESTED)
const addAppoint = async (req, res, next) => {
  //hanya admin dan resepsionis yang bisa menambahkan appointment
  try {
    //mengambil token
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

    if (decoded.role !== 'Resepsionis' && decoded.role !== 'Admin') {
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

    const app_poli = await Poli.findOne({
      where: {
        nama: poli,
      }
    });

    if (app_poli == undefined) {
      const error = new Error(`Poli ${poli} is not existed!`);
      error.statusCode = 400;
      throw error;
    }

    //insert data ke tabel appointment
    const newAppointment = await Appointment.create({
      idPasien,
      idDokter,
      idResepsionis,
      dateTime,
      idPoli: app_poli.id,
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

//DELETE APPOINTMENT (DONE - TESTED)
const deleteAppoint = async (req, res, next) => {
  //hanya admin dan resepsionis yang dapat menghapus appointment
  try {
    //mengambil token
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

    const {
      appId
    } = req.params;

    const deletedAppointment = await Appointment.destroy({
      where: {
        idAppointment: appId
      }
    });
    if (!deletedAppointment) {
      throw new Error("Appointment not found");
    }
    res.status(200).json({
      status: "Success",
      message: "Appointment deleted successfully",
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      status: "Error",
      message: error.message,
    });
  }
}

//EDIT APPOINTMENT DETAILS (DONE - TESTED)
const editAppointDetail = async (req, res, next) => {
  //hanya admin, resepsionis, dan dokter yang dapat mengedit
  try {
    //mengambil token
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

    if (decoded.role !== "Admin" && decoded.role !== "Resepsionis" && decoded.role !== "Dokter") {
      const error = new Error("You don't have access!");
      error.statusCode = 403; //forbidden
      throw error;
    }

    //ambil data dari parameter
    const {
      appId
    } = req.params;

    let currentRow;

    //cari data appointment dari tabel
    currentRow = await Appointment.findByPk(appId);
    if (!currentRow) {
      const error = new Error(`Appointment with id ${appId} does not exist`);
      error.statusCode = 400;
      throw error;
    }

    //ambil total dan discount dari body
    const {
      idPasien,
      idDokter,
      idResepsionis,
      dateTime,
      poli,
      queueNumber,
      keluhan,
      diagnosis,
      assuranceType,
      appStatus,
      total,
      discount
    } = req.body;

    //ambil dari tabel poli
    const app_poli = await Poli.findOne({
      where: {
        nama: poli,
      }
    });

    //hitung bill
    const bill = total - discount;

    //update data
    const updateApp = await Appointment.update({
      idPasien,
      idDokter,
      idResepsionis,
      dateTime,
      poli: app_poli.id,
      queueNumber,
      keluhan,
      diagnosis,
      assuranceType,
      appStatus,
      total,
      discount,
      bill: bill
    }, {
      where: {
        idAppointment: appId
      } //berdasarkan id dari parameter
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

//GET APPOINTMENT BY ID (DONE - TESTED)
const getAppointById = async (req, res, next) => {
  try {
    const authorization = req.headers.authorization;
    let token;

    if (authorization !== null && authorization.startsWith("Bearer ")) {
      token = authorization.substring(7);
    } else {
      const error = new Error("You need to log in");
      error.statusCode = 403;
      throw error;
    }

    const {
      appId
    } = req.params;

    const appointment = await Appointment.findByPk(appId, {
      include: {
        model: Poli,
        attributes: ["nama"],
      }
    });
    if (!appointment) {
      const error = new Error(`Appointment with id ${appId} does not exist`);
      error.statusCode = 400;
      throw error;
    }
    res.status(200).json({
      status: "Success",
      message: "Appointment retrieved successfully",
      appointment,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      status: "Error",
      message: error.message,
    });
  }
}

//GET APPOINTMENT BY PASIEN ID (DONE - TESTED)
const getAppointByPasien = async (req, res, next) => {
  try {

    const {
      idPasien
    } = req.params;

    //mengambil token
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

    if (decoded.role !== "Admin" && decoded.role !== "Resepsionis" && idPasien !== decoded.userId) {
      const error = new Error("You don't have access!");
      error.statusCode = 403; //forbidden
      throw error;
    }
    
    const appointments = await Appointment.findAll({
      include: {
        model: Poli,
        attributes: ["nama"],
      },
      where: {
        idPasien
      }
    });
    res.status(200).json({
      status: "Success",
      message: "Appointments retrieved successfully",
      appointments,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      status: "Error",
      message: error.message,
    });
  }
}

//GET APPOINTMENT BY DOKTER ID (DONE - TESTED)
const getAppointByDokter = async (req, res, next) => {
  try {
    const {
      idDokter
    } = req.params;

    //mengambil token
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

    if (decoded.role !== "Admin" && decoded.role !== "Resepsionis" && idDokter !== decoded.userId) {
      const error = new Error("You don't have access!");
      error.statusCode = 403; //forbidden
      throw error;
    }

    const appointments = await Appointment.findAll({
      include: {
        model: Poli,
        attributes: ["nama"],
      },
      where: {
        idDokter
      },
    });
    res.status(200).json({
      status: "Success",
      message: "Appointments retrieved successfully",
      appointments,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      status: "Error",
      message: error.message,
    });
  }
}

const getAppointByPoli = async (req, res, next) => {
  try {

    //mengambil token
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

    if (decoded.role !== 'Resepsionis' && decoded.role !== 'Admin') {
      const error = new Error("You don't have access!");
      error.statusCode = 403; //forbidden
      throw error;
    }

    const { idPoli } = req.params;
    
    const appointments = await Appointment.findAll({
      include: {
        model: Poli,
        attributes: ["nama"],
      },
      where: {
        idPoli
      }
    });

    res.status(200).json({
      status: "Success",
      message: "Appointments retrieved successfully",
      appointments,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      status: "Error",
      message: error.message,
    });
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
  getAppointByPoli
};
