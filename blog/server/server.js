const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const cors = require("cors");
const dotenv = require("dotenv");
const streamifier = require("streamifier");
const { GridFSBucket } = require("mongodb");
const Blog = require("./models/blog");
const adminRoutes = require("./routes/admin"); // Import admin routes
const likedPostRoutes = require('./routes/likedPosts');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

const conn = mongoose.connection;
let gfs;

// Initialize GridFSBucket once the connection is open
conn.once("open", () => {
  gfs = new GridFSBucket(conn.db, { bucketName: "uploads" });
});

// Middleware
app.use(cors());
app.use(express.json()); // To parse JSON requests
app.use('/api/liked-posts', likedPostRoutes);

// Admin Routes
app.use("/api/admin", adminRoutes); // Incorporate admin routes

// Root Route
app.get("/", (req, res) => {
  res.send("Server is running!");
});

// Multer setup (memory storage)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Create Blog Route
app.post("/api/blogs", upload.single("file"), async (req, res) => {
  const { name, title, category, content, email } = req.body;
  const file = req.file;

  if (!file) {
    return res.status(400).send({ message: "No file uploaded." });
  }

  // Upload the file to GridFS
  const uploadStream = gfs.openUploadStream(file.originalname, {
    contentType: file.mimetype,
  });
  const bufferStream = streamifier.createReadStream(file.buffer);
  bufferStream.pipe(uploadStream);

  uploadStream.on("finish", async () => {
    const newBlog = new Blog({
      name,
      title,
      category,
      content,
      email,
      filePath: uploadStream.id.toString(), // Save the GridFS file ID as a string
    });

    try {
      await newBlog.save();
      res.status(200).send({ message: "Blog created successfully!" });
    } catch (error) {
      res.status(500).send({ message: "Error creating blog." });
    }
  });

  uploadStream.on("error", (err) => {
    console.error("Error uploading file:", err);
    res.status(500).send({ message: "Error uploading file." });
  });
});

// Serve Pending Blogs for Admin
app.get("/api/admin/blogs", async (req, res) => {
  try {
    const blogs = await Blog.find({ approved: false });
    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching blogs." });
  }
});

// Approve Blog
app.put("/api/admin/blogs/:id/approve", async (req, res) => {
  const blogId = req.params.id;
  try {
    const blog = await Blog.findByIdAndUpdate(blogId, { approved: true }, { new: true });
    res.status(200).json(blog);
  } catch (error) {
    res.status(500).json({ message: "Error approving blog." });
  }
});

// Reject Blog
app.put("/api/admin/blogs/:id/reject", async (req, res) => {
  const blogId = req.params.id;
  try {
    const blog = await Blog.findByIdAndDelete(blogId);
    res.status(200).json({ message: "Blog rejected." });
  } catch (error) {
    res.status(500).json({ message: "Error rejecting blog." });
  }
});

// Serve Only Approved Blogs
app.get("/api/blogs", async (req, res) => {
  try {
    const blogs = await Blog.find({ approved: true });
    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching blogs." });
  }
});

// Serve Image File from GridFS
app.get("/api/blogs/thumbnail/:id", (req, res) => {
  const { id } = req.params;
  try {
    const readStream = gfs.openDownloadStream(new mongoose.Types.ObjectId(id));
    readStream.on("error", (err) => {
      res.status(404).json({ message: "File not found." });
    });
    readStream.pipe(res);
  } catch (error) {
    res.status(500).json({ message: "Error fetching the file." });
  }
});

// Start the Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
