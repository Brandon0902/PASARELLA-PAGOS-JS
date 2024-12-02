'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('plane_payment_platforms', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      plane_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'planes', 
          key: 'id'
        }
      },
      subscription_type_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'subscription_types',
          key: 'id'
        }
      },
      payment_platform_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'payment_platforms',
          key: 'id'
        }
      },
      reference_id: {
        type: Sequelize.STRING,
        allowNull: true
      },
      state: {
        type: 'VARCHAR(10)',
        allowNull: false
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('plane_payment_platforms');
  }
};
