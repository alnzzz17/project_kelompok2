require("dotenv").config();
const sequelize = require("./db_connect");
const bcrypt = require('bcrypt');
const { Resepsionis, Dokter, Pasien } = require('../model/User');
const Appointment = require('../model/Appointment');
const Poli = require('../model/Poli');

const poli = [
  {nama: "UMUM"},
  {nama: "GIGI"}
]

const adminPassword = process.env.ADMIN_PWD;
const hashedPwd = bcrypt.hashSync(adminPassword, 5);

const admin = {
  idRsp: process.env.ADMIN_ID,
  fullName: process.env.ADMIN_FULLNAME,
  password: hashedPwd,
  email: process.env.ADMIN_EMAIL,
  phoneNumber: process.env.ADMIN_PHONE,
  role: "Admin"
}

Pasien.hasMany(Appointment, { foreignKey: 'idPasien' });
Appointment.belongsTo(Pasien, { foreignKey: 'idPasien' });

Dokter.hasMany(Appointment, { foreignKey: 'idDokter' });
Appointment.belongsTo(Dokter, { foreignKey: 'idDokter' });

Resepsionis.hasMany(Appointment, { foreignKey: 'idResepsionis' });
Appointment.belongsTo(Resepsionis, { foreignKey: 'idResepsionis' });

Poli.hasMany(Appointment, { foreignKey: 'idPoli' });
Appointment.belongsTo(Poli, { foreignKey: 'idPoli' });

Poli.hasMany(Dokter, { foreignKey: 'idPoli' });
Dokter.belongsTo(Poli, { foreignKey: 'idPoli' });

const association = async()=>{
  try {
    await sequelize.sync({force: false});
    // Poli.bulkCreate(poli);
    // await Dokter.create();
    //await Resepsionis.create(admin);
    // await Pasien.create();
    // await Appointment.create();
  } catch (error) {
    console.log(error.message);
  }
}

module.exports = association; 
