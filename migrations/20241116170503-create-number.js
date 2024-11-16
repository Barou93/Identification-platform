/** @format */

"use strict";
/** @type {import('sequelize-cli').Migration} */
const { v4: uuidv4 } = require("uuid");
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Numbers", {
      id: {
        allowNull: false,
        primaryKey: true,

        type: Sequelize.UUID, // Utilisation du type UUID pour l'ID primaire
        defaultValue: uuidv4,
      },
      phoneNumber: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      otp: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      otpVerified: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
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
    await queryInterface.dropTable("Numbers");
  },
};
