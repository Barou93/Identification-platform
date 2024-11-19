/** @format */

'use strict';
/** @type {import('sequelize-cli').Migration} */
const { v4: uuidv4 } = require('uuid');
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Numbers', {
      id: {
        allowNull: false,
        primaryKey: true,

        type: Sequelize.UUID, // Utilisation du type UUID pour l'ID primaire
        defaultValue: uuidv4,
      },
      phoneNumber: {
        allowNull: false,
        type: Sequelize.STRING,
        unique: true,
        validate: {
          isNumeric: true, // Vérifie que le numéro est numérique
          len: [8, 8], // Limite à 9 chiffres
          startsWith(value) {
            if (!value.startsWith('5')) {
              throw new Error('Le numéro doit commencer par 5.');
            }
          },
        },
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
    await queryInterface.dropTable('Numbers');
  },
};
