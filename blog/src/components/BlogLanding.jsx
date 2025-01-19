import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';

export default function BlogLanding() {
  const [approvedBlogs, setApprovedBlogs] = useState([]);
  const [likedPosts, setLikedPosts] = useState({});
  const [selectedPost, setSelectedPost] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const navigate = useNavigate();
  const userId = 'someUserId'; // Replace with actual user ID from authentication context

  useEffect(() => {
    const fetchApprovedBlogs = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/blogs/');
        const data = await response.json();
        const processedData = data.map((blog) => ({
          _id: blog._id,
          title: blog.title,
          category: blog.category,
          author: blog.name,
          createdAt: blog.createdAt,
          image: `http://localhost:5000/api/blogs/thumbnail/${blog.filePath}`,
          content: blog.content,
        }));
        setApprovedBlogs(processedData);
        setFilteredBlogs(processedData);
        // Load liked posts from the server
        loadLikedPosts();
      } catch (error) {
        console.error('Error fetching blogs:', error);
      }
    };

    fetchApprovedBlogs();
  }, []);

  const loadLikedPosts = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/liked-posts/${userId}`);
      const likedBlogs = await response.json();
      const likedBlogIds = likedBlogs.map((blog) => blog._id);
      setLikedPosts(likedBlogIds.reduce((acc, blogId) => ({ ...acc, [blogId]: true }), {}));
    } catch (error) {
      console.error('Error loading liked posts:', error);
    }
  };

  const handleLike = async (postId) => {
    try {
      if (likedPosts[postId]) {
        await fetch('http://localhost:5000/api/liked-posts/unlike', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, blogId: postId }),
        });
      } else {
        await fetch('http://localhost:5000/api/liked-posts/like', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, blogId: postId }),
        });
      }
  
      setLikedPosts((prev) => ({
        ...prev,
        [postId]: !prev[postId],  // Toggle like status
      }));
    } catch (error) {
      console.error('Error liking/unliking post:', error);
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    if (term) {
      const filtered = approvedBlogs.filter(
        (blog) =>
          blog.category.toLowerCase().includes(term.toLowerCase()) ||
          blog.title.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredBlogs(filtered);
    } else {
      setFilteredBlogs(approvedBlogs);
    }
  };

  return (
    <div className="relative min-h-screen bg-gray-100 p-6 pt-20 md:p-12 flex flex-col">
      {/* Search Bar */}
      <div className="flex justify-center mb-6">
        <div className="flex items-center bg-gray-100 rounded-lg p-2 w-full max-w-xl">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full p-2 rounded-lg"
            placeholder="Search by category or title"
          />
        </div>
      </div>

      {/* Blog Posts */}
      <div className="flex flex-col gap-6 items-center w-full">
        {filteredBlogs.map((post) => (
          <div
            key={post._id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300 w-full max-w-lg"
          >
            <div className="relative h-64 w-full">
              <img
                src={post.image}
                alt={post.title}
                className="h-full w-full object-cover transition duration-300 ease-in-out transform hover:scale-105 hover:brightness-75"
              />
            </div>
            <div className="p-4">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{post.title}</h3>
              <p className="text-gray-600 text-sm mb-2">{`Author: ${post.author}`}</p>
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm text-blue-600 font-medium">{post.category}</span>
              </div>
              <div className="text-sm text-gray-500 mb-4">
                Posted on: {new Date(post.createdAt).toLocaleString()}
              </div>
              <button
                onClick={() => setSelectedPost(post)}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Read More →
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedPost && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={() => setSelectedPost(null)}
            ></motion.div>
            <motion.div
              key="modal"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 flex items-center justify-center z-50"
            >
              <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-4xl relative max-h-[90vh] overflow-y-auto">
                <button
                  onClick={() => setSelectedPost(null)}
                  className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
                >
                  ×
                </button>
                <h2 className="text-3xl font-bold text-gray-800 mb-6">{selectedPost.title}</h2>
                <p className="text-lg text-blue-600 font-medium mb-4">{selectedPost.category}</p>
                <img
                  src={selectedPost.image}
                  alt={selectedPost.title}
                  className="w-full h-64 object-cover rounded-md mb-6"
                />
                <div className="text-gray-700 text-base mb-6">{selectedPost.content}</div>
                <div className="border-t pt-4 text-sm text-gray-600">
                  <p>
                    <span className="font-medium">Author:</span> {selectedPost.author}
                  </p>
                  <p>
                    <span className="font-medium">Posted On:</span>{' '}
                    {new Date(selectedPost.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Add New Post Button (Floating at Bottom Right) */}
    <Link
  to="/create-blog"
  className="fixed bottom-6 right-6 bg-[#03558c] text-white font-medium rounded-full p-6 text-3xl shadow-lg hover:shadow-2xl transition duration-300"
>
  +
</Link>

    </div>
  );
}
