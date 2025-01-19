'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function BlogLanding() {
  const [approvedBlogs, setApprovedBlogs] = useState([]); // Holds the approved blog posts
  const [selectedPost, setSelectedPost] = useState(null); // Holds the selected post for modal display
  const [likedPosts, setLikedPosts] = useState({}); // For managing likes
  const [searchTerm, setSearchTerm] = useState(''); // State for search term
  const [filteredBlogs, setFilteredBlogs] = useState([]); // State for filtered blogs based on search

  // Fetch approved blog posts from the API
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
        setFilteredBlogs(processedData); // Initially show all blogs
      } catch (error) {
        console.error('Error fetching blogs:', error);
      }
    };

    fetchApprovedBlogs(); // Invoke the function to fetch data
  }, []);

  // Toggle like status for each post
  const handleLike = (postId) => {
    setLikedPosts((prev) => ({
      ...prev,
      [postId]: !prev[postId], // Toggle the like status
    }));
  };

  // Filter blogs based on category and search term
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
      setFilteredBlogs(approvedBlogs); // Reset to all blogs if no search term
    }
  };

  return (
    <div className="relative min-h-screen bg-gray-100 p-6 pt-20 md:p-12 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg rounded-lg p-4 mr-6 fixed top-0 left-0 h-full">
        <div className="flex flex-col gap-4">
          <Link
            to="/create-blog"
            className="px-4 py-2 bg-[#03558c] text-white font-medium rounded-lg"
          >
            Add New Post
          </Link>
          <Link
            to="#new-posts"
            className="px-4 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg"
          >
            New Posts
          </Link>
          <Link
            to="#old-posts"
            className="px-4 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg"
          >
            Trending Posts
          </Link>
          <div className="flex items-center bg-gray-100 rounded-lg p-2">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full p-2 rounded-lg"
              placeholder="Search by category or title"
            />
          </div>
        </div>
      </div>

      {/* Blog Posts List */}
      <div className="flex flex-col gap-6 mt-6 items-center ml-72 w-full">
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

              {/* Category and Like Button */}
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm text-blue-600 font-medium">{post.category}</span>
                <button
                  onClick={() => handleLike(post._id)}
                  className={`text-sm font-medium ${likedPosts[post._id] ? 'text-red-600' : 'text-gray-600'}`}
                >
                  {likedPosts[post._id] ? 'Liked ❤️' : 'Like 👍'}
                </button>
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

      {/* Post Details Modal */}
      <AnimatePresence>
        {selectedPost && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={() => setSelectedPost(null)}
            ></motion.div>

            {/* Modal */}
            <motion.div
              key="modal"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 flex items-center justify-center z-50"
            >
              <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-4xl relative max-h-[90vh] overflow-y-auto">
                {/* Close Button */}
                <button
                  onClick={() => setSelectedPost(null)}
                  className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
                >
                  ×
                </button>

                {/* Modal Content */}
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
                    <span className="font-medium">Current Date:</span>{' '}
                    {new Date().toLocaleString()}
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
