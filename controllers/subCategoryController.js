const subCategory = require("../models/subCategory");
const category = require("../models/category");
const ObjectId = require('mongodb').ObjectId;


exports.getSubCategory = async (req, res, next) => {
  try {
    const recordExists = await subCategory.aggregate([
      {
        $match: { deleted: false },
      },
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "categoryInfo",
        },
      },
      {
        $unwind: "$categoryInfo",
      },
      {
        $project: {
          _id: 1,
          name: 1,
          category: "$categoryInfo.name",
        },
      },
    ]);
    if (recordExists.length === 0) {
      return res.status(204).end();
    } else {
      return res.status(200).send({ data: recordExists });
    }
  } catch (error) {
    console.error("Error while fetching Subcategories:", error);
    return res.status(500).json({ error: { message: "Server error" } });
  }
};

exports.addNewSubCategory = async (req, res, next) => {
  try {
    const body = {
      category: req.body.category,
      name: req.body.name,
      description: req.body.description,
    };

    const categoryExists = await category.findById(req.body.category);

    if (!categoryExists || categoryExists.deleted) {
      return res
        .status(400)
        .json({ error: { message: "bad request | category does not exist" } });
    }
    const subCategoryIsUnique =
      (await subCategory
        .find({ name: req.body.name, deleted: false })
        .count()) === 0;
    if (subCategoryIsUnique) {
      const newCategoryAdded = await subCategory.create(body);
      return res.status(201).json({
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
    return res.status(500).json({ error: { message: "Server error" } });
  }
};

exports.getSubCategoryById = async (req, res, next) => {
  try {
    const recordExists = await subCategory.aggregate([
      {
        $match: {
          _id: new ObjectId(req.params.id)
        }
      },
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "categoryInfo",
        },
      },
      {
        $unwind: "$categoryInfo",
      },
      {
        $project: {
          _id: 1,
          name: 1,
          category:1,
          categoryName: "$categoryInfo.name",
        },
      }
    ]);
    if (!recordExists || recordExists.deleted)
      return res
        .status(400)
        .json({ error: { message: "bad request | record not found" } });

    return res.status(200).send({ data: recordExists });
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ error: { message: error, code: error.code } });
  }
};

exports.updateSubCategory = async (req, res, next) => {
  try {
    const subCategoryId = req.params.id;
    const subCategoryToUpdate = await subCategory.findById(subCategoryId);

    if (!subCategoryToUpdate || subCategoryToUpdate.deleted) {
      return res
        .status(404)
        .json({ error: { message: "Subcategory not found" } });
    }

    const updateData = {};
    // Check if any changes are made before updating the 'updatedAt' field.
    if (subCategoryToUpdate.name !== req.body.name) {
      updateData.name = req.body.name;
    }
    if (subCategoryToUpdate.category !== req.body.category) {
      const categoryExist = await category.findById(
        subCategoryToUpdate.category
      );
      if (categoryExist) {
        updateData.category = req.body.category;
      } else {
        return res
          .status(404)
          .json({ error: { message: "category not found" } });
      }
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
    const updatedSubCategory = await subCategory.findById(subCategoryId);
    return res.status(200).json({
      message: "Subcategory updated successfully",
      data: updatedSubCategory,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: { message: error, code: error.code } });
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
        return res.status(404).json({ error: { message: "record not Found" } });
      } else {
        return res.status(204).end();
      }
    })
    .catch((error) => {
      console.error("Error while deleting  category", error);
      return res.status(500).json({ error: { message: "Server error" } });
    });
};
