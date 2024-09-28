'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('plane_payment_platforms', 'platform_payment_id', 'payment_platform_id');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('plane_payment_platforms', 'payment_platform_id', 'platform_payment_id');
  }
};
