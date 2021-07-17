'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'Transports',
      [
        {
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
        },
        {
          paket_id: 4,
          paket_bez: 'Tastatur',
          fach_bez: 'Fach 4',
          zbs_bez: 'ZBS 1',
          tour_bez: 'NRW 1',
          emp_name: 'Gerard',
          emp_plz: '00002',
          abd_name: 'Felix',
          abd_plz: '00002',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          paket_id: 5,
          paket_bez: 'HDMI',
          fach_bez: 'Fach 5',
          zbs_bez: 'ZBS 1',
          tour_bez: 'NRW 1',
          emp_name: 'Gerard',
          emp_plz: '00002',
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
