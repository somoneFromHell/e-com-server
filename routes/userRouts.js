const express = require('express');
const {getUser,getUserById,updateUser,deleteUser,getAllIncDelUser} = require('../controllers/userController') 
const router = express.Router();


router.get('/',getUser)
router.get('/all',getAllIncDelUser)
router.get('/:id',getUserById)
router.put('/:id',updateUser)
router.delete('/:id',deleteUser)


module.exports = router;