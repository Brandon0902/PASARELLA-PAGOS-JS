'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('subscription_types', [
      {
        name: 'Mensual',
        code: 'MONTHLY',
        state: 'ACTIVE',
        created_at: '2024-09-10 21:00:00-00:05',
        updated_at: '2024-09-10 21:00:00-00:05'
      },
      {
        name: 'Anual',
        code: 'YEARLY',
        state: 'ACTIVE',
        created_at: '2024-09-10 21:00:00-00:05',
        updated_at: '2024-09-10 21:00:00-00:05'
      }], {});

      await queryInterface.bulkInsert('subscription_prices', [
        {
          plane_id: 1,
          subscription_type_id: 1,
          price: 99,
          state: 'ACTIVE',
          created_at: '2024-09-10 21:00:00-00:05',
          updated_at: '2024-09-10 21:00:00-00:05'
        },
        {
          plane_id: 1,
          subscription_type_id: 2,
          price: 1000,
          state: 'ACTIVE',
          created_at: '2024-09-10 21:00:00-00:05',
          updated_at: '2024-09-10 21:00:00-00:05'
        },
        {
          plane_id: 2,
          subscription_type_id: 1,
          price: 100,
          state: 'ACTIVE',
          created_at: '2024-09-10 21:00:00-00:05',
          updated_at: '2024-09-10 21:00:00-00:05'
        },
        {
          plane_id: 2,
          subscription_type_id: 2,
          price: 1000,
          state: 'ACTIVE',
          created_at: '2024-09-10 21:00:00-00:05',
          updated_at: '2024-09-10 21:00:00-00:05'
        },
        {
          plane_id: 3,
          subscription_type_id: 1,
          price: 200,
          state: 'ACTIVE',
          created_at: '2024-09-10 21:00:00-00:05',
          updated_at: '2024-09-10 21:00:00-00:05'
        },
        {
          plane_id: 3,
          subscription_type_id: 2,
          price: 1200,
          state: 'ACTIVE',
          created_at: '2024-09-10 21:00:00-00:05',
          updated_at: '2024-09-10 21:00:00-00:05'
        }], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('subscription_prices', null, {});
    await queryInterface.bulkDelete('subscription_types', null, {});
  }
};
