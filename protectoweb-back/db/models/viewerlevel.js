'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ViewerLevel extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
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