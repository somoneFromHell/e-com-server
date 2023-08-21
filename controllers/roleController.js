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
  const { roleName, rights } = req.body;

  const roleNotExist = (await Role.countDocuments({ roleName: roleName, isDeleted: false })) === 0;
  console.log(`roleDoesntExist: ${roleNotExist}`);

  if (roleNotExist) {
    const newRole = new Role({ roleName, rights });
    const newRoleAdded = await Role.create(newRole);
    res.status(201).json({
      data: newRoleAdded,
      message: "Role added successfully",
    });
  } else {
    next(new appError(`Role '${roleName}' already exists`, 400));
  }
});


exports.getRoleById = catchAsync(async (req, res, next) => {

  const recordExists = await Role.findById(req.params.id);
  if (!recordExists || recordExists.isDeleted)
    next(new appError(`Role dosen't exist`, 400))

  res.status(200).send({ data: recordExists });

})

exports.updateRole = catchAsync(async (req, res, next) => {

  const roleToUpdate = await Role.findById(req.body._id);

  if (!roleToUpdate || roleToUpdate.isDeleted) {
    next(new appError(`Role dosen't exist`, 400))
  }

  const updateData = {};
  // Check if any changes are made before updating the 'updatedAt' field.
  if (roleToUpdate.roleName !== req.body.roleName) {
    updateData.roleName = req.body.roleName;
  }
  if (roleToUpdate.rights !== req.body.rights) {
    updateData.rights = req.body.rights;
  }

  if (Object.keys(updateData).length === 0) {
    // No changes were made to the role data.
    next(new appError(`No changes were made to the role`, 200))


  }
  updateData.updatedAt = Date.now();
  await Role.findByIdAndUpdate(req.body._id, updateData);

  // Fetch the updated role from the database.
  const updatedRole = await Role.findById(req.body._id);
  res
    .status(200)
    .json({
      message: "Role updated successfully",
      data: updatedRole,
    });

})

exports.deleteRole = catchAsync(async (req, res, next) => {
    const updateRole = await Role.findByIdAndUpdate(
      req.params.id,
      { isDeleted: true, deletedAt: Date.now() },
      { new: true }
    );
    if (!updateRole) {
      return next(new appError(`Role doesn't exist`, 400));
    }
    res.status(204).end();
})

exports.getAllIncDelRole = catchAsync(async (req, res, next) => {

  const recordExists = await Role.find();
  if (recordExists.length === 0) {
    res.status(204).end();
  } else {
    res.status(200).send({ data: recordExists });
  }

})
