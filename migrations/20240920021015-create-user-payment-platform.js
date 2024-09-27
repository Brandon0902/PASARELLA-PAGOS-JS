'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('user_payment_platforms', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      payment_platform_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'payment_platforms',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },
      reference_id: {
        allowNull: false,
        type: 'VARCHAR(50)'
      },
      state: {
        allowNull: false,
        type: 'VARCHAR(10)'
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('user_payment_platforms');
  }
};
