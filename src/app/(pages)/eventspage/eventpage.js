"use client";
import { useState,useEffect } from "react";
import Image from "next/image";
import { PlusCircleIcon } from "@heroicons/react/24/outline"; // Import Heroicons for the button
import useAuthStore from "@/store/authStore";
import API from "@/action/axios";
import { IoChevronBackOutline, IoChevronForward, IoCloseOutline } from "react-icons/io5";
import { AiOutlineClose } from "react-icons/ai";
import { useAlert } from "@/components/AlertContext";
import CustomAlert from "@/utils/customAlert";
import Spinner from '@/utils/spinner';
 
const Post = ({ post, onViewAll }) => {
  // const [likes, setLikes] = useState(post.likes);
 
  // const handleLike = () => {
  //   setLikes(likes + 1);
  // };
 
  return (
    <div className="group bg-secondary bg-opacity-60 shadow-lg rounded-xl overflow-hidden transition-all duration-300 transform hover:scale-105 hover:shadow-2xl">
      {post.front_image && (
        <div className="relative" onClick={() => onViewAll(post.id)}>
          <Image
            src={`data:image/png;base64,${post.front_image}`}
            alt="Post Image"
            className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
            width={400}
            height={256}
          />
          <div className="absolute top-4 left-4 bg-secondary/70 px-3 py-1 rounded-lg text-sm font-semibold text-primary shadow-md">
            {post.created_at}
          </div>
        </div>
      )}
 
      <div className="p-6">
        <h2 className="text-lg text-center font-bold text-primary group-hover:text-blue-600 transition-colors duration-300">
          {post.title}
        </h2>
        <p className="text-primary mt-3 text-center line-clamp-2">{post.content}</p>
 
        {/* <div className="flex items-center justify-between mt-6">
          <button
            className="flex items-center text-blue-500 font-semibold hover:text-blue-700 transition-all duration-300"
            onClick={handleLike}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 24 24"
              className="w-6 h-6 mr-2"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            Like ({likes})
          </button>
 
          <button
            className="text-sm font-semibold text-gray-600 hover:text-gray-800 transition"
            onClick={() => onViewAll(post.id)}
          >
            View All Albums
          </button>
        </div> */}
      </div>
    </div>
  );
};
 
const FullViewModal = ({ photos, currentIndex, onClose, onNext, onPrevious }) => {
  const currentPhoto = photos[currentIndex];
 
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="relative w-full h-full flex justify-center items-center">
        <button
          className="absolute top-4 right-4 text-white text-3xl hover:text-gray-300"
          onClick={onClose}
        >
          <IoCloseOutline />
        </button>
 
        <div className="relative w-3/4 h-3/4 sm:w-4/5 md:w-3/5 lg:w-2/3">
          <Image
            src={`data:image/png;base64,${currentPhoto.content}`}
            alt="Full View"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-contain"
          />
        </div>
 
        <button
          className="absolute left-4 text-secondary text-4xl hover:text-gray-300"
          onClick={onPrevious}
          disabled={currentIndex === 0}
        >
          <IoChevronBackOutline/>
        </button>
        <button
          className="absolute right-4 text-secondary text-4xl hover:text-gray-300"
          onClick={onNext}
          disabled={currentIndex === photos.length - 1}
        >
          <IoChevronForward />
        </button>
      </div>
    </div>
  );
};
 
export default function Posts() {
  const { role } = useAuthStore();
  const [posts, setPosts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const { alertContent, showAlertContent } = useAlert();
  const [isLoading, setIsLoading] = useState(false);
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    front_image: null,
    files: [],
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleInputChange = (field, value) => {
    setNewPost({ ...newPost, [field]: value });
  
    // Clear the error for this field if a valid value is provided
    if (errors[field]) {
      setErrors({ ...errors, [field]: null });
    }
  };  

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const response = await API.get("/event/list_images");
      setPosts(response.data); // Assuming API returns an array of posts
    } catch (error) {
      console.error("Error fetching posts:", error);
      // alertContent("Error fetching posts", "error")
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!newPost.title.trim()) newErrors.title = "Title is required.";
    if (!newPost.content.trim()) newErrors.content = "Content is required.";
    if (!newPost.front_image) newErrors.front_image = "Cover image is required.";
    if (newPost.files.length === 0) newErrors.files = "At least one file is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
 
  const handleViewAll = (id) => {
    const selected = posts.find((post) => post.id === id);
    setSelectedPhotos(selected.files);
    setCurrentIndex(0);
    setIsModalOpen(true);
  };
 
  const handleNext = () => {
    if (currentIndex < selectedPhotos.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };
 
  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleCancel = () => {
    setIsUploadOpen(false)
    setNewPost({ title: "", content: "", front_image: null, files: [] });
    setErrors({});
  }
  
  const handleSubmitPost = async () => {
    if (!validateForm()) return;
    const formData = new FormData();
    formData.append("front_image", newPost.front_image);
    
    newPost.files.forEach((file) => formData.append("files", file));

    try {
      const response = await API.post(`/event/upload_images?title=${newPost.title}&content=${newPost.content}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if(response.status === 200){
        fetchPosts();
        setIsUploadOpen(false)
        setNewPost({ title: "", content: "", front_image: null, files: [] });
        setErrors({});
        alertContent("Images uploaded successfully", "success")
      }
    } catch (error) {
      console.error("Error uploading post:", error);
      alertContent("Error uploading the posts! Try again later!", "error")
    }
  };

  useEffect(() => {
    if (isUploadOpen || isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isUploadOpen, isModalOpen]);

  return (
    <div className="mx-auto px-4 py-4 sm:px-6 md:px-8 relative min-h-screen">
      {showAlertContent && (<CustomAlert message={showAlertContent.message} type={showAlertContent.type} />)}
      {(role === "Admin" || role === "Accountant" || role === "Father") && (
        <button
          className="absolute top-5 right-5 flex items-center gap-2 p-3 bg-primary text-secondary rounded-full hover:bg-gray-900 shadow-lg transition-all"
          onClick={() => setIsUploadOpen(true)}
        >
          <PlusCircleIcon className="w-6 h-6" />
        </button>
      )}
      <div className="flex justify-center items-center py-12">
        <h1 className="text-4xl font-bold mt-[-35px] text-primary drop-shadow-md">Event Albums</h1>
      </div>

      {isUploadOpen && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-secondary p-6 rounded-xl w-full sm:w-3/4 md:w-1/2 lg:w-1/3">
            <div className="flex justify-end">
              <button 
                onClick={handleCancel}
                className="fixed text-primary hover:text-primary rounded-full z-20"
                aria-label="Close"
              >
                <AiOutlineClose className='w-6 h-6'/>
              </button>
            </div>
            <h2 className="text-3xl text-center text-primary font-bold mb-4">Upload New Post</h2>
            <label className="block text-primary mb-1 font-semibold">Post Title</label>
            <input
              type="text"
              placeholder="Post Title"
              value={newPost.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              className={`w-full p-2 border ${errors.title ? "border-red-500" : "border-gray-700"} rounded`}
            />
            {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
            <label className="block text-primary mb-1 mt-4 font-semibold">Post Content</label>
            <input
              placeholder="Post Content"
              value={newPost.content}
              onChange={(e) => handleInputChange("content", e.target.value)}
              className={`w-full p-2 border ${errors.content ? "border-red-500" : "border-gray-700"} rounded`}
            />
            {errors.content && <p className="text-red-500 text-sm">{errors.content}</p>}
            <label className="block text-primary mb-1 mt-4 font-semibold">Select Cover Image</label>
            <input
              type="file"
              name="Cover Photo"
              onChange={(e) => {
                const file = e.target.files[0];
                handleInputChange("front_image", file);
              }}
              className={`w-full p-2 text-black border ${errors.front_image ? "border-red-500" : "border-gray-700"} rounded`}
            />
            {errors.front_image && <p className="text-red-500 text-sm">{errors.front_image}</p>}
            <label className="block text-primary mb-1 mt-4 font-semibold">Select Images</label>
            <input
              type="file"
              name="Post Albums"
              multiple
              onChange={(e) => {
                const files = Array.from(e.target.files);
                handleInputChange("files", files);
              }}
              className={`w-full p-2 text-black border ${errors.files ? "border-red-500" : "border-gray-700"} rounded`}
            />
            {errors.files && <p className="text-red-500 text-sm">{errors.files}</p>}

            <div className="flex justify-between gap-4 mt-4">
              <button
                className="px-4 py-2 bg-red-600 text-secondary rounded-md hover:bg-red-800"
                onClick={handleCancel}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-primary text-secondary rounded-md hover:bg-gray-900"
                onClick={handleSubmitPost}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
      
      {isLoading ? (
        <div className="flex h-screen w-full items-center justify-center">
          <Spinner size="10" color="blue-500" />
        </div>
      ) : posts.length === 0 ? (
        <div className="flex h-screen w-full items-center justify-center">
          <p className="text-xl text-primary">No events available!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Post key={post.id} post={post} onViewAll={handleViewAll} />
          ))}
        </div>
      )}

      {isModalOpen && (
        <FullViewModal
          photos={selectedPhotos}
          currentIndex={currentIndex}
          onClose={() => setIsModalOpen(false)}
          onNext={handleNext}
          onPrevious={handlePrevious}
        />
      )}
    </div>
  );
}