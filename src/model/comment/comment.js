const { Model, DataTypes } = require("sequelize");
const sequelize = require("../../db/db");

class Comment extends Model {}

Comment.init(
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
    role: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 1,
    },
  },
  {
    sequelize,
    modelName: "Comment",
  }
);

Comment.hasMany(Comment, {
  foreignKey: {
    name: "parentComment",
    type: DataTypes.BIGINT,
  },
});

module.exports = Comment;
