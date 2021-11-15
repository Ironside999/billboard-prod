const { DataTypes, Model } = require('sequelize')
const sequelize = require('./../../db/db');

class Invite extends Model {

}

Invite.init({
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
    }
}, {
    sequelize,
    modelName: 'Invite'
})


module.exports = Invite