'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ViewerLevel extends Model {
    static associate(models) {
      // No associations required
    }
  }
  ViewerLevel.init({
    nivel: DataTypes.INTEGER,
    puntos_requeridos: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'ViewerLevel',
  });
  return ViewerLevel;
};
