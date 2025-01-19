const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  name: { type: String, required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  category: { type: String, required: true },
  email: { type: String, required: true },
  filePath: { type: String, required: false }, // Optional, for file upload
  approved: { type: Boolean, default: false },  // Track approval status
});

module.exports = mongoose.model("Blog", blogSchema);
