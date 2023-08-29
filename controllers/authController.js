const userModel = require("../models/userModal");
const roleModel = require("../models/roleModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const catchAsync = require("../utils/catchAsync");
const appError = require("../utils/appError");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const { v4: uuidv4 } = require('uuid');

const transporter = nodemailer.createTransport({
  host: "smtp-mail.outlook.com",
  port: 587,
  auth: {
    user: "somone_from_hell@outlook.com",
    pass: "NodeMailer@123",
  },
});

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
  const user = await userModel.findOne({ email: req.body.email });

  if (!user) next(new appError(`user dosent exist`, 400));

  let Token = uuidv4();
  
  const tokenAddedToUser = await userModel.findOneAndUpdate(
    { email:user.email },
    { resetToken: Token },
    { new: true }
  );

  if (!tokenAddedToUser) {
    next(new appError(`User not found`, 404));
  }

  const resetLink = `${process.env.CLIENT_URL}/auth-pass-change?token=${resetToken}&id=${user._id}`;

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
    from: "somone_from_hell@outlook.com",
    to: user.email,
    subject: "Password Reset Request",
    html: emailContent,
  };

  const sentMail = await transporter.sendMail(mailOptions);
  return res.json({ data: sentMail });
});

module.exports.resetPassword = catchAsync(async (res, req, next) => {
  const { token, id, newPassword } = req.body;

  const user = await userModel.findById(id);

  if (!user) {
    return next(new appError(`user dosent exist`, 400));
  }

  if (token !== user.resetToken) {
    return next(new appError(`token is invalid`, 400));
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);
  const updateUser = await userModel.findByIdAndUpdate(
    id,
    { password: hashedPassword },
    { new: true }
  );
  if (!updateUser) {
    return next(new Error("User not found"));
  }
  return res.json({ data: "Password reset successful" });
});
