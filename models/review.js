/** @format */

'use strict';
const { v4: uuidv4 } = require('uuid');
const { Model } = require('sequelize');
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
        foreignKey: 'identificationId',
      });
      Review.belongsTo(models.User, {
        foreignKey: 'userId',
      });
    }
  }
  Review.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: uuidv4,
        allowNull: false,
        primaryKey: true,
      },
      identificationId: {
        type: DataTypes.UUID,
        defaultValue: uuidv4,
        allowNull: false,
      },
      userId: {
        type: DataTypes.UUID,
        defaultValue: uuidv4,
        allowNull: false,
      },
      comment: DataTypes.TEXT,
      reviewedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: 'Review',
    }
  );
  return Review;
};
