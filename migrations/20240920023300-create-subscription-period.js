'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('subscription_periods', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      subscription_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'subscriptions',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },
      plane_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'planes',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },
      subscription_type_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'subscription_types',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },
      price: {
        allowNull: false,
        type: Sequelize.FLOAT
      },
      reference_id: {
        allowNull: false,
        type: 'VARCHAR(50)'
      },
      error_details: {
        type: Sequelize.JSON
      },
      state: {
        allowNull: false,
        type: 'VARCHAR(15)'
      },
      start_date: {
        allowNull: false,
        type: Sequelize.DATE
      },
      end_date: {
        allowNull: false,
        type: Sequelize.DATE
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('subscription_periods');
  }
};
