/** @format */

"use strict";
/** @type {import('sequelize-cli').Migration} */
const { v4: uuidv4 } = require("uuid");
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Reviews", {
      id: {
        allowNull: false,

        primaryKey: true,
        type: Sequelize.UUID, // Utilisation du type UUID pour l'ID primaire
        defaultValue: uuidv4,
      },
      identificationId: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: "IdentificationRequests",
          key: "id",
        },
      },
      userId: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: "Users",
          key: "id",
        },
      },
      comment: {
        allowNull: false,
        type: Sequelize.TEXT,
      },
      reviewed_at: {
        allowNull: false,
        type: Sequelize.DATE,
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
    await queryInterface.dropTable("Reviews");
  },
};
