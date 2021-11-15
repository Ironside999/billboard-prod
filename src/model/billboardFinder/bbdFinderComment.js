const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../db/db');
const BbdFinderLike = require('./bbdFinderLike');

class BbdFinderComment extends Model {};

BbdFinderComment.init(
    {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true,
        },
        comment: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: "BbdFinderComment"
    }
);

BbdFinderComment.hasMany(BbdFinderComment, {
    foreignKey: {
        name: "parentComment",
        type: DataTypes.BIGINT,
    }
});

BbdFinderComment.hasMany(BbdFinderLike, {
    foreignKey: {
        type: DataTypes.BIGINT,
        allowNull: false,
        name: "frkComment",
    }
});

BbdFinderLike.belongsTo(BbdFinderComment, {
    foreignKey: {
        type: DataTypes.BIGINT,
        allowNull: false,
        name: "frkComment",
    }
});

module.exports = BbdFinderComment;