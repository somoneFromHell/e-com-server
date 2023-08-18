const userModel = require("../models/userModal")
const roleModel = require("../models/roleModel")
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken');

module.exports.createUser =  async(req,res,next) => {
    try {
       const {firstName,lastName,middleName,email,password,role} = req.body;
      const existingUser = await userModel.findOne({email:req.body.email});
      if (existingUser) {
        return res.status(400).json({ message: "email already taken" });
      }
      
      var getRole = await roleModel.findById(role)
      if(!getRole){
        return res.status(404).json({ message: "role not found..." });
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
      } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Error registering user" ,error:error});
      }
}

module.exports.loginUser = async (req, res,next ) => {
    var {email,password} = new userModel(req.body);
    if (!email||!password) return res.status(400).send("not enaugh data");

    const user = await userModel.findOne({ email: req.body.email }).populate('role');
    if (!user) return res.status(400).send({error:"incorrect email or password !!"});

    const validPassword = bcrypt.compareSync(req.body.password,user.password)
    if (!validPassword) return res.status(400).send({error:"incorrect email or password !!"});

    const findRole = await roleModel.findById(user.role)
    if (!findRole)return res.status(404).send("role not found !!");

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
}
