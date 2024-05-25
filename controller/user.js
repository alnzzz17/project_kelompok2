require("dotenv").config();
const {
  Resepsionis,
  Dokter,
  Pasien
} = require("../model/User");
const Poli = require("../model/Poli");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const key = process.env.TOKEN_SECRET_KEY;
const cloudinary = require("../util/cloudinary_config");
const fs = require("fs");

//GET USER BY ID (DONE - TESTED)
const getUserById = async (req, res, next) => {
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

    if (decoded.role !== "ADMIN" && decoded.role !== "RESEPSIONIS") {
      const error = new Error("You don't have access!");
      error.statusCode = 403; //forbidden
      throw error;
    }

    const {
      userId
    } = req.params;
    let user;

    const roleId = userId.substring(0, 2);

    switch (roleId) {
      case '01':
        user = await Resepsionis.findOne({
          where: {
            idRsp: userId,
          },
          attributes: [
            "idRsp",
            "profilePict",
            "fullName",
            "email",
            "phoneNumber"
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
            "sipNumber",
            "profilePict",
            "fullName",
            "email",
            "phoneNumber",
            "gender",
            "personalAddress",
            "birthDate",
            "specialize",
            "poli",
            "profileDesc",
            "schedule"
          ],
          include: {
            model: Poli,
            attributes: ["nama"]
          }
        });
        break;
      case '03':
        user = await Pasien.findOne({
          where: {
            idPasien: userId,
          },
          attributes: [
            "idPasien",
            "idNumber",
            "profilePict",
            "fullName",
            "email",
            "phoneNumber",
            "emergencyContact",
            "birthDate",
            "gender",
            "personalAddress",
            "historyPenyakit",
            "allergies"
          ]
        });
        break;
      default:
        throw new Error("User Invalid!");
    }

    if (!user) {
      throw new Error(`User with id ${userId} does not exist`);
    }

    res.status(200).json({
      status: "Success",
      message: "Successfully retrieve user data",
      user
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      status: "Error",
      message: error.message,
    });
  }
};

//GET USER BY ROLE ()
const getAllUserByRole = async (req, res, next) => {
  try {
    const {
      role
    } = req.params;
    let users;

    switch (role) {
      case 'Resepsionis':
        users = await Resepsionis.findAll({
          attributes: [
            "idRsp",
            "fullName",
            "email",
            "phoneNumber",
            "profilePict"
          ]
        });
        break;
      case 'Dokter':
        users = await Dokter.findAll({
          attributes: [
            "idDokter",
            "sipNumber",
            "fullName",
            "profilePict",
            "specialize",
            "profileDesc",
            "schedule"
          ],
          include: {
            model: Poli,
            attributes: ["nama"],
          }
        });
        break;
      case 'Pasien':
        users = await Pasien.findAll({
          attributes: [
            "idPasien",
            "fullName",
            "email",
            "phoneNumber",
            "profilePict"
          ]
        });
        break;
      default:
        throw new Error("Invalid role");
    }

    res.status(200).json({
      status: "Success",
      message: "Successfully retrieve user data",
      users
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      status: "Error",
      message: error.message,
    });
  }
};

//post resepsionis (DONE - TESTED)
const postRsp = async (req, res, next) => {
  try {
    //ambil data dari req body
    const {
      idRsp,
      fullName,
      password,
      email,
      phoneNumber
    } = req.body;

    //hash password
    const hashedPassword = await bcrypt.hash(password, 5);

    //insert data ke tabel resepsionis
    const currentUser = await Resepsionis.create({
      idRsp,
      fullName,
      password: hashedPassword,
      email,
      phoneNumber
    });

    //generate jwt token
    const token = jwt.sign({
        userId: currentUser.id,
        role: currentUser.role,
      },
      key, {
        algorithm: "HS256",
        expiresIn: "1h",
      }
    );

    //kirim response
    res.status(201).json({
      status: "success",
      message: "Register Successful!",
      token
    });
  } catch (error) {
    //jika status code undefined, set status = 500
    res.status(error.statusCode || 500).json({
      status: "Error",
      message: error.message,
    });
  }
};

//post pasien (DONE - TESTED)
const postPasien = async (req, res, next) => {
  try {
    //ambil data dari req body
    const {
      idPasien,
      idNumber,
      fullName,
      password,
      email,
      phoneNumber
    } = req.body;

    //hash password
    const hashedPassword = await bcrypt.hash(password, 5);

    //insert data ke tabel pasien
    const currentUser = await Pasien.create({
      idPasien,
      idNumber,
      fullName,
      password: hashedPassword,
      email,
      phoneNumber
    });

    //generate jwt token
    const token = jwt.sign({
        userId: currentUser.id,
        role: currentUser.role,
      },
      key, {
        algorithm: "HS256",
        expiresIn: "1h",
      }
    );

    //kirim response
    res.status(201).json({
      status: "success",
      message: "Register Successful!",
      token,
    });
  } catch (error) {
    //jika status code undefined, set status = 500
    res.status(error.statusCode || 500).json({
      status: "Error",
      message: error.message,
    });
  }
};

//post dokter (DONE - TESTED)
const postDokter = async (req, res, next) => {
  try {
    //ambil data dari req body
    const {
      idDokter,
      sipNumber,
      fullName,
      password,
      email,
      phoneNumber,
      specialize,
      poli
    } = req.body;

    //hash password
    const hashedPassword = await bcrypt.hash(password, 5);

    const dokter_poli = await Poli.findOne({
      where: {
        nama: poli,
      },
    });

    //SELECT * FROM DIVISION WHERE name = division
    if (dokter_poli == undefined) {
      const error = new Error(`Poli ${poli} is not existed!`);
      error.statusCode = 400;
      throw error;
    }

    //insert data ke tabel pasien
    const currentUser = await Dokter.create({
      idDokter,
      sipNumber,
      fullName,
      password: hashedPassword,
      email,
      phoneNumber,
      specialize,
      idPoli: dokter_poli.id
    });

    //generate jwt token
    const token = jwt.sign({
        userId: currentUser.id,
        role: currentUser.role,
      },
      key, {
        algorithm: "HS256",
        expiresIn: "1h",
      }
    );

    //kirim response
    res.status(201).json({
      status: "success",
      message: "Register Successful!",
      token,
    });
  } catch (error) {
    //jika status code undefined, set status = 500
    res.status(error.statusCode || 500).json({
      status: "Error",
      message: error.message,
    });
  }
};

//LOGIN (DONE - TESTED)
const loginHandler = async (req, res, next) => {
  try {
    //ambil data dari req body
    const {
      id,
      password
    } = req.body;

    let currentuser;

    //mengidentifikasi role dari dua karakter pertama id
    const roleId = id.slice(0, 2);
    switch (roleId) {
      case '00':
        currentuser = await Resepsionis.findOne({
          where: {
            idRsp: id
          }
        });
        break;
      case '01':
        currentuser = await Resepsionis.findOne({
          where: {
            idRsp: id
          }
        });
        break;
      case '02':
        currentuser = await Dokter.findOne({
          where: {
            idDokter: id
          }
        });
        break;
      case '03':
        currentuser = await Pasien.findOne({
          where: {
            idPasien: id
          }
        });
        break;
      default:
        //jika format id tidak cocok
        const error = new Error('Invalid ID!');
        error.statusCode = 400;
        throw error;
    }

    if (currentuser == undefined) {
      const error = new Error("User Not Found!");
      error.statusCode = 400;
      throw error;
    }

    const checkPassword = await bcrypt.compare(password, currentuser.password);

    //apabila password salah / tidak match
    if (checkPassword === false) {
      const error = new Error("Wrong email or password");
      error.statusCode = 400;
      throw error;
    }

    //membuat token berdasarkan role
    const token = jwt.sign({
        userId: currentuser.idRsp || currentuser.idDokter || currentuser.idPasien, //identifier berdasarkan role
        role: currentuser.role,
      },
      key, {
        algorithm: 'HS256',
        expiresIn: '1h',
      }
    );

    //kirim response
    res.status(200).json({
      status: 'Success',
      message: 'Login Successful!',
      token: token
    });
  } catch (error) {
    //error handling
    res.status(error.statusCode || 500).json({
      status: 'Error',
      message: error.message,
    });
  }
};

// DELETE USER ACCOUNT (DONE - TESTED)
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
      const error = new Error("You don't have access!");
      error.statusCode = 403; //forbidden
      throw error;
    }

    //2. menghapus user berdasarkan role
    const {
      userId
    } = req.params;
    let deletedUser;

    const roleId = userId.slice(0, 2);

    switch (roleId) {
      case '03':
        deletedUser = await Pasien.destroy({
          where: {
            idPasien: userId,
          },
        });
        break;
      case '02':
        deletedUser = await Dokter.destroy({
          where: {
            idDokter: userId,
          },
        });
        break;
      case '01':
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
    console.log("Starting getUserByToken handler");

    const authorization = req.headers.authorization;
    let token;

    if (authorization && authorization.startsWith("Bearer ")) {
      token = authorization.substring(7);
      console.log("Token extracted: ", token);
    } else {
      const error = new Error("You need to log in");
      error.statusCode = 403;
      throw error;
    }

    const decoded = jwt.verify(token, key);
    console.log("Token decoded: ", decoded);

    let user;
    const roleId = decoded.userId.substring(0, 2);
    console.log("Role ID extracted: ", roleId);

    switch (roleId) {
      case '01':
        user = await Resepsionis.findOne({
          where: { idRsp: decoded.userId },
          attributes: ["idRsp", "profilePict", "fullName", "email", "phoneNumber"]
        });
        break;
      case '02':
        user = await Dokter.findOne({
          where: { idDokter: decoded.userId },
          attributes: ["idDokter", "sipNumber", "profilePict", "fullName", "email", "phoneNumber", "gender", "personalAddress", "specialize", "poli", "profileDesc", "schedule"],
          include: {
            model: Poli,
            attributes: ["nama"]
          }
        });
        break;
      case '03':
        user = await Pasien.findOne({
          where: { idPasien: decoded.userId },
          attributes: ["idPasien", "idNumber", "profilePict", "fullName", "email", "phoneNumber", "emergencyContact", "birthDate", "gender", "personalAddress", "historyPenyakit", "allergies"]
        });
        break;
      default:
        const error = new Error("User Invalid!");
        error.statusCode = 400;
        throw error;
    }

    if (!user) {
      const error = new Error(`User with id ${decoded.userId} does not exist`);
      error.statusCode = 404;
      throw error;
    }

    console.log("User found: ", user);

    res.status(200).json({
      status: "Success",
      message: "Successfully retrieved user data",
      user
    });

  } catch (error) {
    console.error("Error in getUserByToken: ", error);
    res.status(error.statusCode || 500).json({
      status: "Error",
      message: error.message
    });
  }
};

//EDIT USER ACCOUNT (DONE - TESTED) -> further testing needed
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

    if (decoded.role === 'PASIEN') {
      currentUser = await Pasien.findByPk(decoded.userId);
      if (!currentUser) {
        const error = new Error(`User with id ${decoded.userId} does not exist`);
        error.statusCode = 400;
        throw error;
      }
      const file = req.file;
      if (file) {
        const uploadOption = {
          folder: "Profile_User/Pasien/",
          public_id: `pasien_${currentUser.idPasien}`,
          overwrite: true
        };
        const uploadFile = await cloudinary.uploader.upload(file.path, uploadOption);
        imageUrl = uploadFile.secure_url;
        fs.unlinkSync(file.path);
      }

      const {
        idNumber,
        fullName,
        password,
        email,
        phoneNumber,
        emergencyContact,
        birthDate,
        gender,
        personalAddress,
        historyPenyakit,
        allergies
      } = req.body;

      await currentUser.update({
        idNumber,
        profilePict: imageUrl || currentUser.profilePict,
        fullName,
        password,
        email,
        phoneNumber,
        emergencyContact,
        birthDate,
        gender,
        personalAddress,
        historyPenyakit,
        allergies
      });
    } else if (decoded.role === 'DOKTER') {
      currentUser = await Dokter.findByPk(decoded.userId);
      if (!currentUser) {
        const error = new Error(`User with id ${decoded.userId} does not exist`);
        error.statusCode = 400;
        throw error;
      }
      const file = req.file;
      if (file) {
        const uploadOption = {
          folder: "Profile_User/Dokter/",
          public_id: `dokter_${currentUser.idDokter}`,
          overwrite: true,
        };
        const uploadFile = await cloudinary.uploader.upload(file.path, uploadOption);
        imageUrl = uploadFile.secure_url;
        fs.unlinkSync(file.path);
      }

      const {
        sipNumber,
        fullName,
        password,
        email,
        phoneNumber,
        gender,
        personalAddress,
        birthDate,
        specialize,
        poli,
        schedule
      } = req.body;

      const app_poli = await Poli.findOne({
        where: {
          nama: poli,
        }
      });

      await currentUser.update({
        sipNumber,
        profilePict: imageUrl || currentUser.profilePict,
        fullName,
        password,
        email,
        phoneNumber,
        gender,
        personalAddress,
        birthDate,
        specialize,
        idPoli: app_poli.id,
        schedule
      });
    } else if (decoded.role === 'RESEPSIONIS') {
      currentUser = await Resepsionis.findByPk(decoded.userId);
      if (!currentUser) {
        const error = new Error(`User with id ${decoded.userId} does not exist`);
        error.statusCode = 400;
        throw error;
      }
      const file = req.file;
      if (file) {
        const uploadOption = {
          folder: "Profile_User/Resepsionis/",
          public_id: `rsp_${currentUser.idResepsionis}`,
          overwrite: true,
        };
        const uploadFile = await cloudinary.uploader.upload(file.path, uploadOption);
        imageUrl = uploadFile.secure_url;
        fs.unlinkSync(file.path);
      }

      const {
        password,
        fullName,
        email,
        phoneNumber
      } = req.body;

      await currentUser.update({
        password,
        profilePict: imageUrl || currentUser.profilePict,
        fullName,
        email,
        phoneNumber
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
  postRsp,
  postPasien,
  postDokter,
  deleteUser,
  loginHandler,
  getUserByToken,
  editUserAccount
};
