const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../db/db');

class Transaction extends Model {
  static async newTransaction(data) {
    const transaction = await this.create({ ...data });

    return transaction;
  }

  async authorize(authority) {
    const update = await this.update({ authority });

    return update;
  }

  async success(transactionNumber) {
    const update = await this.update({ status: 3, transactionNumber });

    return update;
  }

  async failed() {
    const update = await this.update({ status: 2 });

    return update;
  }
}

Transaction.init(
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
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    transactionNumber: {
      type: DataTypes.STRING,
    },
    transactionType: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0,
      // 0 payment , 1 wallet
    },
    authority: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 1,
      // 1 pending, 2 notPayed, 3 payed
    },
    identifier: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    modelName: 'Transaction',
    paranoid: true,
  }
);

module.exports = Transaction;
