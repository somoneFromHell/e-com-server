const userModel = require("../models/userModal");
const appError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync")


exports.getUser = catchAsync(async (req, res, next) => {

    const recordExists = await userModel.find({ isDeleted: false });
    if (recordExists.length === 0) {
      return res.status(204).end();

    } else {
     return res.status(200).send({ data: recordExists });
    }
})

exports.getUserById = catchAsync(async (req, res, next) => {

    const recordExists = await userModel.findById(req.params.id).populate('role');
    if (!recordExists || recordExists.isDeleted)
    next(new appError(`bad request | record not found`, 400))

    res.status(200).send({ data: recordExists });
  
})

exports.updateUser = async (req, res, next) => {
  try {
    const roleId = req.params.id;
    const roleToUpdate = await userModel.findById(roleId);

    if (!roleToUpdate || roleToUpdate.isDeleted) {
      return res.status(404).json({ error: { message: "User not found" } });
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
    await userModel.findByIdAndUpdate(roleId, updateData);

    // Fetch the updated role from the database.
    const updatedUser = await userModel.findById(roleId);
    res
      .status(200)
      .json({
        message: "User updated successfully",
        data: updatedUser,
      });
  } catch (error) {
    res.status(500).json({ error: { message: error, code: error.code } });
  }
};

exports.deleteUser = (req, res, next) => {
  userModel
    .findByIdAndUpdate(
      req.params.id,
      { deleted: true, deletedAt: Date.now() },
      { new: true }
    )
    .then((updateUser) => {
      if (!updateUser) {
        res.status(404).json({ error: { message: "record not Found" } });
      } else {
        res.status(204).end();
      }
    })
    .catch((error) => {
      console.error("Error while deleting  User", error);
      res.status(500).json({ error: { message: "Server error" } });
    });
};

exports.getAllIncDelUser = async (req, res, next) => {
  try {
    const recordExists = await userModel.find();
    if (recordExists.length === 0) {
      res.status(204).end();
    } else {
      res.status(200).send({ data: recordExists });
    }
  } catch (error) {
    console.error("Error while fetching role:", error);
    res.status(500).json({ error: { message: "Server error" } });
  }
};
