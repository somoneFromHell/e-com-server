const userModel = require("../models/userModal");
const roleModel = require("../models/roleModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const catchAsync = require("../utils/catchAsync");
const appError = require("../utils/appError");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const { v4: uuidv4 } = require('uuid');



var transporter = nodemailer.createTransport({
  host: "http://smtp-mail.outlook.com/",
  port: 587,
  auth: {
    user: "avasfdsansokln234@outlook.com",
    pass: "98cKe9dG95CjCJq"
  }
});

const secretKey = "secret-key"

module.exports.createUser = catchAsync(async (req, res, next) => {
  const { firstName, lastName, middleName, email, password, role } = req.body;
  const existingUser = await userModel.findOne({ email: req.body.email });
  if (existingUser) {
    next(new appError(`'${req.body.email}' email already taken`, 400));
  }

  var getRole = await roleModel.findById(role);
  if (!getRole) {
    next(new appError(`'${role}' role not found...`, 400));
  }
  const newUser = {
    firstName: firstName,
    middleName: middleName,
    lastName: lastName,
    email: email,
    password: password,
    role: role,
    profileImage: req.file.filename,
  };

  const salt = await bcrypt.genSalt(10);
  newUser.password = await bcrypt.hash(password, salt);

  const savedUser = await userModel.create(newUser);
  res.status(201).json(savedUser);
});

module.exports.loginUser = catchAsync(async (req, res, next) => {
  var { email, password } = new userModel(req.body);
  if (!email || !password)
    next(new appError(`provide proper credentials`, 400));

  const user = await userModel.findOne({ email: req.body.email });
  if (!user) next(new appError(`incorrect credentials`, 400));

  const validPassword = bcrypt.compareSync(req.body.password, user.password);
  if (!validPassword) next(new appError(`incorrect credentials`, 400));

  const findRole = await roleModel.findById(user.role);
  if (!findRole) next(new appError(`role not found`, 500));

  const token = jwt.sign({ userId: user._id }, "jwtPrivateKey", {
    expiresIn: "1d",
  });
  res.header("Authorization", token).send({ data: token });
});

module.exports.forgetPassword = catchAsync(async (req, res, next) => {
  const {email} = req.body;
  const user = await userModel.findOne({ email: email });

  if (!user) next(new appError(`user dosent exist`, 400));
  
  const Token = uuidv4()



  
  const tokenAddedToUser = await userModel.findOneAndUpdate(
    {email},
    { resetToken: Token },
    { new: true }
  );

  if (!tokenAddedToUser) {
    next(new appError(`User not found`, 404));

  }
  console.log(tokenAddedToUser)

  const resetLink = `${process.env.CLIENT_URL}/auth-pass-change?token=${Token}&id=${user._id}`;

  const emailContent = `
  <html>
    <head>
      <style>
        /* Add your CSS styling here */
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          border: 1px solid #ccc;
          border-radius: 5px;
        }
        .header {
          text-align: center;
          margin-bottom: 20px;
        }
        .message {
          margin-bottom: 20px;
        }
        .button {
          display: inline-block;
          padding: 10px 20px;
          background-color: #007bff;
          color: #fff;
          text-decoration: none;
          border-radius: 5px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>reset password for your simons rana account</h2>
        </div>
        <div class="message">
          <p>Dear ${user.firstName} ${user.middleName} ${user.lastName},</p>
          <p>You requested a password reset. Click the following link to reset your password:</p>
          <p><a class="button" href="${resetLink}">Reset Password</a></p>
          <p>If you didn't request this, please ignore this email.</p>
        </div>
      </div>
    </body>
  </html>
`;

  const mailOptions = {
    from: "avasfdsansokln234@outlook.com",
    to: user.email,
    subject: "Password Reset Request",
    html: emailContent,
  }; 

  const sentMail = await transporter.sendMail(mailOptions);
  return res.json({ data: sentMail });
});

module.exports.resetPassword = catchAsync(async (req, res, next) => {
  const { token, id, password } = req.body;

  const user = await userModel.findById(id);
  console.log(id)
  if (!user) {
    return next(new appError(`user dosent exist`, 400));
  }
  console.log(user)

  if (token !== user.resetToken) {
    return next(new appError(`token is invalid`, 400));
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const updateUser = await userModel.findByIdAndUpdate(
    id,
    { password: hashedPassword },
    { new: true }
  );
  if (updateUser) {
    await userModel.findByIdAndUpdate(id, { resetToken: "" });
    return res.json({ data: "Password reset successful" });
  } else {
    return res.status(400).send({ error: "User update not requested" });
  }
});

module.exports.editProfile = catchAsync(async(req,res,next)=>{
  var token = req.headers['authorization']; 
  const {userId} = jwt.decode(token);

  const ProfileToChange = userModel.findById(userId)
  if(!ProfileToChange||ProfileToChange.deleted){
    next(new appError(`userModel not found`, 400))
  }


  const updateData = {};
  // Check if any changes are made before updating the 'updatedAt' field.
  if (ProfileToChange.firstName !== req.body.firstName) {
    updateData.firstName = req.body.firstName;
  }
  if (ProfileToChange.middleName !== req.body.middleName) {
    updateData.middleName = req.body.middleName;
  }
  if (ProfileToChange.lastName !== req.body.lastName) {
    updateData.lastName = req.body.lastName;
  }
  if (ProfileToChange.email !== req.body.email) {
    updateData.email = req.body.email;
  }

  if (Object.keys(updateData).length === 0) {
    // No changes were made to the userModel data.
    next(new appError(`No changes were made to the userModel data`, 400))
  }
  updateData.updatedAt = Date.now();
  await userModel.findByIdAndUpdate(userId, updateData);

  // Fetch the updated userModel from the database.
  const updatedProfile = await userModel.findById(userId);
  res
    .status(200)
    .json({
      message: "Profile updated successfully",
      data: updatedProfile,
    });


  return res.status(400).send({ error: "User not found" });

})
