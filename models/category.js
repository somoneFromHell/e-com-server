const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3, 
    maxlength: 20,
  },
  description: {
    type: String,
    required: true,
    minlength: 10, 
    maxlength: 200,
  },
  image: {
    type: String,
  },
  deleted: {
    type: Boolean,
    default: false,
  },
  active: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
  },
  deletedAt:{
    type:Date,
  }
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
