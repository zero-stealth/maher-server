const express = require('express');
const router = express.Router();
const multer = require('multer');
const { protect } = require('../middleware/authMiddleware');
const {
  createJob,
  getJob,
  getJobs,
  updateJob,
  getJobCategory,
  deleteJob,
} = require('../controllers/adminController');

// Multer configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

router.route('/jobs')
  .get(getJobs)
  .post(
    protect,
    upload.single('logo'),
    createJob
  );

router.route('/jobs/:id')
  .get(getJob)
  .put(
    protect,
    upload.single('logo'),
    updateJob
  )
  .delete(protect, deleteJob);

router.route('/jobs/category/:value')
  .get(getJobCategory);

module.exports = router;
