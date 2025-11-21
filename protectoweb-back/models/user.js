'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    nombre: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, unique: true, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    role: {
      type: DataTypes.ENUM('viewer','streamer','admin'),
      allowNull: false,
      defaultValue: 'viewer'
    }
  }, {
    tableName: 'users',
    timestamps: true
  });

  return User;
};
