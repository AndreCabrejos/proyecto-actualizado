'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ViewerStat extends Model {
    static associate(models) {
      ViewerStat.belongsTo(models.User, { foreignKey: "userId" });
    }
  }
  ViewerStat.init({
    userId: DataTypes.INTEGER,
    nivel: DataTypes.INTEGER,
    puntos: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'ViewerStat',
  });
  return ViewerStat;
};
