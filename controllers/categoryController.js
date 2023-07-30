const Category = require("../models/category");

exports.getCategory = async (req, res, next) => {
  try {
    const recordExists = await Category.find({ deleted: false });
    if (recordExists.length === 0) {
      res.status(204).end();
    } else {
      res.status(200).send({ data: recordExists });
    }
  } catch (error) {
    console.error("Error while fetching categories:", error);
    res.status(500).json({ error: { message: "Server error" } });
  }
};

exports.addNewCategory = async (req, res, next) => {
  try {
    const body = {
      name: req.body.name,
      description: req.body.description,
    };
    
    const CategoryIsUnique = (await Category.find({ name: req.body.name, deleted: false }).count()) === 0;
    if (CategoryIsUnique) {
      const newCategoryAdded = await Category.create(body);
      res
        .status(201)
        .json({
          data: newCategoryAdded,
          message: "Category added successfully",
        });
    } else {
      return res
        .status(400)
        .json({
          error: { message: "Category with the same name already exists" },
        });
    }
  } catch (error) {
    console.error("Error while fetching categories:", error);
    res.status(500).json({ error: { message: "Server error" } });
  }
};

exports.getCategoryById = async (req, res, next) => {
  try {
    const recordExists = await Category.findById(req.params.id);
    if (!recordExists || recordExists.deleted)
      res
        .status(400)
        .json({ error: { message: "bad request | record not found" } });

    res.status(200).send({ data: recordExists });
  } catch (error) {
    res.status(400).json({ error: { message: error, code: error.code } });
  }
};

exports.updateCategory = async (req, res, next) => {
  try {
    const categoryId = req.params.id;
    const categoryToUpdate = await Category.findById(categoryId);

    if (!categoryToUpdate || categoryToUpdate.deleted) {
      return res.status(404).json({ error: { message: "Category not found" } });
    }

    const updateData = {};
    // Check if any changes are made before updating the 'updatedAt' field.
    if (categoryToUpdate.name !== req.body.name) {
      updateData.name = req.body.name;
    }
    if (categoryToUpdate.description !== req.body.description) {
      updateData.description = req.body.description;
    }

    if (Object.keys(updateData).length === 0) {
      // No changes were made to the category data.
      return res
        .status(200)
        .json({ message: "No changes were made to the category" });
    }
    updateData.updatedAt = Date.now();
    await Category.findByIdAndUpdate(categoryId, updateData);

    // Fetch the updated category from the database.
    const updatedCategory = await Category.findById(categoryId);
    res
      .status(200)
      .json({
        message: "Category updated successfully",
        data: updatedCategory,
      });
  } catch (error) {
    res.status(500).json({ error: { message: error, code: error.code } });
  }
};

exports.deleteCategory = (req, res, next) => {
  Category
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
      console.error("Error while deleting  Category", error);
      res.status(500).json({ error: { message: "Server error" } });
    });
};

exports.getAllIncDelCategory = async (req, res, next) => {
  try {
    const recordExists = await Category.find();
    if (recordExists.length === 0) {
      res.status(204).end();
    } else {
      res.status(200).send({ data: recordExists });
    }
  } catch (error) {
    console.error("Error while fetching categories:", error);
    res.status(500).json({ error: { message: "Server error" } });
  }
};
