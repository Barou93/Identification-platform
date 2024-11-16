/** @format */

"use strict";
const { v4: uuidv4 } = require("uuid");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Review.belongsTo(models.IdentificationRequest, {
        foreignKey: "identificationId",
      });
      Review.belongsTo(models.User, {
        foreignKey: "userId",
      });
    }
  }
  Review.init(
    {
      id: {
        type: DataTypes.UUID, // UUID pour la clé primaire
        defaultValue: uuidv4, // Génération automatique d'un UUID
        allowNull: false,
        primaryKey: true,
      },
      identificationId: {
        type: DataTypes.UUID, // UUID pour la clé primaire
        defaultValue: uuidv4, // Génération automatique d'un UUID
        allowNull: false,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.UUID, // UUID pour la clé primaire
        defaultValue: uuidv4, // Génération automatique d'un UUID
        allowNull: false,
        primaryKey: true,
      },
      comment: DataTypes.TEXT,
      reviewedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Review",
    }
  );
  return Review;
};
