const express = require('express');
const {getRole,addNewRole,getRoleById,getAllIncDelRole} = require('../controllers/roleController') 
const router = express.Router();


router.get('/',getRole)
router.get('/all',getAllIncDelRole)
router.post('/',addNewRole)
router.get('/:id',getRoleById)
// router.put('/:id',categoryController.updateCategory)
// router.delete('/:id',categoryController.deleteCategory)


module.exports = router;