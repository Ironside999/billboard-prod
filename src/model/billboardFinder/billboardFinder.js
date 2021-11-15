const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../db/db');
const validator = require('validator');
const BbdFinderImage = require('./bbdFinderImage');
const AppError = require('../../appError/appError');
const BbdFinderComment = require('./bbdFinderComment');

class BillboardFinder extends Model {}

BillboardFinder.init(
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
    status: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0,
    },
    image: {
      type: DataTypes.STRING,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    longitude: {
      type: DataTypes.STRING,
    },
    latitude: {
      type: DataTypes.STRING,
    },
    address: {
      type: DataTypes.TEXT,
    },
    subMobile: {
      type: DataTypes.STRING,
      validate: {
        checkMobileNum(val) {
          if (!validator.isMobilePhone(val, ['fa-IR'])) {
            throw new AppError('Wrong Mobile Number', 400);
          }
        },
      },
    },
    isAvailable: {
      type: DataTypes.TINYINT,
    },
    freeDate: {
      type: DataTypes.DATE,
    },
    expireDate: {
      type: DataTypes.DATE,
    },
    userProfile: {
      type: DataTypes.TINYINT,
      defaultValue: 0,
    },
    isApproved: {
      type: DataTypes.TINYINT,
    },
    pricePerMonth: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'BillboardFinder',
  }
);

BillboardFinder.hasMany(BbdFinderImage, {
  foreignKey: {
    name: 'frkBbdType',
    type: DataTypes.BIGINT,
    allowNull: false,
  },
});

BbdFinderImage.belongsTo(BillboardFinder, {
  foreignKey: {
    name: 'frkBbdType',
    type: DataTypes.BIGINT,
    allowNull: false,
  },
});

BillboardFinder.hasMany(BbdFinderComment, {
  foreignKey: {
    name: 'frkBbdFinder',
    type: DataTypes.BIGINT,
  },
});

BbdFinderComment.belongsTo(BillboardFinder, {
  foreignKey: {
    name: 'frkBbdFinder',
    type: DataTypes.BIGINT,
  },
});

module.exports = BillboardFinder;
