const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    location: {
      type: String,
    },
    duration: {
      type: String, 
    },
    description: {
      type: String,
    },
    logo: {
      type: String,
      required: true,
    },
    category: {
      type: String,
    },
    company: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;
