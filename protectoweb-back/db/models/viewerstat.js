'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ViewerStat extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }

  // en db/models/viewerstat.js
  ViewerStat.associate = (models) => {
    ViewerStat.belongsTo(models.User, { foreignKey: "userId" });
  };

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