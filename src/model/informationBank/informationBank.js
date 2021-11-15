const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../db/db');
const validator = require('validator');
const InfoBankImage = require('./infoBankImage');
const ClaimInfoBank = require('./claimInfoBank');
const InfoBankVideo = require('./informationBankVideo');
const InfoBankExperience = require('./infoBankUserExperience');
const InfoBankComment = require('./infoBankComment');
const QAInfoBank = require('./infoBankQ&A');
const Keyword = require('../keyword/keyword');
const InfoBankKeyword = require('./infoBankKeyword');

class InformationBank extends Model {}
InformationBank.init(
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },

    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    services: {
      type: DataTypes.TEXT,
    },

    image: DataTypes.STRING,

    mobile: {
      type: DataTypes.STRING,
      validate: {
        checkMobileNum(val) {
          if (!validator.isMobilePhone(val, ['fa-IR'])) {
            throw new AppError('Wrong Mobile Number', 400);
          }
        },
      },
    },

    phone: DataTypes.STRING,

    fax: DataTypes.STRING,

    longitude: DataTypes.STRING,

    latitude: DataTypes.STRING,

    address: {
      type: DataTypes.TEXT,
    },

    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: true,
      },
    },

    website: DataTypes.STRING,

    postalCode: DataTypes.STRING,

    advertisingMessage: DataTypes.TEXT,

    description: {
      type: DataTypes.TEXT,
    },

    purpose: {
      type: DataTypes.TEXT,
    },

    userProfile: {
      type: DataTypes.TINYINT,
      defaultValue: 0,
    },

    infoType: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0,
      // 0 simple, 1 vip, 2 super vip
    },

    order: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    visitCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },

    experience: {
      type: DataTypes.DATE,
    },

    totalRate: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },

    raterCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },

    status: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0,
      // 0 no owner, 1 owner claim, 2 owned, 4 pending mode
    },

    vipExpDate: DataTypes.DATE,

    catalogue: DataTypes.STRING,
  },
  {
    sequelize,
    modelName: 'InformationBank',
    timestamps: false,
  }
);

// user has many bank

InformationBank.hasMany(InfoBankImage, {
  foreignKey: {
    name: 'frkInfoBank',
    type: DataTypes.BIGINT,
    allowNull: false,
  },
});

InfoBankImage.belongsTo(InformationBank, {
  foreignKey: {
    name: 'frkInfoBank',
    type: DataTypes.BIGINT,
    allowNull: false,
  },
});

InformationBank.hasMany(ClaimInfoBank, {
  foreignKey: {
    name: 'frkInfoBank',
    type: DataTypes.BIGINT,
    allowNull: false,
  },
});

ClaimInfoBank.belongsTo(InformationBank, {
  foreignKey: {
    name: 'frkInfoBank',
    type: DataTypes.BIGINT,
    allowNull: false,
  },
});

InformationBank.hasOne(InfoBankVideo, {
  foreignKey: {
    name: 'frkInfoBank',
    type: DataTypes.BIGINT,
    allowNull: false,
  },
});

InfoBankVideo.belongsTo(InformationBank, {
  foreignKey: {
    name: 'frkInfoBank',
    type: DataTypes.BIGINT,
    allowNull: false,
  },
});

InformationBank.hasMany(InfoBankExperience, {
  foreignKey: {
    name: 'frkInfoBank',
    type: DataTypes.BIGINT,
    allowNull: false,
  },
});

InfoBankExperience.belongsTo(InformationBank, {
  foreignKey: {
    name: 'frkInfoBank',
    type: DataTypes.BIGINT,
    allowNull: false,
  },
});

InformationBank.hasMany(InfoBankComment, {
  foreignKey: {
    name: 'frkInformationBank',
    type: DataTypes.BIGINT,
  },
});

InfoBankComment.belongsTo(InformationBank, {
  foreignKey: {
    name: 'frkInformationBank',
    type: DataTypes.BIGINT,
  },
});

InformationBank.hasMany(QAInfoBank, {
  foreignKey: {
    name: 'frkInfoBank',
    type: DataTypes.BIGINT,
    allowNull: false,
  },
});

QAInfoBank.belongsTo(InformationBank, {
  foreignKey: {
    name: 'frkInfoBank',
    type: DataTypes.BIGINT,
    allowNull: false,
  },
});

InformationBank.belongsToMany(Keyword, {
  through: InfoBankKeyword,
  foreignKey: {
    name: 'frkInfoBank',
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  otherKey: {
    name: 'frkKey',
    type: DataTypes.BIGINT,
    allowNull: false,
  },
});

Keyword.belongsToMany(InformationBank, {
  through: InfoBankKeyword,
  foreignKey: {
    name: 'frkKey',
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  otherKey: {
    name: 'frkInfoBank',
    type: DataTypes.BIGINT,
    allowNull: false,
  },
});

module.exports = InformationBank;
