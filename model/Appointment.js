const sequelize = require("../util/db_connect");
const Sequelize = require('sequelize');

const Appointment = sequelize.define('appointment',{
  idAppointment:{
      type: Sequelize.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
  },
  dateTime:{
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW
  },
  poli:{
      type: Sequelize.STRING, //or ENUM("Gigi","Umum") or buat tabel baru???
      allowNull: false
  },
  queueNumber:{
      type: Sequelize.INTEGER,
      allowNull: false
  },
  keluhan:{
    type: Sequelize.TEXT,
    allowNull: false
  },
  diagnosis:{
      type: Sequelize.TEXT,
      allowNull: false
  },
  assuranceType:{
      type: Sequelize.STRING,
      allowNull: true
  },
  appStatus:{
      type: Sequelize.ENUM("TERDAFTAR","SEDANG DIPERIKSA","SELESAI"),
      allowNull: false
  },
  bill:{
      type: Sequelize.INTEGER,
      allowNull: false
  },
  discount:{
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0
  }
})

module.exports = Appointment;