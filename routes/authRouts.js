const express = require('express');
const {createUser,loginUser} = require('../controllers/authController') 
const router = express.Router();



router.post('/auth/register',createUser)
router.post('/auth/login',loginUser)



module.exports = router;