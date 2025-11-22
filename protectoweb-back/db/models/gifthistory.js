'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class GiftHistory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  GiftHistory.init({
    userId: DataTypes.INTEGER,
    streamerId: DataTypes.INTEGER,
    channelId: DataTypes.INTEGER,
    giftId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'GiftHistory',
  });
  return GiftHistory;
};