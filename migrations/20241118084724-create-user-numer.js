'use strict';
/** @type {import('sequelize-cli').Migration} */
const { v4: uuidv4 } = require('uuid');
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('UserNumbers', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: uuidv4,
      },
      numberId: {
        allowNull: false,
        type: Sequelize.UUID,
      },
      number: {
        allowNull: false,
        type: Sequelize.STRING,
        unique: true,
        validate: {
          isNumeric: true,
          len: [8, 8],
          startsWith(value) {
            if (!value.startsWith('5')) {
              throw new Error('Le numéro doit commencer par 5.');
            }
          },
        },
      },
      otp: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      otpExpiresAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      otpVerified: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('UserNumbers');
  },
};
