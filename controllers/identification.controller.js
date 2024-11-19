/**
 * @format
 * @param
 * @param {string}
 * @param {void}
 * @param {number}
 */

const models = require('../models');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const Number = models.Number;
const UserNumber = models.UserNumber;
const allowedFields = require('../libs/allowFields');
const factory = require('./handleFactory');

/** numberId: {
        type: DataTypes.UUID, // UUID pour la clé primaire
        defaultValue: uuidv4, // Génération automatique d'un UUID
        allowNull: false,
      },
      documentType: DataTypes.ENUM(
        'Carte NINA',
        'Carte Biometrique',
        'Carte AMO',
        'Carte Electeur',
        'Recepisse NINA',
        'Passeport',
        'Fiche descriptive individuelle'
      ),
      document_url: DataTypes.STRING,
      status: DataTypes.ENUM('pedding', 'approved', 'reject'), */

exports.submitDocument = catchAsync(async (req, res, next) => {
  const { numberId, documentType, document_url, status } = req.body;
});
