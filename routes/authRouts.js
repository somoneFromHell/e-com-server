const express = require('express');
const {createUser,loginUser,forgetPassword,resetPassword,editProfile,changePassword} = require('../controllers/authController') 
const router = express.Router();
const multer = require("multer");


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images/');
    },
    filename: (req, file, cb) => {
      const originalFileName = file.originalname;
      const extension = originalFileName.split('.').pop();
      const newFileName = `${Date.now()}_User_Profile.${extension}`;
      cb(null, newFileName);
    }
});

const imageFileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed.'));
    }
  };

const upload = multer({ storage: storage,fileFilter: imageFileFilter });

router.post('/register',upload.single("profileImage"),createUser)
router.post('/login',loginUser)
router.post('/forget-password',forgetPassword)
router.post('/reset-password',resetPassword)
router.put('/edit-profile',editProfile)
router.put('/change-password',changePassword)



module.exports = router;