const Admin = require("../models/Admin");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
    console.log(file);
  },
  fi: function (req, file, cb) {
    cb(null, file.origin);
  },
});

const upload = multer({ storage });

cloudinary.config({
  cloud_name: process.env.CLOUDNAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const handleImageUpload = async (imageFile) => {
  try {
    const result = await cloudinary.uploader.upload(imageFile.path, {
      width: 500,
      height: 500,
      crop: "scale",
    });
    return result.secure_url;
  } catch (error) {
    console.error(error);
    throw new Error("Error uploading image");
  }
};

const createJob = async (req, res) => {
  const {
    title, location, duration, description, category, company
  } = req.body;

  const logo = req.file; 

  if (!logo) {
    res.status(400).json({ error: "All image required" });
    return;
  }

  try {
    const logoUrl = await handleImageUpload(logo);
    const job = await Admin.create({
      title,
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
      location: job.location,
      description: job.description,
      category: job.category,
      duration: job.duration,
      company: job.company,
      logo: job.logo,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "An error occurred when creating the job" });
  }
};


const updateJob = async (req, res) => {
  const job = await Admin.findById(req.params.id);

  if (!job) {
    return res
      .status(404)
      .json({ message: "job does not exist" });
  } else {
    const {
      title, location, duration, description, category, company
    } = req.body;

    try {
      let logo = job.logo;

      if (req.file) {
        const result = await cloudinary.uploader.upload(
          req.file.path,
          {
            crop: "scale",
          }
        );
        logo = result.secure_url;
      }

      const updatedjob = await Admin.findByIdAndUpdate(
        req.params.id,
        {
          title, location, duration, description, category, company
        },
        { new: true }
      );

      res.status(200).json(updatedjob);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: "An error occurred while updating job" });
    }
  }
};

const getJob = async (req, res) => {
  try {
    const job = await Admin.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: "This job does not exist" });
    } else {
      res.status(200).json(job);
    }
  } catch (err) {
    console.log(err);
  }
};

const getJobCategory = async (req, res) => {
  const jobs = await Admin.find({
    category: decodeURIComponent(req.params.value),
  });
  if (!jobs) {
    return res.status(404).json({ message: "job does not exist" });
  } else {
    res.status(200).json(jobs);
  }
};

const getJobs = async (req, res) => {
  try {
    const jobs = await Admin.find({
      category: { $exists: true },
    });
    if (!jobs) {
      return res.status(404).json({ message: "jobs not found" });
    } else {
      res.status(200).json(jobs);
    }

    return;
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ error: "An error occurred when fetching jobs" });
  }
};

const deleteJob = async (req, res) => {
  try {
    const job = await Admin.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: "job not found" });
    }
    await Admin.findByIdAndDelete(req.params.id);
    res.status(200).json({ id: req.params.id, message: "job deleted" });
    return;
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  createJob,
  updateJob,
  getJob,
  getJobCategory,
  getJobs,
  deleteJob,
};