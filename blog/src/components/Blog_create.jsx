import React, { useState } from "react";

const Blog_create = () => {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState("");
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");
  const [email, setEmail] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [showPreview, setShowPreview] = useState(false);  // Added state to toggle preview visibility

  const maxSizeInBytes = 2 * 1024 * 1024; // 2 MB

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile) {
      if (uploadedFile.size > maxSizeInBytes) {
        setFileError("File size must not exceed 2 MB.");
        setFile(null);
      } else {
        setFileError("");
        setFile(uploadedFile);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content || !category || !email || !name) {
      setResponseMessage("All fields except the file are required.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("category", category);
    formData.append("email", email);
    formData.append("name", name);
    if (file) {
      formData.append("file", file);
    }

    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/blogs", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setResponseMessage("Blog created successfully!");
        setTitle("");
        setFile(null);
        setCategory("");
        setContent("");
        setEmail("");
        setName("");
      } else {
        setResponseMessage("Failed to create blog.");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePreviewClick = () => {
    setShowPreview((prevState) => !prevState);
  };

  return (
    <div className="min-h-screen bg-[url('../public/img/bg1.jpg')] bg-cover bg-center flex flex-col justify-center items-center py-8">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg border border-gray-300">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Create Blog</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Enter Your Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              placeholder="Enter Your Email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Enter Your Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              placeholder="Enter Your Name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Upload Thumbnail</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
            {fileError && <p className="text-sm text-red-500 mt-1">{fileError}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Enter Your Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              placeholder="Enter Your Title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Enter Your Category</label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              placeholder="Enter Your Category"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              placeholder="Write your content here"
              rows="5"
            ></textarea>
          </div>

          <button
            type="submit"
            className={`relative w-full bg-[#0081B0] text-white py-2 rounded-full shadow hover:bg-[#006A8C] transition duration-300 group ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            <span className="absolute inset-0 overflow-hidden rounded-full">
              <span className="absolute inset-0 rounded-full bg-[radial-gradient(75%_100%_at_50%_0%,rgba(56,189,248,0.6)_0%,rgba(56,189,248,0)_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100"></span>
            </span>
            <div className="relative flex space-x-2 items-center justify-center z-10">
              <span>{loading ? "Submitting..." : "Submit"}</span>
              {!loading && (
                <svg
                  fill="none"
                  height="16"
                  viewBox="0 0 24 24"
                  width="16"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10.75 8.75L14.25 12L10.75 15.25"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                  />
                </svg>
              )}
            </div>
            <span className="absolute -bottom-0 left-[1.125rem] h-px w-[calc(100%-2.25rem)] bg-gradient-to-r from-emerald-400/0 via-emerald-400/90 to-emerald-400/0 transition-opacity duration-500 group-hover:opacity-40"></span>
          </button>
        </form>

        {responseMessage && <p className="mt-4 text-center text-green-600">{responseMessage}</p>}
      </div>

      <button
        type="button"
        onClick={handlePreviewClick}
        className={`relative w-full bg-[#03558c] text-white py-2 mt-4 rounded-full shadow hover:bg-[#00406b] transition duration-300 max-w-lg group`}
      >
        <span className="absolute inset-0 overflow-hidden rounded-full">
          <span className="absolute inset-0 rounded-full bg-[radial-gradient(75%_100%_at_50%_0%,rgba(3,85,140,0.6)_0%,rgba(3,85,140,0)_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100"></span>
        </span>
        <div className="relative flex items-center justify-center z-10">
          <span>{showPreview ? "Hide Preview" : "Show Preview"}</span>
          <svg
            fill="none"
            height="16"
            viewBox="0 0 24 24"
            width="16"
            xmlns="http://www.w3.org/2000/svg"
            className="ml-2"
          >
            <path
              d={showPreview ? "M14.25 15.25L10.75 12L14.25 8.75" : "M10.75 8.75L14.25 12L10.75 15.25"}
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
            />
          </svg>
        </div>
        <span className="absolute -bottom-0 left-[1.125rem] h-px w-[calc(100%-2.25rem)] bg-gradient-to-r from-blue-400/0 via-blue-400/90 to-blue-400/0 transition-opacity duration-500 group-hover:opacity-40"></span>
      </button>

      {showPreview && (
        <div className="mt-8 bg-white p-6 rounded-lg shadow-lg w-full max-w-lg border border-gray-300">
          <h2 className="text-xl font-bold mb-4 text-gray-800 text-center">Preview</h2>
          <div>
            {file && (
              <div className="mb-4">
                <p className="text-sm text-gray-600">File uploaded:</p>
                <p className="text-sm font-medium text-gray-800">
                  {file.name} ({(file.size / 1024).toFixed(2)} KB)
                </p>
                <img
                  src={URL.createObjectURL(file)}
                  alt="Thumbnail"
                  className="mt-4 max-w-full h-auto rounded-md"
                />
              </div>
            )}
            {name && <h3 className="text-lg font-semibold text-gray-800 break-words">{name}</h3>}
            {title && <h3 className="text-lg font-semibold text-gray-800 break-words">{title}</h3>}
            {category && <p className="text-sm text-gray-500 italic break-words">{category}</p>}
            <div
              className="mt-4 prose prose-indigo prose-lg break-words overflow-hidden"
              dangerouslySetInnerHTML={{ __html: content }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Blog_create;
