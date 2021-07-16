'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Transports', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      transport_status: {
        type: Sequelize.INTEGER
      },
      paket_id: {
        type: Sequelize.INTEGER,
        unique: true
      },
      paket_bez: {
        type: Sequelize.STRING
      },
      fach_bez: {
        type: Sequelize.STRING
      },
      zbs_bez: {
        type: Sequelize.STRING
      },
      tour_bez: {
        type: Sequelize.STRING
      },
      tour: {
        type: Sequelize.ARRAY(Sequelize.STRING)
      },
      tour_zeit: {
        type: Sequelize.ARRAY(Sequelize.STRING)
      },
      emp_name: {
        type: Sequelize.STRING
      },
      emp_plz: {
        type: Sequelize.STRING
      },
      abd_name: {
        type: Sequelize.STRING
      },
      abd_plz: {
        type: Sequelize.STRING
      },
      abholversuch: {
        type: Sequelize.INTEGER,
        defaultValue: '0'
      },
      alter: {
        type: Sequelize.INTEGER,
        defaultValue: '0'
      },
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
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Transports');
  }
};