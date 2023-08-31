const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 15,
  },
  middleName: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 15,
  },
  lastName: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 15,
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
  },
  recoveryEmail:{
    type: String,
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
  },
  resetToken:{
    type:String,
    default:""
  }
});

const userModel = mongoose.model("user", userSchema);

module.exports = userModel;
