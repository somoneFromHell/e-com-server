const mongoose = require("mongoose");

const rightSchema = new mongoose.Schema({
  route: {
    type: String,
    required: true,
    
  },
  rights: {
    GET: Boolean,
    PUT: Boolean,
    POST: Boolean,
    DELETE: Boolean
  }
});

const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  rights: [rightSchema],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
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
