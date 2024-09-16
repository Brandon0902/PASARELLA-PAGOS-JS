'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('subscription_prices', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
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
      state: {
        allowNull: false,
        type: 'VARCHAR(10)'
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('subscription_prices');
  }
};