const sequelize = require("../util/db_connect");
const Sequelize = require('sequelize');

const Pasien = sequelize.define('pasien',{
    idPasien:{
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false
    },
    idNumber:{
        type: Sequelize.STRING,
        allowNull: false
    },
    profilePict:{
        type: Sequelize.TEXT,
        allowNull: true
    },
    fullName:{
        type: Sequelize.STRING,
        allowNull: false
    },
    password:{
      type: Sequelize.STRING,
      allowNull: false
    },
    email:{
        type: Sequelize.STRING,
        allowNull: true
    },
    phoneNumber:{
        type: Sequelize.STRING,
        allowNull: true
    },
    emergencyContact:{
        type: Sequelize.STRING,
        allowNull: false
    },
    birthDate:{
        type: Sequelize.DATEONLY,
        allowNull: false
    },
    gender:{
        type: Sequelize.STRING,
        allowNull: false
    },
    personalAddress:{
        type: Sequelize.STRING,
        allowNull: true
    },
    historyPenyakit:{
        type: Sequelize.TEXT,
        allowNull: true
    },
    allergies:{
        type: Sequelize.TEXT,
        allowNull: true
    },
    role: {
      type: Sequelize.STRING,
      defaultValue: 'Pasien' //role default
    }
});
  
const Dokter = sequelize.define('dokter',{
    idDokter:{
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false
    },
    sipNumber:{
        type: Sequelize.STRING,
        allowNull: false
    },
    profilePict:{
        type: Sequelize.TEXT,
        allowNull: true
    },
    fullName:{
        type: Sequelize.STRING,
        allowNull: false
    },
    password:{
      type: Sequelize.STRING,
      allowNull: false
    },
    email:{
        type: Sequelize.STRING,
        allowNull: true
    },
    phoneNumber:{
        type: Sequelize.STRING,
        allowNull: true
    },
    gender:{
        type: Sequelize.STRING,
        allowNull: false
    },
    personalAddress:{
        type: Sequelize.STRING,
        allowNull: true
    },
    birthDate:{
        type: Sequelize.DATEONLY,
        allowNull: false
    },
    specialize:{
        type: Sequelize.STRING,
        allowNull: false
    },
    poli:{
        type: Sequelize.ENUM("Gigi","Umum"),
        allowNull: false
    },
    profileDesc:{
        type: Sequelize.TEXT,
        allowNull: true
    },
    role: {
      type: Sequelize.STRING,
      defaultValue: 'Dokter' //role default
    },
    schedule:{
        type: Sequelize.JSON, //menyimpan jadwal sebagai JSON
        allowNull: false
    }
});
  
const Resepsionis = sequelize.define('resepsionis',{
      idRsp:{
          type: Sequelize.STRING,
          primaryKey: true,
          allowNull: false
      },
      password:{
          type: Sequelize.STRING,
          allowNull: false
      },
      profilePict:{
          type: Sequelize.TEXT,
          allowNull: true
      },
      fullName:{
          type: Sequelize.STRING,
          allowNull: false
      }, 
      email:{
          type: Sequelize.STRING,
          allowNull: true
      },
      phoneNumber:{
          type: Sequelize.STRING,
          allowNull: true
      },
      role: {
        type: Sequelize.STRING,
        type: Sequelize.ENUM("Resepsionis", "Admin"),
        defaultValue: 'Resepsionis' //role default
      }
});
  
module.exports = { Resepsionis, Dokter, Pasien };