const Role = require("../models/roleModel");
const appError = require("../utils/appError")
const catchAsync = require('../utils/catchAsync')


exports.getRole = catchAsync(async (req, res, next) => {

  const recordExists = await Role.find({ isDeleted: false });
  if (recordExists.length === 0) {
    res.status(204).end();
  } else {
    res.status(200).send({ data: recordExists });
  }

})

exports.addNewRole = catchAsync(async (req, res, next) => {

  const { role, rights } = req.body
  console.log(req.body)

  const roleExists = (await Role.find({ role: role, deleted: false }).count()) === 0;
  const newRole = new Role({ role, rights })
  if (!roleExists) {
    const newRoleAdded = await Role.create(newRole);
    res
      .status(201)
      .json({
        data: newRoleAdded,
        message: "Role added successfully",
      });
  } else {
    next(new appError(`Role '${role}' alrady exist`, 400))
  }

})

exports.getRoleById = catchAsync(async (req, res, next) => {

  const recordExists = await Role.findById(req.params.id);
  if (!recordExists || recordExists.deleted)
    next(new appError(`Role dosen't exist`,400))

  res.status(200).send({ data: recordExists });

})

exports.updateRole = catchAsync(async (req, res, next) => {

  const roleId = req.params.id;
  const roleToUpdate = await Role.findById(roleId);

  if (!roleToUpdate || roleToUpdate.deleted) {
    next(new appError(`Role dosen't exist`,400))
  }

  const updateData = {};
  // Check if any changes are made before updating the 'updatedAt' field.
  if (roleToUpdate.name !== req.body.name) {
    updateData.name = req.body.name;
  }
  if (roleToUpdate.description !== req.body.description) {
    updateData.description = req.body.description;
  }

  if (Object.keys(updateData).length === 0) {
    // No changes were made to the role data.
    return res
      .status(200)
      .json({ message: "No changes were made to the role" });
  }
  updateData.updatedAt = Date.now();
  await Role.findByIdAndUpdate(roleId, updateData);

  // Fetch the updated role from the database.
  const updatedRole = await Role.findById(roleId);
  res
    .status(200)
    .json({
      message: "Role updated successfully",
      data: updatedRole,
    });

})

exports.deleteRole = catchAsync((req, res, next) => {
  Role
    .findByIdAndUpdate(
      req.params.id,
      { deleted: true, deletedAt: Date.now() },
      { new: true }
    )
    .then((updateRole) => {
      if (!updateRole) {
    next(new appError(`Role dosen't exist`,400))
        
        
      } else {
        res.status(204).end();
      }
    })
})

exports.getAllIncDelRole = catchAsync(async (req, res, next) => {

  const recordExists = await Role.find();
  if (recordExists.length === 0) {
    res.status(204).end();
  } else {
    res.status(200).send({ data: recordExists });
  }

})
