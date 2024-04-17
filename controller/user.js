require("dotenv").config();
const Appointment = require("../model/Appointment");
const { Resepsionis, Dokter, Pasien } = require("../model/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const key = process.env.TOKEN_SECRET_KEY;
const cloudinary = require("../util/cloudinary_config");
const fs = require("fs");

const getUserById = async (req, res, next) => {
  try {
    const { userId } = req.params;
    let user;

    const rolePrefix = userId.substring(0, 2);

    switch (rolePrefix) {
      case '01':
        user = await Resepsionis.findOne({
          where: {
            idRsp: userId,
          },
          attributes: [
            "idRsp",
            "fullName",
            "email",
            "phoneNumber",
            "profilePict",
            "role"
          ]
        });
        break;
      case '02':
        user = await Dokter.findOne({
          where: {
            idDokter: userId,
          },
          attributes: [
            "idDokter",
            "fullName",
            "email",
            "phoneNumber",
            "profilePict",
            "role"
          ]
        });
        break;
      case '03':
        user = await Pasien.findOne({
          where: {
            idPasien: userId,
          },
          attributes: [
            "idPasien",
            "fullName",
            "email",
            "phoneNumber",
            "profilePict",
            "role"
          ]
        });
        break;
      default:
        throw new Error("Invalid role prefix");
    }

    if (!user) {
      throw new Error(`User with id ${userId} does not exist`);
    }

    res.status(200).json({
      status: "Success",
      message: "Successfully retrieve user data",
      user: {
        id: user.idPasien || user.idDokter || user.idRsp,
        fullName: user.fullName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        profilePicture: user.profilePict,
        role: user.role
      },
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      status: "Error",
      message: error.message,
    });
  }
};

const getAllUserByRole = async (req, res, next) => {
  try {
    const { role } = req.params;
    let users;

    switch (role) {
      case '01':
        users = await Resepsionis.findAll({
          attributes: [
            "idRsp",
            "fullName",
            "email",
            "phoneNumber",
            "profilePict",
            "role"
          ]
        });
        break;
      case '02':
        users = await Dokter.findAll({
          attributes: [
            "idDokter",
            "fullName",
            "email",
            "phoneNumber",
            "profilePict",
            "role"
          ]
        });
        break;
      case '03':
        users = await Pasien.findAll({
          attributes: [
            "idPasien",
            "fullName",
            "email",
            "phoneNumber",
            "profilePict",
            "role"
          ]
        });
        break;
      default:
        throw new Error("Invalid role");
    }

    res.status(200).json({
      status: "Success",
      message: "Successfully retrieve user data",
      users,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      status: "Error",
      message: error.message,
    });
  }
};

const postUser = async (req, res, next) => {
  try {
    const { role, fullName, email, phoneNumber,
            password, idNumber, birthDate, gender, personalAddress,
            historyPenyakit, allergies, sipNumber, specialize, poli,
            profileDesc } = req.body;

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

    const token = jwt.sign(
      {
        userId: user.id,
        role: role,
      },
      key,
      {
        algorithm: "HS256",
        expiresIn: "1h",
      }
    );

    res.status(201).json({
      status: "success",
      message: "Register Successful!",
      token,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      status: "Error",
      message: error.message,
    });
  }
};

const loginHandler = async (req, res, next) => {
  try {
    //ambil data dari req body
    const { id, password } = req.body;

    //cari user sesuai dengan id yang diberikan
    let currentUser;
    let role;

    //identifikasi role dari dua karakter pertama dalam id
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
        //jika id tidak sesuai dengan format yang diharapkan
        const error = new Error('Invalid User ID!');
        error.statusCode = 400;
        throw error;
    }

    //user tidak ditemukan
    if (!currentUser) {
      const error = new Error('User Not Found!');
      error.statusCode = 400;
      throw error;
    }

    //periksa apakah password sesuai
    const isPasswordMatch = (password === currentUser.password);

    //jika password salah
    if (!isPasswordMatch) {
      const error = new Error('Wrong Password!');
      error.statusCode = 400;
      throw error;
    }

    //buat token dengan menggunakan role
    const token = jwt.sign(
      {
        userId: currentUser.id, //diubah sesuai dengan kolom id yang benar pada masing2 model
        role: role,
      },
      key,
      {
        algorithm: 'HS256',
        expiresIn: '1h',
      }
    );

    //kirim response
    res.status(200).json({
      status: 'Success',
      message: 'Login Successful!',
      token: token,
      role: role,
    });
  } catch (error) {
    //error handling
    res.status(error.statusCode || 500).json({
      status: 'Error',
      message: error.message,
    });
  }
};

const deleteUser = async (req, res, next) => {
  //hanya admin yang bisa menghapus
  try {
    //1. mengambil token
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

    if (decoded.role !== "ADMIN") {
      const error = new Error("You don't have access!!!");
      error.statusCode = 403; //forbidden
      throw error;
    }

    //2. menghapus user berdasarkan role
    const { userId } = req.params;
    let deletedUser;

    switch (decoded.role) {
      case 'Pasien':
        deletedUser = await Pasien.destroy({
          where: {
            idPasien: userId,
          },
        });
        break;
      case 'Dokter':
        deletedUser = await Dokter.destroy({
          where: {
            idDokter: userId,
          },
        });
        break;
      case 'Resepsionis':
        deletedUser = await Resepsionis.destroy({
          where: {
            idRsp: userId,
          },
        });
        break;
      default:
        const error = new Error("Invalid role");
        error.statusCode = 400;
        throw error;
    }

    if (deletedUser === 0) {
      const error = new Error(`User with id ${userId} does not exist`);
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
      status: "Success",
      message: "User successfully deleted",
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      status: "Error",
      message: error.message,
    });
  }
};

const getUserByToken = async (req, res, next) => {
  try {
    const authorization = req.headers.authorization;
    let token;

    if (authorization !== undefined && authorization.startsWith("Bearer ")) {
      token = authorization.substring(7);
    } else {
      const error = new Error("You need to login");
      error.statusCode = 400;
      throw error;
    }

    const decoded = jwt.verify(token, key);

    let user;
    if (decoded.role === 'Pasien') {
      user = await Pasien.findOne({
        attributes: [
          "idPasien",
          "fullName",
          "idNumber",
          "birthDate",
          "gender",
          "profilePict",
          "personalAddress",
          "historyPenyakit",
          "allergies",
          "role"
        ],
        where: {
          idPasien: decoded.userId,
        },
      });
    } else if (decoded.role === 'Dokter') {
      user = await Dokter.findOne({
        attributes: [
          "idDokter",
          "fullName",
          "sipNumber",
          "birthDate",
          "gender",
          "profilePict",
          "personalAddress",
          "specialize",
          "poli",
          "profileDesc",
          "role"
        ],
        where: {
          idDokter: decoded.userId,
        },
      });
    } else if (decoded.role === 'Resepsionis') {
      user = await Resepsionis.findOne({
        attributes: [
          "idRsp",
          "fullName",
          "role"
        ],
        where: {
          idRsp: decoded.userId,
        },
      });
    } else {
      const error = new Error("Invalid role");
      error.statusCode = 400;
      throw error;
    }

    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
      status: "Success",
      message: "Successfully retrieve data",
      user,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      status: "Error",
      message: error.message,
    });
  }
};

const editUserAccount = async (req, res, next) => {
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

    const decoded = jwt.verify(token, key);

    let currentUser;
    let imageUrl;

    if (decoded.role === 'Pasien') {
      currentUser = await Pasien.findByPk(decoded.userId);
      if (!currentUser) {
        const error = new Error(`User with id ${decoded.userId} does not exist`);
        error.statusCode = 400;
        throw error;
      }
      const file = req.file;
      if (file) {
        const uploadOption = {
          folder: "Profile_Member/",
          public_id: `user_${currentUser.id}`,
          overwrite: true,
        };
        const uploadFile = await cloudinary.uploader.upload(file.path, uploadOption);
        imageUrl = uploadFile.secure_url;
        fs.unlinkSync(file.path);
      }
      await currentUser.update({
        idNumber: req.body.idNumber,
        profilePict: imageUrl || currentUser.profilePict,
        fullName: req.body.fullName,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        emergencyContact: req.body.emergencyContact,
        birthDate: req.body.birthDate,
        gender: req.body.gender,
        personalAddress: req.body.personalAddress,
        historyPenyakit: req.body.historyPenyakit,
        allergies: req.body.allergies
      });
    } else if (decoded.role === 'Dokter') {
      currentUser = await Dokter.findByPk(decoded.userId);
      if (!currentUser) {
        const error = new Error(`User with id ${decoded.userId} does not exist`);
        error.statusCode = 400;
        throw error;
      }
      const file = req.file;
      if (file) {
        const uploadOption = {
          folder: "Profile_Member/",
          public_id: `user_${currentUser.id}`,
          overwrite: true,
        };
        const uploadFile = await cloudinary.uploader.upload(file.path, uploadOption);
        imageUrl = uploadFile.secure_url;
        fs.unlinkSync(file.path);
      }
      await currentUser.update({
        sipNumber: req.body.sipNumber,
        profilePict: imageUrl || currentUser.profilePict,
        fullName: req.body.fullName,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        gender: req.body.gender,
        personalAddress: req.body.personalAddress
      });
    } else if (decoded.role === 'Resepsionis') {
      currentUser = await Resepsionis.findByPk(decoded.userId);
      if (!currentUser) {
        const error = new Error(`User with id ${decoded.userId} does not exist`);
        error.statusCode = 400;
        throw error;
      }
      await currentUser.update({
        fullName: req.body.fullName,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber
      });
    } else {
      const error = new Error("Invalid role");
      error.statusCode = 400;
      throw error;
    }

    const user = await currentUser.reload();

    res.status(200).json({
      status: "Success",
      message: "Successfully edit user data",
      user: {
        id: user.id,
        fullName: user.fullName,
        profilePicture: user.profilePict,
        role: user.role
      },
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      status: "Error",
      message: error.message,
    });
  }
};

module.exports = {
    getUserById,
    getAllUserByRole,
    postUser,
    deleteUser,
    loginHandler,
    getUserByToken,
    editUserAccount
  };