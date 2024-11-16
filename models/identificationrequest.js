/** @format */

"use strict";
const { v4: uuidv4 } = require("uuid");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class IdentificationRequest extends Model {
    static associate(models) {
      // define association here
      IdentificationRequest.belongsTo(
        models.Number({ foreignKey: "numberId" })
      );
      IdentificationRequest.hasMany(models.Review, {
        foreignKey: "identificationId",
      });
    }
  }
  IdentificationRequest.init(
    {
      id: {
        type: DataTypes.UUID, // UUID pour la clé primaire
        defaultValue: uuidv4, // Génération automatique d'un UUID
        allowNull: false,
        primaryKey: true,
      },
      numberId: {
        type: DataTypes.UUID, // UUID pour la clé primaire
        defaultValue: uuidv4, // Génération automatique d'un UUID
        allowNull: false,
        primaryKey: true,
      },
      documentType: DataTypes.ENUM(
        "Carte NINA",
        "Carte Biometrique",
        "Carte AMO",
        "Carte Electeur",
        "Recepisse NINA",
        "Passeport",
        "Fiche descriptive individuelle"
      ),
      document_url: DataTypes.STRING,
      status: DataTypes.ENUM("pedding", "approved", "reject"),
    },
    {
      sequelize,
      modelName: "IdentificationRequest",
    }
  );
  return IdentificationRequest;
};
