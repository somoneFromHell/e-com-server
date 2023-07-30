const express = require('express');
const categoryController = require('../controllers/categoryController') 
const router = express.Router();


router.get('/',categoryController.getCategory)
router.get('/all',categoryController.getAllIncDelCategory)
router.post('/',categoryController.addNewCategory)
router.get('/:id',categoryController.getCategoryById)
router.put('/:id',categoryController.updateCategory)
router.delete('/:id',categoryController.deleteCategory)


module.exports = router;