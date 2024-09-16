'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('benefits', [
      {
        description: 'Primer beneficio',
        plane_id: 1,
        state: 'ACTIVE',
        created_at: '2024-09-10 21:00:00-00:05',
        updated_at: '2024-09-10 21:00:00-00:05'
      },
      {
        description: 'Segundo beneficio',
        plane_id: 2,
        state: 'ACTIVE',
        created_at: '2024-09-10 21:00:00-00:05',
        updated_at: '2024-09-10 21:00:00-00:05'
      },
      {
        description: 'Tercer beneficio',
        plane_id: 3,
        state: 'ACTIVE',
        created_at: '2024-09-10 21:00:00-00:05',
        updated_at: '2024-09-10 21:00:00-00:05'
      }], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('benefits', null, {});
  }
};
