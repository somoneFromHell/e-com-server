const subCategory = require("../models/subCategory");

exports.getSubCategory = async (req, res, next) => {
  try {
    const recordExists = await subcategory.find({ deleted: false });
    if (recordExists.length === 0) {
      res.status(204).end();
    } else {
      res.status(200).send({ data: recordExists });
    }
  } catch (error) {
    console.error("Error while fetching Subcategories:", error);
    res.status(500).json({ error: { message: "Server error" } });
  }
};

exports.addNewSubCategory = async (req, res, next) => {
  try {
    const body = {
        category:req.body.category,
      name: req.body.name,
      description: req.body.description,
    };
    const subCategoryIsUnique =
      (await subcategory
        .find({ name: req.body.name, deleted: false })
        .count()) === 0;
    if (subCategoryIsUnique) {
      const newCategoryAdded = await subcategory.create(body);
      res.status(201).json({
        data: newCategoryAdded,
        message: "Subcategory added successfully",
      });
    } else {
      return res.status(400).json({
        error: { message: "Subcategory with the same name already exists" },
      });
    }
  } catch (error) {
    console.error("Error while fetching Subcategories:", error);
    res.status(500).json({ error: { message: "Server error" } });
  }
};

exports.getSubCategoryById = async (req, res, next) => {
    try {
        const recordExists = await subCategory.findById(req.params.id);
        if (!recordExists || recordExists.deleted)
          res
            .status(400)
            .json({ error: { message: "bad request | record not found" } });
    
        res.status(200).send({ data: recordExists });
      } catch (error) {
        res.status(400).json({ error: { message: error, code: error.code } });
      }
};

exports.updateSubCategory = async (req, res, next) => {
    try {
        const subCategoryId = req.params.id;
        const subCategoryToUpdate = await subCategory.findById(subCategoryId);
    
        if (!subCategoryToUpdate || subCategoryToUpdate.deleted) {
          return res.status(404).json({ error: { message: "Subcategory not found" } });
        }
    
        const updateData = {};
        // Check if any changes are made before updating the 'updatedAt' field.
        if (subCategoryToUpdate.name !== req.body.name) {
          updateData.name = req.body.name;
        }
        if (subCategoryToUpdate.description !== req.body.description) {
          updateData.description = req.body.description;
        }
    
        if (Object.keys(updateData).length === 0) {
          // No changes were made to the category data.
          return res
            .status(200)
            .json({ message: "No changes were made to the category" });
        }
        updateData.updatedAt = Date.now();
        await subCategory.findByIdAndUpdate(subCategoryId, updateData);
    
        // Fetch the updated category from the database.
        const updatedSubCategory = await category.findById(subCategoryId);
        res
          .status(200)
          .json({
            message: "Subcategory updated successfully",
            data: updatedSubCategory,
          });
      } catch (error) {
        res.status(500).json({ error: { message: error, code: error.code } });
      }
};

exports.deleteSubCategory = async (req, res, next) => {
    subCategory
    .findByIdAndUpdate(
      req.params.id,
      { deleted: true, deletedAt: Date.now() },
      { new: true }
    )
    .then((updateCategory) => {
      if (!updateCategory) {
        res.status(404).json({ error: { message: "record not Found" } });
      } else {
        res.status(204).end();
      }
    })
    .catch((error) => {
      console.error("Error while deleting  category", error);
      res.status(500).json({ error: { message: "Server error" } });
    });
};
