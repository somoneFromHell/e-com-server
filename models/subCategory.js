const mongoose = require('mongoose');
const category = require('../models/category')

const subCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  category:{
    type:mongoose.Schema.Types.ObjectId,
    ref:category,
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

const subCategory = mongoose.model('sub_categories', subCategorySchema);

module.exports = subCategory;
