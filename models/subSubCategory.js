const mongoose = require('mongoose');
const subCategory = require('../models/subCategory');

const subCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  subCategory:{
    type:mongoose.Schema.Types.ObjectId,
    ref:subCategory,
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

const sbsubCategory = mongoose.model('sub_sub_Category', subCategorySchema);

module.exports = sbsubCategory;
