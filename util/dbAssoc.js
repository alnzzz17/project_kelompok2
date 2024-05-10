const sequelize = require("./db_connect");
const { Resepsionis, Dokter, Pasien } = require('../model/User'); // Import models

const Appointment = require('../model/Appointment');

Pasien.hasMany(Appointment, { foreignKey: 'idPasien' });
Appointment.belongsTo(Pasien, { foreignKey: 'idPasien' });

Dokter.hasMany(Appointment, { foreignKey: 'idDokter' });
Appointment.belongsTo(Dokter, { foreignKey: 'idDokter' });

Resepsionis.hasMany(Appointment, { foreignKey: 'idResepsionis' });
Appointment.belongsTo(Resepsionis, { foreignKey: 'idResepsionis' });

const association = async()=>{
  try {
    await sequelize.sync({force: true});
    Dokter.bulkCreate();
    await Pasien.create();
    await Resepsionis.create();
    await Appointment.create();
  } catch (error) {
    console.log(error.message);
  }
}

module.exports = association; 
