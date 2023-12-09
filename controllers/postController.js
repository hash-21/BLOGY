const Post = require("../models/postModel")

exports.createPost = async (req, res) => {
    try {
        const { title, body, author } = req.body;

        const post = new Post({
            title,
            body,
            author,
        });

        const savedPost = await post.save();

        res.json({
            success: true,
            post: savedPost,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            error: "Error While Creating Post",
        });
    }
}

exports.getAllPosts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10; 

        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

        // Fetch posts with pagination
        const posts = await Post.find()
            .populate("likes")
            .populate("comments")
            .skip(startIndex)
            .limit(limit);

        const totalPosts = await Post.countDocuments();

        const pagination = {
            currentPage: page,
            totalPages: Math.ceil(totalPosts / limit),
            totalPosts,
            startIndex,
            endIndex: Math.min(endIndex, totalPosts),
        };

        res.json({
            data: posts,
            pagination,
        });
    } catch (err) {
        return res.status(400).json({
            error: "Error while Fetching Posts",
        });
    }
};




exports.editPost = async (req, res) => {
    try {
        const postId = req.params.id;
        const { title, body } = req.body;

        const updatedPost = await Post.findByIdAndUpdate(
            postId,
            { title, body },
            { new: true } // Return the updated post
        );

        if (!updatedPost) {
            return res.status(404).json({
                success: false,
                message: "Post not found",
            });
        }

        res.json({
            success: true,
            post: updatedPost,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            error: "Error While Updating Post",
        });
    }
};



exports.deletePost = async (req, res) => {
    try {
        const postId = req.params.id;

        const deletedPost = await Post.findByIdAndDelete(postId);

        if (!deletedPost) {
            return res.status(404).json({
                success: false,
                message: "Post not found",
            });
        }

        res.json({
            success: true,
            post: deletedPost,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            error: "Error While Deleting Post",
        });
    }}