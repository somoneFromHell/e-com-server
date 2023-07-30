const express = require('express');
const subCategoryController = require('../controllers/subCategoryController') 
const router = express.Router();


router.get('/',subCategoryController.getSubCategory)
router.post('/',subCategoryController.addNewSubCategory)
router.get('/:id',subCategoryController.getSubCategoryById)
router.put('/:id',subCategoryController.updateSubCategory)
router.delete('/:id',subCategoryController.deleteSubCategory)


module.exports = router;