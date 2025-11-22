'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasOne(models.ViewerStat, { foreignKey: 'userId' });
      User.hasMany(models.Channel, { foreignKey: 'streamerId' });
      User.hasMany(models.Gift, { foreignKey: 'streamerId' });
      User.hasMany(models.GiftHistory, { foreignKey: 'senderId' });
    }
  }
  User.init({
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    role: DataTypes.ENUM('viewer','streamer'),
    monedas: { type: DataTypes.INTEGER, defaultValue: 0 }
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};
