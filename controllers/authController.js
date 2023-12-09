
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");
const { options } = require("../routes/user");
require("dotenv").config();

exports.signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists',
      });
    }

    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(password, 10);
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: 'Error in hashing password',
      });
    }

    const user = await User.create({
      name, email, password: hashedPassword, role,
    });

    return res.status(200).json({
      success: true,
      message: 'User created successfully',
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'User cannot be registered, please try again later',
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please fill all the details carefully',
      });
    }

    let user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User is not registered',
      });
    }

    const payload = {
      email: user.email,
      id: user._id,
      role: user.role,
    };

    if (await bcrypt.compare(password, user.password)) {
      let token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "2h",
      });

      user = user.toObject();
      user.token = token;
      user.password = undefined;

      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      };

      res.cookie("token", token, options).status(200).json({
        success: true,
        token,
        user,
        message: 'User logged in successfully',
      });
    } else {
      return res.status(403).json({
        success: false,
        message: "Password incorrect",
      });
    }

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: 'Login failure',
    });

  }
};
