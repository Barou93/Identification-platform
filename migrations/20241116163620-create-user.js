/** @format */

"use strict";
const { v4: uuidv4 } = require("uuid");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Users", {
      id: {
        allowNull: false,

        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: uuidv4,
      },
      email: {
        allowNull: false,
        type: Sequelize.STRING,
        unique: true,
        validate: {
          isEmail: true, // Basic email validation
        },
      },
      password: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      roles: {
        allowNull: false,
        type: Sequelize.ENUM("reviewer", "admin"),
        defaultValue: "reviewer",
      },
      isAdmin: {
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
    //Add constrants for specifics email
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Users");
  },
};
