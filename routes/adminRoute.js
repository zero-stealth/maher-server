const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const {
  createJob,
  getJob,
  updateJob,
  getJobInCategory,
  deleteJob,
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');

router.route('/job')
  .get(getJob)
  .post(
    protect,
    upload.single('logo'), 
    createJob
  );

router.route('/job/:id')
  .get(getJob)
  .put(
    protect,
    upload.single('logo'), 
    updateJob
  )
  .delete(protect, deleteJob);

router.route('/job/category/:value')
  .get(getJobInCategory);

module.exports = router;
