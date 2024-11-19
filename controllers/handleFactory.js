const APIFeatures = require('../utils/appFeature');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const { Op } = require('sequelize');

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    let doc;
    const { id } = req.params;
    // const { name } = req.body;

    const ressourceId = parseInt(id, 10);

    // Vérifier si un cours avec ce nom existe déjà
    const foundByName = await Model.findOne({ where: { ...req.body } });
    // Si un cours avec cet ID ou ce nom existe déjà, renvoyer une erreur
    if (foundByName) {
      return next(
        new AppError(`Une ressource  existe déjà dans la database`, 400)
      );
    }
    const foreignKeys = Object.keys(Model.rawAttributes).filter(
      (key) => Model.rawAttributes[key].references
    );
    console.log(foreignKeys);
    let modelData = { ...req.body };

    if (req.originalUrl.includes(ressourceId)) {
      foreignKeys.forEach((key) => {
        if (req.originalUrl.includes(ressourceId)) {
          modelData[key] = ressourceId;
        }
      });
      doc = await Model.create(modelData);
    } else {
      doc = await Model.create(req.body);
    }

    res.status(201).json({
      status: 'success',
      data: {
        doc,
      },
    });
  });

exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    const queryOptions = {};

    Object.assign(queryOptions, req.query);
    console.log(queryOptions);

    const excludeFields = [
      'password',
      'passwordResetExpires',
      'passwordResetToken',
      'passwordChangedAt',
    ];
    const features = new APIFeatures(Model, queryOptions, {
      attributes: {
        exclude: excludeFields,
      },
    })
      .filter()
      .sort()
      .limitFields()
      .paginate();

    console.log('APIFeatures.queryOptions :', APIFeatures.queryOptions);

    const docs = await features.exec();

    if (!docs || docs.length === 0) {
      return next(new AppError('No documents found', 404));
    }
    //Option pour masquer les champs sensibles apres recuperation
    docs.forEach((doc) => {
      excludeFields.forEach((field) => {
        if (doc[field]) doc[field] = undefined; // Masquer les champs
      });
    });

    res.status(200).json({
      status: 'success',
      data: {
        docs,
        number: docs.length,
      },
    });
  });
exports.getOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByPk(req.params.id, {
      attributes: {
        exclude: [
          'password',
          'passwordResetExpires',
          'passwordResetToken',
          'passwordChangedAt',
        ],
      },
    });
    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        doc,
      },
    });
  });
exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.update(req.body, {
      where: {
        id: req.params.id,
      },
    });
    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: doc,
      },
      message: `Le doc a été modifiée avec success`,
    });
  });
exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.destroy({
      where: {
        id: {
          [Op.eq]: req.params.id,
        },
      },
    });
    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }
    res.status(204).json({
      status: 'success',
      data: null,
    });
  });
