'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'Transports',
      [
        {
          transport_status: 0,
          paket_id: 1,
          paket_bez: 'Laptop',
          fach_bez: 'Fach 1',
          zbs_bez: 'ZBS 1',
          tour_bez: 'NRW 1',
          emp_name: 'Alice',
          emp_plz: '00001',
          abd_name: 'Bob',
          abd_plz: '00001',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          transport_status: 1,
          paket_id: 2,
          paket_bez: 'Handy',
          fach_bez: 'Fach 2',
          zbs_bez: 'ZBS 1',
          tour_bez: 'NRW 1',
          emp_name: 'Charlie',
          emp_plz: '00002',
          abd_name: 'David',
          abd_plz: '00001',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          transport_status: 0,
          paket_id: 3,
          paket_bez: 'Mouse',
          fach_bez: 'Fach 3',
          zbs_bez: 'ZBS 1',
          tour_bez: 'NRW 1',
          emp_name: 'Emilie',
          emp_plz: '00001',
          abd_name: 'Felix',
          abd_plz: '00002',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]
    )
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
