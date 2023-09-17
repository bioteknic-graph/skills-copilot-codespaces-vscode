// Create web server using Express.js
// Set up the routes for the web server
// Handle requests and send responses

const express = require('express');
const router = express.Router();
const Comment = require('../models/comment');
const Post = require('../models/post');
const User = require('../models/user');
const { isLoggedIn } = require('../middleware');

// Create a comment
router.post('/posts/:postId/comments', isLoggedIn, async (req, res) => {
    // Find the post
    const post = await Post.findById(req.params.postId).exec();
    // Create a new comment
    const comment = new Comment(req.body);
    // Set the author of the comment
    comment.author = req.user._id;
    // Save the comment
    await comment.save();
    // Add comment to the post
    post.comments.unshift(comment);
    // Save the post
    await post.save();
    // Redirect to the post
    res.redirect(`/posts/${post._id}`);
});

// Delete a comment
router.delete('/posts/:postId/comments/:commentId', async (req, res) => {
    // Find the post
    const post = await Post.findById(req.params.postId).exec();
    // Find the comment
    const comment = await Comment.findById(req.params.commentId).exec();
    // Delete the comment
    await comment.remove();
    // Remove the comment from the post
    post.comments.pull(comment);
    // Save the post
    await post.save();
    // Redirect to the post
    res.redirect(`/posts/${post._id}`);
});

module.exports = router;

