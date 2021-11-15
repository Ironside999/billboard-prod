const { Model, DataTypes } = require("sequelize");
const sequelize = require("../../db/db");

class InfoBankComment extends Model {}

InfoBankComment.init(
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
    modelName: "InfoBankComment",
  }
);

InfoBankComment.hasMany(InfoBankComment, {
  foreignKey: {
    name: "parentComment",
    type: DataTypes.BIGINT,
  },
});

module.exports = InfoBankComment;
