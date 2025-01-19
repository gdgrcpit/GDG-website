import React, { useState, useEffect } from "react";

const AdminDashboard = () => {
  const [blogs, setBlogs] = useState([]);

  // Fetch blogs from the server
  useEffect(() => {
    fetch("http://localhost:5000/api/admin/blogs")
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched Blogs:", data); // Log the fetched data
        setBlogs(data);
      })
      .catch((error) => console.error("Error fetching blogs:", error));
  }, []);

  const handleApprove = (id) => {
    fetch(`http://localhost:5000/api/admin/blogs/${id}/approve`, {
      method: "PUT",
    })
      .then(() => {
        setBlogs(blogs.filter((blog) => blog._id !== id));
      })
      .catch((error) => console.error("Error approving blog:", error));
  };

  const handleReject = (id) => {
    fetch(`http://localhost:5000/api/admin/blogs/${id}/reject`, {
      method: "PUT",
    })
      .then(() => {
        setBlogs(blogs.filter((blog) => blog._id !== id));
      })
      .catch((error) => console.error("Error rejecting blog:", error));
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-1/5 bg-gray-200 p-4">
        <div className="flex flex-col items-center">
          <img
            src="../img/149071.png"
            alt="Admin"
            className="w-24 h-24 rounded-full mb-4"
          />
          <h2 className="text-lg font-semibold">Welcome to Admin Panel</h2>
          <p className="text-gray-600">Admin</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full">
        {/* Top Navbar */}
        <div className="bg-[#00406b] p-4 text-white flex justify-between items-center">
          <h1 className="text-2xl font-bold">DASHBOARD</h1>
          <div className="flex items-center">
            <a href="/" className="mr-4">
              Home
            </a>
            <img
              src="../img/149071.png"
              alt="Profile"
              className="w-10 h-10 rounded-full"
            />
          </div>
        </div>

        {/* Data Table */}
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-4">Pending Blogs</h2>
          <div className="overflow-x-auto">
            <table className="table-auto w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-3">Blog Image</th>
                  <th className="border p-3">Author Name</th>
                  <th className="border p-3">Author Email</th>
                  <th className="border p-3">Title</th>
                  <th className="border p-3">Category</th>
                  <th className="border p-3">Content</th>
                  <th className="border p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {blogs.length > 0 ? (
                  blogs.map((blog) => (
                    <tr key={blog._id} className="hover:bg-gray-50">
                      <td className="border p-3">
                        <img
                          src={`http://localhost:5000/api/blogs/thumbnail/${blog.filePath}`}
                          alt={blog.title || "No Image"}
                          className="h-12 w-12 rounded"
                        />
                      </td>
                      <td className="border p-3">{blog.name || "Unknown Author"}</td>
                      <td className="border p-3">{blog.email || "Unknown Email"}</td>
                      <td className="border p-3">{blog.title || "Untitled Blog"}</td>
                      <td className="border p-3">{blog.category || "No Category"}</td>
                      <td className="border p-3">{blog.content || "No Content"}</td>
                      <td className="border p-3 flex space-x-2">
                        <button
                          onClick={() => handleApprove(blog._id)}
                          className="bg-green-500 text-white px-3 py-1 rounded"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(blog._id)}
                          className="bg-red-500 text-white px-3 py-1 rounded"
                        >
                          Reject
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center p-3">
                      No blogs found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
