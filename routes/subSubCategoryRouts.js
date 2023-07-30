const express = require('express');
const ssCategoryController = require('../controllers/subSubCategoryController') 
const router = express.Router();


router.get('/',ssCategoryController.getSubSubCategory)
router.post('/',ssCategoryController.addNewSubSubCategory)


module.exports = router;