const sequelize = require("../util/db_connect");
const Sequelize = require('sequelize');
const { Resepsionis, Dokter, Pasien } = require("../model/User");

const Appointment = sequelize.define('appointment',{
  idAppointment:{
      type: Sequelize.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
  },
    idPasien:{
      type: Sequelize.STRING,
      allowNull: false,
      references: {
        model: Pasien,
        key: 'idPasien'
      }
  },
  idDokter:{
      type: Sequelize.STRING,
      allowNull: false,
      references: {
        model: Dokter,
        key: 'idDokter'
      }
  },
  idResepsionis:{
      type: Sequelize.STRING,
      allowNull: false,
      references: {
        model: Resepsionis,
        key: 'idRsp'
      }
  },
  dateTime:{
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW
  },
  poli:{
      type: Sequelize.ENUM("Gigi","Umum"),
      allowNull: true
  },
  queueNumber:{
      type: Sequelize.INTEGER,
      allowNull: false
  },
  keluhan:{
    type: Sequelize.TEXT,
    allowNull: true
  },
  diagnosis:{
      type: Sequelize.TEXT,
      allowNull: true
  },
  assuranceType:{
      type: Sequelize.STRING,
      allowNull: true
  },
  appStatus:{
      type: Sequelize.ENUM("TERDAFTAR","SEDANG DIPERIKSA","SELESAI"),
      allowNull: false,
      defaultValue: "TERDAFTAR"
  },
  bill:{
      type: Sequelize.INTEGER,
      allowNull: true
  },
  discount:{
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0
  }
})

module.exports = Appointment;