const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 15,
    unique: true,
  },
  middleName: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 15,
    unique: true,
  },
  lastName: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 15,
    unique: true,
  },
  profileImage: {
    type: String,
    minLength: 5,
    maxLength: 200,
  },
  role: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "roles",
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  recoveryEmail:{
    type: String,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minLength: 8,
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  deactivatedAt: {
    type: Date,
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
});

const userModel = mongoose.model("user", userSchema);

module.exports = userModel;
