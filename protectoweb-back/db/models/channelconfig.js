'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ChannelConfig extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ChannelConfig.init({
    channelId: DataTypes.INTEGER,
    theme: DataTypes.STRING,
    slowMode: DataTypes.BOOLEAN,
    minLevelToChat: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'ChannelConfig',
  });
  return ChannelConfig;
};