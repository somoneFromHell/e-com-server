const express = require('express');
const ssCatagoryController = require('../controllers/subSubCatagoryController') 
const router = express.Router();


router.get('/',ssCatagoryController.getSubSubCatagory)
router.post('/',ssCatagoryController.addNewSubSubCatagory)


module.exports = router;