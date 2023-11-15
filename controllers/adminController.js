const Admin = require('../models/Admin');
const asyncHandler = require('express-async-handler');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDNAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Helper function to handle image upload
const handleImageUpload = async (imageFile) => {
  try {
    const result = await cloudinary.uploader.upload(imageFile.path, {
      width: 500,
      height: 500,
      crop: 'scale',
    });
    return result.secure_url;
  } catch (error) {
    console.error(error);
    throw new Error('Error uploading image');
  }
};

// Admin-related functions
const createJob = asyncHandler(async (req, res) => {
  const { title, name, location, duration, description, category, company } = req.body;
  const logo = req.files['logo'][0];

  if (!logo) {
    res.status(400).json({ error: 'All image files are required' });
    return;
  }

  try {
    const logoUrl = await handleImageUpload(logo);

    const job = await Admin.create({
      title,
      name,
      location,
      duration,
      description,
      category,
      company,
      logo: logoUrl,
    });

    res.status(201).json({
      _id: job._id,
      title: job.title,
      name: job.name,
      location: job.location,
      description: job.description,
      category: job.category,
      duration: job.duration,
      company: job.company,
      logo: job.logo,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'An error occurred when creating job' });
  }
});

const getJob = asyncHandler(async (req, res) => {
  try {
    const job = await Admin.findById(req.params.id);
    if (!job) {
      res.status(400).json({ error: 'This job does not exist' });
    } else {
      res.status(200).json(job);
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'An error occurred when retrieving job' });
  }
});

const updateJob = asyncHandler(async (req, res) => {
  const job = await Admin.findById(req.params.id);

  if (!job) {
    res.status(400).json({ error: 'The job you tried to update does not exist' });
    return;
  }

  const { title, name, location, duration, description, category, company } = req.body;

  try {
    let logo = job.logo;

    if (req.files['logo']) {
      const result = await cloudinary.uploader.upload(req.files['logo'][0].path, {
        width: 500,
        height: 500,
        crop: 'scale',
      });

      logo = result.secure_url;
    }

    const updatedJob = await Admin.findByIdAndUpdate(
      req.params.id,
      {
        title,
        name,
        location,
        duration,
        description,
        category,
        company,
        logo,
      },
      { new: true }
    );

    res.status(200).json(updatedJob);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred when updating the job' });
  }
});

const getJobInCategory = asyncHandler(async (req, res) => {
  try {
    const jobs = await Admin.find({ category: decodeURIComponent(req.params.value) });
    res.status(200).json(jobs);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'An error occurred when retrieving jobs in category' });
  }
});

const deleteJob = asyncHandler(async (req, res) => {
  try {
    const job = await Admin.findById(req.params.id);
    if (!job) {
      res.status(404).json({ error: 'Job not found' });
      return;
    }

    await Admin.findByIdAndDelete(req.params.id);
    res.status(200).json({ id: req.params.id, message: 'Job deleted' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'An error occurred when deleting the job' });
  }
});

module.exports = {
  createJob,
  getJob,
  updateJob,
  getJobInCategory,
  deleteJob,
};
