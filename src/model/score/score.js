const { Model, DataTypes } = require("sequelize");
const sequelize = require("../../db/db");

class Score extends Model {
  static async newScore({
    frkUser,
    score = 0,
    scoreType = 1,
    scoreTitle,
  } = {}) {
    const userScore = await this.create({
      frkUser,
      score,
      scoreType,
      scoreTitle,
    });

    return userScore;
  }
}

Score.init(
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    score: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    scoreType: {
      type: DataTypes.TINYINT,
      allowNull: false,
      // 0 baraye kam shode, 1 baraye ziade shode
    },
    scoreTitle: {
      type: DataTypes.TINYINT,
      allowNull: false,
      // 0,1,2,3,4,5,6,7,8
      // har kodom ye maani dare
      // masalan 0 baraye code moAref bashe
      // 3 baraye comment
    },
  },
  {
    sequelize,
    modelName: "Score",
  }
);

module.exports = Score;
