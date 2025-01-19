const mongoose = require('mongoose');

const likedPostSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  blogId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Blog' },
  likedAt: { type: Date, default: Date.now },
});

const LikedPost = mongoose.model('LikedPost', likedPostSchema);

module.exports = LikedPost;
