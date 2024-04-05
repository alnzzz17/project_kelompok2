const sequelize = require("../util/db_connect");
const Sequelize = require('sequelize');

const Jadwal = sequelize.define('jadwal',{
  idJadwal:{
      type: Sequelize.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
  },
  day:{
      type: Sequelize.STRING,
      allowNull: false
  },
  time:{
      type: Sequelize.TIME,
      allowNull: false
  },
    timestamps: false
})

module.exports = Jadwal;