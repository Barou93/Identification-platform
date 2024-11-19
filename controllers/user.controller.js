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
const User = models.User;
const allowedFields = require('../libs/allowFields');
const factory = require('./handleFactory');

exports.getUsers = catchAsync(async (req, res, next) => {
  console.log('userId :', req.user.id);
  const allUsers = await User.findAll({
    attributes: {
      exclude: [
        'password',
        'twoFactorSecret',
        'passwordResetExpires',
        'passwordResetToken',
        'passwordChangedAt',
      ],
    },
  });
  res.status(200).json({
    status: 'success',
    message: 'Tous les utilisateurs',
    data: allUsers,
  });
});
exports.getUser = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  // Trouver l'utilisateur dont on veut afficher le profil
  const user = await User.findByPk(id, {
    attributes: {
      exclude: [
        'password',
        'twoFactorSecret',
        'passwordResetExpires',
        'passwordResetToken',
        'passwordChangedAt',
      ],
    },
  });

  // Vérifier si l'utilisateur dont on veut afficher le profil est un admin
  if (user.isAdmin) {
    // Si l'utilisateur est admin, vérifier que celui qui fait la requête est aussi admin
    if (!req.user || !req.user.isAdmin) {
      return res.status(403).json({
        status: 'fail',
        message:
          'Accès refusé. Vous devez être administrateur pour voir ce profil.',
      });
    }
  }

  // Retourner l'utilisateur et son profil si trouvé
  return res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});
exports.readUser = factory.getOne(User);
exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.updateMe = catchAsync(async (req, res, next) => {
  //1) Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        "This route isn't for password updates. Please user /updateMyPassword"
      )
    );
  }
  //2) Filtered out unwanted fields names that are note allowed to be updated
  const fields = ['email'];

  req.body = allowedFields(req.body, fields);
  console.log(req.body);
  //3) update user document

  const [_, updateUser] = await User.update(req.body, {
    where: { id: req.user.id },
    returning: true,
    plain: true,
  });
  res.status(200).json({
    status: 'success',
    data: {
      user: updateUser,
    },
  });
});
exports.updateUser = catchAsync(async (req, res, next) => {
  // 1) Vérifiez si l'utilisateur est un administrateur
  if (!req.user.isAdmin) {
    return next(
      new AppError(
        "Vous n'avez pas l'autorisation de modifier les informations des utilisateurs.",
        403
      )
    );
  }

  // 2) Vérifiez que l'email est dans la requête
  const { email } = req.body;

  if (!email) {
    return next(
      new AppError('Vous devez fournir un email à mettre à jour.', 400)
    );
  }

  // 3) Mettez à jour l'utilisateur
  const rowsUpdated = await User.update(
    { email },
    { where: { id: req.params.id } }
  );

  // 4) Vérifiez si l'utilisateur à modifier existe
  if (rowsUpdated[0] === 0) {
    return next(new AppError('Aucun utilisateur trouvé avec cet ID.', 404));
  }

  // 5) Récupérez l'utilisateur mis à jour
  const updatedUser = await User.findByPk(req.params.id, {
    attributes: {
      exclude: [
        'password',
        'twoFactorSecret',
        'passwordResetExpires',
        'passwordResetToken',
        'passwordChangedAt',
      ],
    },
  });

  // 6) Réponse
  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findByPk(id);
  //console.log('user', user.id);

  await user.destroy({
    where: {
      id: user.id,
    },
  });
  res.status(204).json({
    status: 'success',
    data: null,
  });
});
