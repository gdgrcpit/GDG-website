import React, { useState, useEffect } from 'react';

const LikedBlogs = () => {
  const [likedBlogs, setLikedBlogs] = useState([]);

  useEffect(() => {
    // Replace with the actual userId
    const userId = 'user123'; // Replace with actual userId from context or state
    const fetchLikedBlogs = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/liked-posts/${userId}`);
        const data = await response.json();
        setLikedBlogs(data);
      } catch (error) {
        console.error('Error fetching liked blogs:', error);
      }
    };
    fetchLikedBlogs();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6 pt-20 md:p-12 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4">Liked Blogs</h1>
      {likedBlogs.length > 0 ? (
        likedBlogs.map((post) => (
          <div
            key={post._id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300 w-full max-w-lg mb-6"
          >
            {/* Blog Image */}
            <div className="relative h-64 w-full">
              <img
                src={post.image}
                alt={post.title}
                className="h-full w-full object-cover transition duration-300 ease-in-out transform hover:scale-105 hover:brightness-75"
              />
            </div>

            {/* Blog Details */}
            <div className="p-4">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{post.title}</h3>
              <p className="text-sm text-gray-600 mb-2">{`Author: ${post.author}`}</p>

              {/* Category and Like Button */}
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm text-blue-600 font-medium">{post.category}</span>
              </div>

              <div className="text-sm text-gray-500 mb-4">
                Posted on: {new Date(post.createdAt).toLocaleString()}
              </div>

              <button
                onClick={() => alert('Read More functionality to be implemented')}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Read More →
              </button>
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-600">No liked blogs yet!</p>
      )}
    </div>
  );
};

export default LikedBlogs;
