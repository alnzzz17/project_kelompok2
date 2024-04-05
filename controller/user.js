require("dotenv").config();
const Appointment = require("../model/Appointment");
const Pasien = require("../model/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const key = process.env.TOKEN_SECRET_KEY;
//const cloudinary = require("../util/cloudinary_config");
const fs = require("fs");

const getAllUser = async (req,res,next) => {

}

const getUserById = async (req,res,next) => {

}

const getUserByToken = async (req,res,next) =>{

}

const postUser = async (req, res, next) => {
  try {
    const { role, fullName, email, phoneNumber, password, idNumber, birthDate, gender, personalAddress, historyPenyakit, allergies, sipNumber, specialize, poli, profileDesc } = req.body;

    //hash user password
    const hashedPassword = await bcrypt.hash(password, 5);

    let user;

    switch(role) {
      case 'Pasien':
        user = await Pasien.create({
          idPasien: idNumber,
          fullName,
          password: hashedPassword,
          email,
          phoneNumber,
          birthDate,
          gender,
          personalAddress,
          historyPenyakit,
          allergies
        });
        break;
      case 'Dokter':
        user = await Dokter.create({
          idDokter: sipNumber,
          fullName,
          password: hashedPassword,
          email,
          phoneNumber,
          gender,
          personalAddress,
          birthDate,
          specialize,
          poli,
          profileDesc
        });
        break;
      case 'Resepsionis':
        user = await Resepsionis.create({
          userName: idNumber,
          fullName,
          password: hashedPassword,
          email,
          phoneNumber,
        });
        break;
      default:
        const error = new Error(`Role ${role} is not supported!`);
        error.statusCode = 400;
        throw error;
    }

    // const token = jwt.sign(
    //   {
    //     userId: user.id,
    //     role: role,
    //   },
    //   key,
    //   {
    //     algorithm: "HS256",
    //     expiresIn: "1h",
    //   }
    // );

    //mengirim response
    res.status(201).json({
      status: "success",
      message: "Register Successful!",
      token,
    });
  } catch (error) {
    //jika status code belum terdefined maka status = 500;
    res.status(error.statusCode || 500).json({
      status: "Error",
      message: error.message,
    });
  }
};


const loginHandler = async (req, res, next) => {
  try {
    // Ambil data dari req body
    const { id, password } = req.body;

    // Cari user sesuai dengan id yang diberikan
    let currentUser;
    let role;

    // Identifikasi role dari dua karakter pertama dalam id
    const roleId = id.slice(0, 2);
    switch (roleId) {
      case '01':
        currentUser = await Resepsionis.findOne({ where: { idRsp: id } });
        role = 'resepsionis';
        break;
      case '02':
        currentUser = await Dokter.findOne({ where: { idDokter: id } });
        role = 'dokter';
        break;
      case '03':
        currentUser = await Pasien.findOne({ where: { idPasien: id } });
        role = 'pasien';
        break;
      default:
        // Jika id tidak sesuai dengan format yang diharapkan
        const error = new Error('Invalid User ID!');
        error.statusCode = 400;
        throw error;
    }

    // User tidak ditemukan
    if (!currentUser) {
      const error = new Error('User Not Found!');
      error.statusCode = 400;
      throw error;
    }

    // Periksa apakah password sesuai
    const isPasswordMatch = (password === currentUser.password);

    // Jika password salah
    if (!isPasswordMatch) {
      const error = new Error('Wrong Password!');
      error.statusCode = 400;
      throw error;
    }

    // Buat token dengan menggunakan role
    const token = jwt.sign(
      {
        userId: currentUser.id, // Ubah ini sesuai dengan kolom id yang benar pada masing-masing model
        role: role,
      },
      key,
      {
        algorithm: 'HS256',
        expiresIn: '1h',
      }
    );

    // Kirim respons
    res.status(200).json({
      status: 'Success',
      message: 'Login Successful!',
      token: token,
      role: role,
    });
  } catch (error) {
    // Tangani kesalahan
    res.status(error.statusCode || 500).json({
      status: 'Error',
      message: error.message,
    });
  }
};

const deleteUser = async (req, res, next) => {
  
}

const editUserAccount = async (req, res, next) => {

}

module.exports = {
    getAllUser,
    getUserById,
    postUser,
    deleteUser,
    loginHandler,
    getUserByToken,
    editUserAccount
  };