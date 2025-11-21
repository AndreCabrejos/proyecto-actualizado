'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Channels', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      // create-channel
      nombre: { type: Sequelize.STRING, allowNull: false, unique: true },
      categoria: { type: Sequelize.STRING, allowNull: false },
      imagen: { type: Sequelize.STRING, allowNull: false },
      viewers: { type: Sequelize.INTEGER, defaultValue: 0 },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Channels');
  }
};