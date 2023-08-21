const Category = require("../models/category");
const appError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync")

exports.getCategory = catchAsync(async (req, res, next) => {

  const recordExists = await Category.find({ deleted: false });
  if (recordExists.length === 0) {
    res.status(204).end();
  } else {
    res.status(200).send({ data: recordExists });
  }

})

exports.addNewCategory = catchAsync(async (req, res, next) => {

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
    next(new appError(`category with name '${body.name}' alrady exist in categories`, 400))
  }

})

exports.getCategoryById = catchAsync(async (req, res, next) => {
  const recordExists = await Category.findById(req.params.id);
  if (!recordExists || recordExists.deleted) {
    next(new appError(`category not found`, 400))
  } else {
    res.status(200).send({ data: recordExists });
  }
})

exports.updateCategory = catchAsync(async (req, res, next) => {
  const categoryId = req.params.id;
  const categoryToUpdate = await Category.findById(categoryId);

  if (!categoryToUpdate || categoryToUpdate.deleted) {
    next(new appError(`category not found`, 400))
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
    next(new appError(`No changes were made to the category data`, 400))
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

})

exports.deleteCategory = catchAsync((req, res, next) => {
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
})

exports.getAllIncDelCategory = catchAsync(async (req, res, next) => {
  const recordExists = await Category.find();
  if (recordExists.length === 0) {
    res.status(204).end();
  } else {
    res.status(200).send({ data: recordExists });
  }
})
