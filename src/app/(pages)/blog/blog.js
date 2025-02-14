"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { AiOutlinePlus, AiOutlineClose } from "react-icons/ai"; // Import an icon
import useAuthStore from "@/store/authStore";
import API from "@/action/axios";
import { useAlert } from "@/components/AlertContext";
import CustomAlert from "@/utils/customAlert";
import Spinner from '@/utils/spinner';

const YouTube = dynamic(() => import("react-youtube"), { ssr: false });

// Modal Component
const Modal = ({ isOpen, onClose, onSubmit, blogData, onChange, errors }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-secondary p-6 rounded-lg shadow-lg max-w-sm w-full">
      <div className="flex justify-end">
        <button 
          onClick={onClose}
          className="fixed text-primary hover:text-primary rounded-full z-20"
          aria-label="Close"
        >
          <AiOutlineClose className='w-6 h-6'/>
        </button>
      </div>
        <h2 className="text-3xl text-center font-bold text-primary mb-4">
          Add New Blog
        </h2>
        <form>
          {["title", "author", "video_id"].map((field) => (
            <div className="mb-4" key={field}>
              <label className="block text-primary mb-1 font-semibold capitalize">
              {field
                .split("_")
                .map((word, index) =>
                  index === 1 ? word.toUpperCase() : word.charAt(0).toUpperCase() + word.slice(1)
                )
                .join(" ")}
              </label>
              <input
                type="text"
                name={field}
                value={blogData[field]}
                onChange={onChange}
                className={`w-full p-2 border ${errors[field] ? "border-red-500" : "border-gray-700"} rounded`}
                required 
              />
              {errors[field] && (
                <span className="text-red-500 text-sm">{errors[field]}</span>
              )}
            </div>
          ))}
          <div className="flex justify-between gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-red-600 text-secondary rounded-md hover:bg-red-800"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onSubmit}
              className="px-4 py-2 bg-primary text-secondary rounded-md hover:bg-gray-900"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Blog Card Component
const BlogCard = ({ blog, videoOptions }) => (
  <div className="bg-secondary bg-opacity-60 rounded-lg shadow-md hover:shadow-xl transform hover:scale-105 transition-all duration-300 overflow-hidden">
    <YouTube videoId={blog.video_id} opts={videoOptions} />
    <div className="p-4">
      <h2 className="text-xl font-semibold text-primary truncate">
        {blog.title}
      </h2>
      <p className="text-sm text-primary mt-1">
        By <span className="text-blue-600 font-medium">{blog.author}</span>
      </p>
      <p className="text-sm text-primary">
        Published on {blog.created_at ? new Date(blog.created_at).toLocaleDateString() : "N/A"}
      </p>
    </div>
  </div>
);

function ChurchBlogScreen() {
  const [blogs, setBlogs] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newBlog, setNewBlog] = useState({ title: "", author: "", video_id: "" });
  const [errors, setErrors] = useState({ title: "", author: "", video_id: "" });
  const { alertContent, showAlertContent } = useAlert();
  const [isLoading, setIsLoading] = useState(false);

  const { role } = useAuthStore();

  const videoOptions = {
    height: "360",
    width: "100%",
    playerVars: { autoplay: 0 },
  };

  const fetchBlogs = async () => {
    setIsLoading(true); 
    try {
      const response = await API.get("/blog/list_blogs");
      if (response.status === 200) {
        setBlogs(response.data);
      }
    } catch (error) {
      alertContent(`Error fetching blogs: ${error.message}`, "error");
    } finally {
      setIsLoading(false); 
    }
  };

  // Fetch Blogs on Component Mount
  useEffect(() => {
    fetchBlogs();
  }, []);

  // Handle Form Input Changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewBlog((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // Clear error for the field when the user starts typing
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const handleCancel = (e) => {
    setIsModalOpen(false);
    setErrors({})
  }

  // Validation function
  const validate = () => {
    let valid = true;
    const newErrors = { title: "", author: "", video_id: "" };
    // Title validation
    if (!newBlog.title) {
      newErrors.title = "Title is required.";
      valid = false;
    }
    // Author validation
    if (!newBlog.author) {
      newErrors.author = "Author is required.";
      valid = false;
    }
    // Video ID validation (basic pattern for YouTube video ID)
    if (!newBlog.video_id) {
      newErrors.video_id = "Video ID is required.";
      valid = false;
    } else if (!/^([a-zA-Z0-9_-]){11}$/.test(newBlog.video_id)) {
      newErrors.video_id = "Invalid YouTube video ID.";
      valid = false;
    }
    setErrors(newErrors);
    return valid;
  };

  // Handle Add Blog Modal
  const handleAddBlog = () => {
    setNewBlog({ title: "", author: "", video_id: "" });
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setNewBlog({ title: "", author: "", video_id: "" });
    setErrors({})
  };

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isModalOpen]);

  // Handle Blog Submission
  const handleSubmit = async () => {
    if (validate()) {
      try {
        const response = await API.post("/blog/create_new_blog", newBlog);
        if (response.status === 200) {
          setBlogs((prev) => [...prev, response.data]);
          setNewBlog({ title: "", author: "", video_id: "" });
          setIsModalOpen(false);
          alertContent("Successfully uploaded", "success");
        }
      } catch (error) {
        if (error.response && error.response.data && error.response.data.detail) {
          alertContent(`Error: ${error.response.data.detail}`, "error");
        } else {
          alertContent(`Error fetching blogs: ${error.message}`, "error");
        }
      }
    }
  };

  return (
    <div className="mx-auto px-4 py-4 sm:px-6 md:px-8 relative min-h-screen">
      {showAlertContent && (
        <CustomAlert message={showAlertContent.message} type={showAlertContent.type} />
      )}
      {(role === "Admin" || role === "Accountant" || role === "Father") && (
        <button
          onClick={handleAddBlog}
          className="absolute top-5 right-5 flex items-center gap-2 p-3 bg-primary text-secondary rounded-lg hover:bg-gray-900 shadow-lg transition-all"
        >
          <AiOutlinePlus size={20} />
          Add Blog
        </button>
      )}
      <div className="flex justify-center items-center py-12">
        <h1 className="text-4xl font-bold mt-[-35px] text-primary drop-shadow-md">Our Blogs</h1>
      </div>

      {/* Blog Section */}
      {isLoading ? (
        <div className="flex h-screen w-full items-center justify-center">
          <Spinner size="10" color="blue-500" />
        </div>
      ) : blogs.length === 0 ? (
        <div className="flex h-screen w-full items-center justify-center">
          <p className="text-xl text-primary">No blogs available!</p>
        </div>
      ) : (
        <div className="px-6 md:px-20 pb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog, key) => (
              <BlogCard key={blog.id} blog={blog} videoOptions={videoOptions} />
            ))}
          </div>
        </div>
      )}
      {/* Modal for Adding a Blog */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        blogData={newBlog}
        onChange={handleChange}
        errors={errors}
      />
    </div>
  );
}

export default ChurchBlogScreen;