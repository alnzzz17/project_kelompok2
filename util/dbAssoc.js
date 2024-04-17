const sequelize = require("./db_connect");
const User = require('../model/User');
const Jadwal = require('../model/Jadwal');
const Appointment = require('../model/Appointment');

//SEMISAL ADA TABEL ROLES
//User.hasMany(Role)
//Role.belongsTo(User)

User.Pasien.hasMany(Appointment);
Appointment.belongsTo(User.Pasien);

User.Dokter.hasMany(Appointment);
Appointment.belongsTo(User.Dokter);

User.Resepsionis.hasMany(Appointment);
Appointment.belongsTo(User.Resepsionis);

Jadwal.hasOne(User.Dokter);
User.Dokter.belongsTo(Jadwal);

const association = async()=>{
  try {
    await sequelize.sync({force: false});
    // Division.bulkCreate();
    // await User.create();
  } catch (error) {
    console.log(error.message);
  }
}

module.exports = association; 