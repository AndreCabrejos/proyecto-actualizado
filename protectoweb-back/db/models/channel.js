'use strict';
module.exports = (sequelize, DataTypes) => {
  const Channel = sequelize.define('Channel', {
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    categoria: {
      type: DataTypes.STRING,
      allowNull: false
    },
    imagen: {
      type: DataTypes.STRING,
      allowNull: false
    },
    viewers: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  }, {
    tableName: 'Channels',
    timestamps: true
  });

  Channel.associate = function(models) {
    // Sin relación con User por ahora
  };

  return Channel;
};
