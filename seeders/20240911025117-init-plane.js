'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('planes', [
      {
        name: 'Plan Básico',
        description: 'Un plan básico',
        trial_days: 7,
        state: 'ACTIVE',
        created_at: '2024-09-10 21:00:00-00:05',
        updated_at: '2024-09-10 21:00:00-00:05'
      },
      {
        name: 'Plan Premium',
        description: 'Un plan premium',
        trial_days: 7,
        state: 'ACTIVE',
        created_at: '2024-09-10 21:00:00-00:05',
        updated_at: '2024-09-10 21:00:00-00:05'
      },
      {
        name: 'Plan Despachos',
        description: 'Un plan de despachos',
        trial_days: 7,
        state: 'ACTIVE',
        created_at: '2024-09-10 21:00:00-00:05',
        updated_at: '2024-09-10 21:00:00-00:05'
      }], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('planes', null, {});
  }
};
