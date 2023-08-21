const mongoose = require("mongoose");

const rightSchema = new mongoose.Schema({
  route: {
    type: String,
    required: true,
    
  },
  requestRights: {
    GET: Boolean,
    PUT: Boolean,
    POST: Boolean,
    DELETE: Boolean
  }
});

const roleSchema = new mongoose.Schema({
  roleName: {
    type: String,
    required: true,
  },
  rights: [rightSchema],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date
  },
  deletedAt:{
    type: Date
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

const Role = mongoose.model("roles", roleSchema);

module.exports = Role;
