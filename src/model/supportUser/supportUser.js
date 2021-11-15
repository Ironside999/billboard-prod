const { Model, DataTypes } = require("sequelize");
const sequelize = require("../../db/db");
const User = require('../user/user');
const validator = require('validator');

class SupportUser extends Model {};

SupportUser.init(
    {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true,
        },
        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: false,
        },
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
        image: {
            type: DataTypes.STRING,
        },
        userCount: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
    },
    {
        sequelize,
        modelName: "SupportUser"
    }
);

SupportUser.hasMany(User, {
    foreignKey: {
        type: DataTypes.BIGINT,
        name: "frkSupportUser",
    }
});

User.belongsTo(SupportUser, {
    foreignKey: {
        type: DataTypes.BIGINT,
        name: "frkSupportUser",
    }
});

module.exports = SupportUser;