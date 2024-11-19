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
const optGenerator = require('otp-generator');
const sendSMS = require('../services/smsService');

// Création d'un numéro principal
exports.createNumber = catchAsync(async (req, res, next) => {
  const { phoneNumber } = req.body;

  // if (!phoneNumber.startsWith('5')) {
  //   return next(new AppError(`Le numéro doit commencer par 5.`, 401));
  // }

  const existingNumber = await Number.findOne({ where: { phoneNumber } });
  if (existingNumber) {
    return next(new AppError(`Ce numéro est déjà enregistré.`, 400));
  }

  //const digits = '0123456789';
  const otp = optGenerator.generate(4, {
    digits: true, // Génère uniquement des chiffres
    specialChars: false, // Désactive les caractères spéciaux
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
  });
  console.log(`le code ${otp}`);
  const otpExpiresAt = new Date(Date.now() + 2 * 60 * 1000);

  const newNumber = await Number.create({
    phoneNumber,
    isVerified: false,
  });

  await UserNumber.create({
    numberId: newNumber.id,
    number: phoneNumber,
    otp,
    otpExpiresAt,
    otpVerified: false,
  });

  await sendSMS(
    phoneNumber,
    `Votre code pour la mise à jour de votre identification est : ${otp}. Il est personnel, ne le partagez à personne Ce code est valable 2 minutes.`
  );

  res.status(201).json({
    message: `Numéro enregistré et OTP envoyé.`,
    phoneNumber: newNumber.phoneNumber,
  });
});

// Vérification de l'OTP
exports.verifyOtp = catchAsync(async (req, res, next) => {
  const { phoneNumber, otp } = req.body;

  const userNumber = await UserNumber.findOne({
    where: { number: phoneNumber },
  });

  if (!userNumber) {
    return next(new AppError(`Numéro non trouvé.`, 404));
  }

  if (new Date() > userNumber.otpExpiresAt) {
    return next(
      new AppError(`Ce code a expiré. Veuillez générer un nouveau code.`)
    );
  }

  if (userNumber.otp !== otp) {
    return next(new AppError(`Code de confirmation incorrect.`, 401));
  }

  userNumber.otpVerified = true;
  userNumber.save();

  res.status(200).json({
    message: 'Votre code de confirmation a été vérifié avec succès.',
  });
});
// Ajout d'un numéro secondaire
exports.addNumber = catchAsync(async (req, res, next) => {
  const { id, phoneNumber } = req.body;

  // Trouver le numéro principal
  const primaryNumber = await Number.findByPk(id);
  console.log();
  if (!primaryNumber) {
    return next(new AppError(`Numéro principal non trouvé.`, 404));
  }

  console.log('primaryNum:', primaryNumber.id);
  // Vérifier le nombre de numéros secondaires
  const userNumbers = await UserNumber.findAll({
    where: { numberId: primaryNumber.id },
  });
  if (userNumbers.length >= 3) {
    return next(
      new AppError(
        `La loi autorise l'enregistrement de seulement trois numéros. Vous avez déjà atteint cette limite. Veuillez continuer avec l'identification`,
        401
      )
    );
  }

  // Valider le format du numéro
  const validateNumber = /^[5][0-9]{7}$/; // regex pour verifier que le num commence par 5 et contient 8 chiffres
  if (!validateNumber.test(phoneNumber)) {
    return next(
      new AppError(
        `Le numéro doit commencer par 5 et contenir exactement 8 chiffres.`
      )
    );
  }

  // Vérifier si le numéro existe déjà
  const existingNumber = await UserNumber.findOne({
    where: { number: phoneNumber, numberId: primaryNumber.id },
  });
  if (existingNumber) {
    return next(new AppError(`Ce numéro est déjà enregistré.`, 400));
  }

  // Générer un OTP
  const otp = optGenerator.generate(4, {
    digits: true, // Génère uniquement des chiffres
    specialChars: false, // Désactive les caractères spéciaux
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
  });
  const otpExpiresAt = new Date(Date.now() + 2 * 60 * 1000);

  // Ajouter le numéro secondaire
  await UserNumber.create({
    numberId: primaryNumber.id,
    number: phoneNumber,
    otp,
    otpExpiresAt,
    otpVerified: false,
  });

  // Envoyer un SMS contenant l'OTP
  try {
    await sendSMS(
      phoneNumber,
      `Votre code pour l'ajout de ce numéro est : ${otp}. Ce code est valable 2 minutes.`
    );
  } catch (error) {
    return next(
      new AppError(`Erreur lors de l'envoi du SMS : ${error.message}`, 500)
    );
  }

  // Répondre à la requête
  res.status(201).json({
    message: 'Numéro secondaire ajouté et OTP envoyé.',
  });
});

// Regénération d'un OTP
exports.regenerateOtp = catchAsync(async (req, res, next) => {
  const { phoneNumber } = req.body;

  const userNumber = await UserNumber.findOne({
    where: { number: phoneNumber },
  });

  if (!userNumber) {
    return res.status(404).json({ message: 'Numéro non trouvé.' });
  }

  const otp = optGenerator.generate(4, {
    digits: true, // Génère uniquement des chiffres
    specialChars: false, // Désactive les caractères spéciaux
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
  });
  const otpExpiresAt = new Date(Date.now() + 2 * 60 * 1000);

  userNumber.otp = otp;
  userNumber.otpExpiresAt = otpExpiresAt;
  await userNumber.save();

  await sendSMS(
    phoneNumber,
    `Votre code pour la mise à jour de votre identification est : ${otp}. Ce code est valable 2 minutes.`
  );

  res
    .status(200)
    .json({ message: 'Un nouveau code OTP a été généré et envoyé.' });
});
