const express = require('express');
const router = express.Router();

const {
  register,
  login,
  updateUser,
  reset,
  getCredentials,
  getUsers,
  getUser,
  deleteUser,
  setPassword,
} = require('../controllers/authController');

const { protect } = require('../middleware/authMiddleware');

// Routes
router.route('/').get(protect, getUsers);
router.route('/:id').get(protect, getUser);
router.route('/credentials').get(protect, getCredentials);
router.route('/register').post(register);
router.route('/login').post(login);
router.route('/update/:id').put(updateUser);
router.route('/reset').post(reset);
router.route('/reset-password').post(setPassword);
router.route('/delete/:id').delete(protect, deleteUser);

module.exports = router;
