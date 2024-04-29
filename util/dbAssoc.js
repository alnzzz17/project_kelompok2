const sequelize = require("./db_connect");
const { Pasien, Dokter, Resepsionis } = require('../model/User'); // Import models
const Jadwal = require('../model/Jadwal');
const Appointment = require('../model/Appointment');

//SEMISAL ADA TABEL ROLES
//User.hasMany(Role)
//Role.belongsTo(User)

Pasien.hasMany(Appointment);
Appointment.belongsTo(Pasien);

Dokter.hasMany(Appointment);
Appointment.belongsTo(Dokter);

Resepsionis.hasMany(Appointment);
Appointment.belongsTo(Resepsionis);

Jadwal.hasOne(Dokter);
Dokter.belongsTo(Jadwal);

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