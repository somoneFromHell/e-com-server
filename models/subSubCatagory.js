const mongoose = require('mongoose');
const subCatagory = require('../models/subCatagory');

const subCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  subCatagory:{
    type:mongoose.Schema.Types.ObjectId,
    ref:subCatagory,
    required:true
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  deleted: {
    type: Boolean,
    default: false,
  },
  active: {
    type: Boolean,
    default: true,
  },
  updatedAt: {
    type: Date,
  },
});

const subCategory = mongoose.model('sub_sub_Category', subCategorySchema);

module.exports = subCategory;
