'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('subscriptions', {
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
        payment_method_id: {
          allowNull: false,
          type: Sequelize.INTEGER,
          references: {
            model: 'payment_methods',
            key: 'id'
          },
          onUpdate: 'cascade',
          onDelete: 'cascade'
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
        has_trial_days: {
          allowNull: false,
          type: Sequelize.BOOLEAN
        },
        state: {
          allowNull: false,
          type: 'VARCHAR(10)'
        },
        end_date: {
          type: Sequelize.DATE,
        },
        created_at: {
          allowNull: false,
          type: Sequelize.DATE
        },
        updated_at: {
          allowNull: false,
          type: Sequelize.DATE
        }
      }
    );
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('subscriptions');
  }
};
