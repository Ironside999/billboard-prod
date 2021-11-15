const { Model, DataTypes } = require("sequelize");
const sequelize = require("../../db/db");

class BbdFinderLike extends Model {};

BbdFinderLike.init(
    {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true,
        },
        ip: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: "BbdFinderLike",
    }
);

module.exports = BbdFinderLike;