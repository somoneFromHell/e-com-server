const userModel = require("../models/userModal")
const roleModel = require("../models/roleModel")
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken');
const catchAsync = require('../utils/catchAsync')
const appError = require("../utils/appError")


module.exports.createUser = catchAsync(async(req,res,next) => {

       const {firstName,lastName,middleName,email,password,role} = req.body;
      const existingUser = await userModel.findOne({email:req.body.email});
      if (existingUser) {
        next(new appError(`'${req.body.email}' email already taken`, 400));

      }
      
      var getRole = await roleModel.findById(role)
      if(!getRole){
        next(new appError(`'${role}' role not found...`, 400));
      }
      const newUser = {
        firstName:firstName,
        middleName:middleName,
        lastName:lastName,
        email:email,
        password:password,
        role:role,
        profileImage:req.file.filename
      };
      
        const salt = await bcrypt.genSalt(10);
        newUser.password = await bcrypt.hash(password, salt)
    
        const savedUser = await userModel.create(newUser);
        res.status(201).json(savedUser);
      
})

module.exports.loginUser = catchAsync(async(req, res,next ) => {
    var {email,password} = new userModel(req.body);
    if (!email||!password) 
    next(new appError(`provide proper credentials`, 400));

    const user = await userModel.findOne({ email: req.body.email }).populate('role');
    if (!user) next(new appError(`incorrect credentials`, 400));


    const validPassword = bcrypt.compareSync(req.body.password,user.password)
    if (!validPassword) next(new appError(`incorrect credentials`, 400));

    const findRole = await roleModel.findById(user.role)
    if (!findRole)next(new appError(`role not found`, 500));

    const TokenData = {
      firstName : user.firstName,
      lastName : user.lastName,
      middleName : user.middleName,
      email:user.email,
      role:user.role.name,
      rights:user.role.rights

    }

    const token = jwt.sign({TokenData}, "jwtPrivateKey",{expiresIn:'1d'})
    res.header('Authorization',token).send({data:token})
})
