const express = require('express');
const catagoryController = require('../controllers/catagoryController') 
const router = express.Router();


router.get('/',catagoryController.getCatagory)
router.get('/all',catagoryController.getAllIncDelCatagory)
router.post('/',catagoryController.addNewCatagory)
router.get('/:id',catagoryController.getCatagoryById)
router.put('/:id',catagoryController.updateCatagory)
router.delete('/:id',catagoryController.deleteCatagory)


module.exports = router;