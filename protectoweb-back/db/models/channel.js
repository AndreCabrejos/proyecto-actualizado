'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Channel extends Model {
    static associate(models) {
      Channel.belongsTo(models.User, { foreignKey: 'streamerId', as: 'streamer' });
      Channel.hasMany(models.Gift, { foreignKey: 'channelId' });
      Channel.hasMany(models.GiftHistory, { foreignKey: 'channelId' });
    }
  }
  Channel.init({
    nombre: DataTypes.STRING,
    categoria: DataTypes.STRING,
    imagen: DataTypes.STRING,
    viewers: { type: DataTypes.INTEGER, defaultValue: 0 },
    streamerId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Channel',
  });
  return Channel;
};
