
const express = require("express");
const router = express.Router();
const {    likePost, unlikePost}= require('../controllers/likeController')
const {    createComment}= require('../controllers/commentController')

const { verifyToken,checkPermission,checkPostOwnership } = require('../middlewares/authMiddleware');
const {
    
    createPost,
    getAllPosts,
    editPost,
    deletePost
} = require("../controllers/postController");

// Apply JWT Middleware to Protected Routes
router.use(verifyToken);

// Mapping Create


// Apply Authorization Middleware for Routes with Specific Roles
router.post("/comments/create", checkPermission('user'), createComment);
router.post("/posts/create",checkPermission('admin'), createPost);
router.get("/posts", getAllPosts);
router.post("/likes/like", likePost);
router.post("/likes/unlike", unlikePost);

// Additional Routes for Edit and Delete
router.put("/posts/:id/edit", checkPostOwnership, editPost);
router.delete("/posts/:id/delete", checkPostOwnership, deletePost);

module.exports = router;
