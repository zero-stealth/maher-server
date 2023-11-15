const express = require('express');
const router = express.Router();

const {
  loginUser,
  registerUser,
  registerAdmin,
  getCredentials,
  getUsers,
  deleteUser,
  reset,
  updateUser,
  getUser
} = require('../controllers/authController');

const { protect } = require('../middleware/authMiddleware');

// Routes
router.route('/').get(protect, getUsers);
router.route('/:id').get(protect, getUser);
router.route('/credentials').get(protect, getCredentials);
router.route('/register').post(registerUser);
router.route('/register-admin').post(registerAdmin);
router.route('/login').post(loginUser);
router.route('/update/:id').put(updateUser);
router.route('/reset').put(reset);
router.route('/delete/:id').delete(protect, deleteUser);

module.exports = router;
