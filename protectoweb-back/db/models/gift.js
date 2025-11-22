'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Gift extends Model {
    static associate(models) {
      Gift.belongsTo(models.User, { foreignKey: 'streamerId', as: 'owner' });
      Gift.belongsTo(models.Channel, { foreignKey: 'channelId' });
      Gift.hasMany(models.GiftHistory, { foreignKey: 'giftId' });
    }
  }
  Gift.init({
    nombre: DataTypes.STRING,
    costo: DataTypes.INTEGER,
    puntos: DataTypes.INTEGER,
    icono: DataTypes.STRING,
    streamerId: DataTypes.INTEGER,
    channelId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Gift',
  });
  return Gift;
};
