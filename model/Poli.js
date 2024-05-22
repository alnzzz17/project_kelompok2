const sequelize = require("../util/db_connect");
const Sequelize = require('sequelize');

const Poli = sequelize.define('poli',{
    id:{
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    nama:{
        type: Sequelize.ENUM("UMUM", "GIGI"),
        allowNull: false
    }
});

module.exports = Poli;