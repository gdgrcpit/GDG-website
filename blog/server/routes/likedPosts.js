const express = require('express');
const LikedPost = require('../models/likedPost');
const Blog = require('../models/blog');  // Assuming you have the Blog model
const router = express.Router();

// Like a post
router.post('/like', async (req, res) => {
  const { userId, blogId } = req.body;

  try {
    // Check if the post is already liked by the user
    const existingLike = await LikedPost.findOne({ userId, blogId });
    if (existingLike) {
      return res.status(400).json({ message: 'Post already liked' });
    }

    const newLike = new LikedPost({ userId, blogId });
    await newLike.save();
    res.status(200).json({ message: 'Post liked successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error liking post', error });
  }
});

// Unlike a post
router.post('/unlike', async (req, res) => {
  const { userId, blogId } = req.body;

  try {
    const like = await LikedPost.findOneAndDelete({ userId, blogId });
    if (!like) {
      return res.status(404).json({ message: 'Like not found' });
    }
    res.status(200).json({ message: 'Post unliked successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error unliking post', error });
  }
});

// Get liked posts by a user
router.get('/:userId', async (req, res) => {
  try {
    const likedPosts = await LikedPost.find({ userId: req.params.userId }).populate('blogId');
    res.status(200).json(likedPosts.map(like => like.blogId));
  } catch (error) {
    res.status(500).json({ message: 'Error fetching liked posts', error });
  }
});

module.exports = router;
