const express = require('express');
const {getRole,addNewRole,getRoleById,getAllIncDelRole,deleteRole} = require('../controllers/roleController') 
const router = express.Router();


router.get('/',getRole)
router.get('/all',getAllIncDelRole)
router.post('/',addNewRole)
router.get('/:id',getRoleById)
router.delete('/:id',deleteRole)


module.exports = router;