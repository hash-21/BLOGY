// middlewares.js
const jwt = require("jsonwebtoken");
const Post = require("../models/postModel");

require('dotenv').config();

exports.verifyToken = (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
     console.log(token);
    if (!token || token === undefined) {
      return res.status(401).json({
        success: false,
        message: 'Token Missing',
      });
    }

    console.log(token);


    const payload = jwt.verify(token, process.env.JWT_SECRET);
    console.log(payload);

    req.user = payload;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Token is invalid',
    });
  }
}

exports.checkPermission = (role) => {
  return (req, res, next) => {
    try {
      if (req.user.role !== role) {
        return res.status(401).json({
          success: false,
          message: `This is a protected route for ${role}s`,
        });
      }
      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'User Role is not matching',
      })
    }
  }
}




exports.checkPostOwnership = async (req, res, next) => {
  try {
    const foundPost = await Post.findById(req.params.id).populate({
        path: 'author',
        select: '_id username email', // Include the fields you want
      });

    if (!foundPost) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    console.log(foundPost);


    console.log(foundPost.author);

    console.log('User ID from token:', req.user.id);
    console.log('Author ID of the post:', foundPost.author._id);

    if (foundPost.author.id.equals(req.user.id)) {
      next();
    } else {
      res.status(403).json({
        success: false,
        message: 'You do not have permission to edit/delete this post',
      });
    }
  } catch (error) {
    console.error('Error in checkPostOwnership middleware:', error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
};
