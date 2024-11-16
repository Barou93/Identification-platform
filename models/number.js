/** @format */

"use strict";
const { v4: uuidv4 } = require("uuid");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Number extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Number.hasMany(models.IdentificationRequest, { foreignKey: "numberId" });
    }
  }
  Number.init(
    {
      id: {
        type: DataTypes.UUID, // UUID pour la clé primaire
        defaultValue: uuidv4, // Génération automatique d'un UUID
        allowNull: false,
        primaryKey: true,
      },
      phoneNumber: DataTypes.STRING,
      otp: DataTypes.STRING,
      otpVerified: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Number",
    }
  );
  return Number;
};
