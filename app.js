/** @format */

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const globalErrorHandler = require('./controllers/error.controller');
const AppError = require('./utils/appError');
const session = require('express-session');
const xss = require('xss-clean');
const morgan = require('morgan');
const path = require('path');
const helmet = require('helmet');

const app = express();

const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const numberRoutes = require('./routes/number.routes');

app.enable('trust proxy');

app.use((req, res, next) => {
  if (
    req.url.includes('.env') ||
    (req.url.includes('.js') && req.url.startsWith('./server'))
  ) {
    return res.status(403).send('Access interdit');
  }
  next();
});

const { Sequelize } = require('sequelize');

const config = require('./config/config.json')[
  process.env.NODE_ENV || 'development'
];

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'fallbackSecret',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === 'production' }, //activated secure mode in production
  })
);

//Data sanitization against XSS
app.use(xss());

// Initialiser Sequelize
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

// Vérifier la connexion à la base de données
async function sequelizeDatabaseConnect() {
  const maxRetries = 5;
  let retries = 0;
  while (retries < maxRetries) {
    try {
      await sequelize.authenticate();
      console.log('Connexion à la base de données réussie.');
      break;
    } catch (error) {
      console.error('Erreur de connexion à la base de données :', error);
      retries += 1;
      console.log(
        `Nouvelle tentative dans 5 secondes... (Tentative ${retries}/${maxRetries})`
      );
      await new Promise((resolve) => setTimeout(resolve, 5000)); // Attendre 5 secondes
    }
  }
  if (retries === maxRetries) {
    console.log('Toutes les tentatives de connexion ont échoué.');
  }
}

sequelizeDatabaseConnect();

//Routes dependences

console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else if (process.env.NODE_ENV === 'production') {
  app.use(morgan('combined')); //Production format
}

// Set security HTTP headers
app.use(helmet());
app.use(
  cors({
    credentials: true,
  })
);
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();

  next();
});

//Routes
app.use('/api/v1/users', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/numbers', numberRoutes);

app.all('*', (req, res, next) => {
  next(
    new AppError(`Impossible de trouver ${req.originalUrl} sur ce serveur`, 404)
  );
});

app.use(globalErrorHandler);

module.exports = app;
