/** @format */

"use strict";
/** @type {import('sequelize-cli').Migration} */
const { v4: uuidv4 } = require("uuid");
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("IdentificationRequests", {
      id: {
        allowNull: false,

        primaryKey: true,
        type: Sequelize.UUID, // Utilisation du type UUID pour l'ID primaire
        defaultValue: uuidv4,
      },
      numberId: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: "Numbers",
          key: "id",
        },
      },

      documentType: {
        allowNull: false,
        type: Sequelize.ENUM(
          "Carte NINA",
          "Carte Biometrique",
          "Carte AMO",
          "Carte Electeur",
          "Recepisse NINA",
          "Passeport",
          "Fiche descriptive individuelle"
        ),
      },
      document_url: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      status: {
        allowNull: false,
        type: Sequelize.ENUM("pedding", "approved", "reject"),
        defaultValue: "pedding",
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
    await queryInterface.dropTable("IdentificationRequests");
  },
};
