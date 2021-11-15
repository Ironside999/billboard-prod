const { Model, DataTypes } = require('sequelize');
const validator = require('validator');
const AppError = require('../../appError/appError');
const sequelize = require('../../db/db');
const Favorite = require('../favorite/favorite');
const Note = require('../note/note');
const AdVideo = require('./adVideo');
const Comment = require('../comment/comment');
const AdImage = require('./adImage');

class Ad extends Model {
  async updateOrder() {
    try {
      const userPackage = await this.getJuncUserAdPackage();

      const packAd = await userPackage.getAdPackage();

      const time = this.order.getTime();

      if (userPackage.expireDatePackage < Date.now()) {
        await this.update({
          adType: 0,
          frkAdPackage: null,
        });

        return;
      }

      if (
        +time + +packAd.iterationTime < Date.now() &&
        userPackage.expireDatePackage > Date.now()
      ) {
        await this.update({
          order: Date.now(),
        });
      }
    } catch (e) {
      throw new AppError('Please Try Again', 100);
    }
  }
}

Ad.init(
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        checkLength(val) {
          if (!validator.isLength(val, { min: 1, max: 40 })) {
            throw new AppError('Title is too long', 400);
          }
        },
      },
    },
    image: {
      type: DataTypes.STRING,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    exchange: {
      type: DataTypes.TINYINT,
      // 0 mayel be moaVeze nist, 1 mayel be moaveze
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
    longitude: {
      type: DataTypes.STRING,
    },
    latitude: {
      type: DataTypes.STRING,
    },
    adType: {
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
    price: {
      type: DataTypes.BIGINT,
    },
    userProfile: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0,
      // 0 neshan dade nashavad 1 neshan dade shavad
    },
    isApproved: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0,
    },
    //0 pending 1 accepted 2 rejected
    expireDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Ad',
    timestamps: false,
  }
);

Ad.hasOne(AdVideo, {
  foreignKey: {
    name: 'frkAd',
    allowNull: false,
    type: DataTypes.BIGINT,
  },
});

AdVideo.belongsTo(Ad, {
  foreignKey: {
    name: 'frkAd',
    allowNull: false,
    type: DataTypes.BIGINT,
  },
});

Ad.hasMany(Note, {
  foreignKey: {
    name: 'frkAd',
    type: DataTypes.BIGINT,
  },
});

Note.belongsTo(Ad, {
  foreignKey: {
    name: 'frkAd',
    type: DataTypes.BIGINT,
  },
});

Ad.hasMany(Favorite, {
  foreignKey: {
    name: 'frkAd',
    type: DataTypes.BIGINT,
  },
});

Favorite.belongsTo(Ad, {
  foreignKey: {
    name: 'frkAd',
    type: DataTypes.BIGINT,
  },
});

Ad.hasMany(Comment, {
  foreignKey: {
    name: 'frkAd',
    type: DataTypes.BIGINT,
  },
});

Comment.belongsTo(Ad, {
  foreignKey: {
    name: 'frkAd',
    type: DataTypes.BIGINT,
  },
});

Ad.hasMany(AdImage, {
  foreignKey: {
    name: 'frkAd',
    type: DataTypes.BIGINT,
    allowNull: false,
  },
});

AdImage.belongsTo(Ad, {
  foreignKey: {
    name: 'frkAd',
    type: DataTypes.BIGINT,
    allowNull: false,
  },
});
module.exports = Ad;
