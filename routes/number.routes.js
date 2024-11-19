const router = require('express').Router();

const numberController = require('../controllers/number.controller');

//const authMiddleware = require('../middleware/auth.middleware');

router.post('/new', numberController.createNumber);
router.post('/verifyOTP', numberController.verifyOtp);
router.post('/regenerateOTP', numberController.regenerateOtp);
router.post('/addNumber', numberController.addNumber);

module.exports = router;
