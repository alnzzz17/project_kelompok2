const sequelize = require("../util/db_connect");
const Sequelize = require('sequelize');
const Jadwal = require("../model/Jadwal");

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
      idJadwal: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
            model: Jadwal,
            key: 'idJadwal'
        }
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
        defaultValue: 'Resepsionis' //role default
      }
  });

  const Admin = sequelize.define('admin',{
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
    role: {
      type: Sequelize.STRING,
      defaultValue: 'Admin' //role default
    }
});
  
module.exports = Resepsionis;
module.exports = Dokter;
module.exports = Pasien;
module.exports = Admin;