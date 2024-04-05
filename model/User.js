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
        allowNull: false
    },
    phoneNumber:{
        type: Sequelize.STRING,
        allowNull: false
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
      defaultValue: 'Pasien' // Tetapkan peran default
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
          allowNull: false
      },
      phoneNumber:{
          type: Sequelize.STRING,
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
      birthDate:{
          type: Sequelize.DATEONLY,
          allowNull: false
      },
      specialize:{
          type: Sequelize.STRING,
          allowNull: false
      },
      poli:{
          type: Sequelize.STRING,
          allowNull: false
      },
      profileDesc:{
          type: Sequelize.TEXT,
          allowNull: true
      },
      role: {
        type: Sequelize.STRING,
        defaultValue: 'Dokter' // Tetapkan peran default
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
          allowNull: false
      },
      phoneNumber:{
          type: Sequelize.STRING,
          allowNull: false
      },
      role: {
        type: Sequelize.STRING,
        defaultValue: 'Resepsionis' // Tetapkan peran default
      }
  });
  
module.exports = Resepsionis;
module.exports = Dokter;
module.exports = Pasien;