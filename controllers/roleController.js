const Role = require("../models/roleModel");

exports.getRole = async (req, res, next) => {
  try {
   
    const recordExists = await Role.find({ isDeleted: false });
    if (recordExists.length === 0) {
      res.status(204).send({message:"no data"});
    } else {
      res.status(200).send({ data: recordExists });
    }
  } catch (error) {
      console.error("Error while fetching role:", error);
      res.status(500).json({ error: { message: "Server error" } });
  }
};

exports.addNewRole = async (req, res, next) => {
  try {
    const {name,rights} = req.body
    
    const roleExists = (await Role.find({ name: name, deleted: false }).count()) === 0;
    const newRole = new Role({name,rights})
    if (roleExists) {
      const newRoleAdded = await Role.create(newRole);
      res
        .status(201)
        .json({
          data: newRoleAdded,
          message: "Role added successfully",
        });
    } else {
      return res
        .status(400)
        .json({
          error: { message: "Role with the same name already exists" },
        });
    }
  } catch (error) {
    console.error("Error while fetching role:", error);
    res.status(500).json({ error: { message: "Server error" } });
  }
};

exports.getRoleById = async (req, res, next) => {
  try {
    const recordExists = await Role.findById(req.params.id);
    if (!recordExists || recordExists.deleted)
      res
        .status(400)
        .json({ error: { message: "bad request | record not found" } });

    res.status(200).send({ data: recordExists });
  } catch (error) {
    res.status(400).json({ error: { message: error, code: error.code } });
  }
};

exports.updateRole = async (req, res, next) => {
  try {
    const roleId = req.params.id;
    const roleToUpdate = await Role.findById(roleId);

    if (!roleToUpdate || roleToUpdate.deleted) {
      return res.status(404).json({ error: { message: "Role not found" } });
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
  } catch (error) {
    res.status(500).json({ error: { message: error, code: error.code } });
  }
};

exports.deleteRole = (req, res, next) => {
  Role
    .findByIdAndUpdate(
      req.params.id,
      { deleted: true, deletedAt: Date.now() },
      { new: true }
    )
    .then((updateRole) => {
      if (!updateRole) {
        res.status(404).json({ error: { message: "record not Found" } });
      } else {
        res.status(204).end();
      }
    })
    .catch((error) => {
      console.error("Error while deleting  Role", error);
      res.status(500).json({ error: { message: "Server error" } });
    });
};

exports.getAllIncDelRole = async (req, res, next) => {
  try {
    const recordExists = await Role.find();
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
