'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('payment_methods', [{
      name: 'CARD',
      state: 'ACTIVE',
      created_at: '2024-09-19 21:00:00-00:05',
    }], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('payment_methods', null, {});
  }
};
