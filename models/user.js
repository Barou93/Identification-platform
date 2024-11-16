/** @format */

"use strict";
const { v4: uuidv4 } = require("uuid");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // define association here
      User.hasMany(models.Review, { foreignKey: "userId" });
    }
  }
  User.init(
    {
      id: {
        type: DataTypes.UUID, // UUID pour la clé primaire
        defaultValue: uuidv4, // Génération automatique d'un UUID
        allowNull: false,
        primaryKey: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
          isTelecelMali(value) {
            if (!value.endsWith("@telecelmali.com")) {
              throw new Error(
                "Only emails ending with '@telecelmali.com are allowed'"
              );
            }
          },
        },
      },
      password: DataTypes.STRING,
      roles: DataTypes.ENUM("rewier", "admin"),
      isAdmin: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
