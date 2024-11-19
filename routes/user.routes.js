const router = require('express').Router();

const userController = require('../controllers/user.controller');

const authMiddleware = require('../middleware/auth.middleware');

router.use(authMiddleware.protect);
router.get('/me', userController.getMe, userController.getUser);
router.patch('/updateMe', userController.updateMe);

router.use(authMiddleware.restricTo('admin'));
router.get('/all', userController.getUsers);
router.patch('/updateUser/:id', userController.updateUser);
router.get('/:id', userController.getUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;
