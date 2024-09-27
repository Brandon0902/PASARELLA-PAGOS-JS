'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('payment_platforms', [{
       name: 'CONEKTA',
       state: 'ACTIVE',
       created_at: '2024-09-19 21:00:00-00:05',
     },
     {
      name: 'STRIPE',
      state: 'ACTIVE',
      created_at: '2024-09-19 21:00:00-00:05',
    }], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('payment_platforms', null, {});
  }
};
