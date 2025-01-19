import React,{useState} from "react";

import { Routes, Route } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import AdminDashboard from "./components/Admin_Dashboard";
import BlogLanding from "./components/BlogLanding";
import Blog_create from "./components/Blog_create";
import LikedBlogs from "./components/LikedBlogs";

const App = () => {
  const [likedPosts, setLikedPosts] = useState(
    JSON.parse(localStorage.getItem('likedPosts')) || {}
  );

  // Sync with localStorage
  const updateLikedPosts = (postId, isLiked) => {
    setLikedPosts((prev) => {
      const updated = { ...prev, [postId]: isLiked };
      localStorage.setItem('likedPosts', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/admin" element={<AdminDashboard />} />
      
      <Route path="/create-blog" element={<Blog_create />} /> {/* Add the Blog_create route */}
      <Route
          path="/blogs"
          element={<BlogLanding likedPosts={likedPosts} onLikeToggle={updateLikedPosts} />}
        />
        <Route
          path="/liked-blogs"
          element={<LikedBlogs likedPosts={likedPosts} onLikeToggle={updateLikedPosts} />}
        />
      
    </Routes>
  );
};

export default App;
