const express = require('express');
const subCatagoryController = require('../controllers/subCatagoryController') 
const router = express.Router();


router.get('/',subCatagoryController.getSubCatagory)
router.post('/',subCatagoryController.addNewSubCatagory)
router.get('/:id',subCatagoryController.getSubCatagoryById)
router.put('/:id',subCatagoryController.updateSubCatagory)
router.delete('/:id',subCatagoryController.deleteSubCatagory)


module.exports = router;