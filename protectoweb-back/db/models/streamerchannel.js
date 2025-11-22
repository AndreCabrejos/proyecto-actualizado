'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class StreamerChannel extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  StreamerChannel.init({
    streamerId: DataTypes.INTEGER,
    channelId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'StreamerChannel',
  });
  return StreamerChannel;
};