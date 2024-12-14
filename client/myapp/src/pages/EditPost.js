import React, { useEffect, useState, useContext } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Navigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { UserContext } from '../context/UserContext';

const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dtxn91sys/image/upload"; // Cloudinary URL
const UPLOAD_PRESET = "blogimages"; // Cloudinary preset name

const modules = {
  toolbar: [
    ['bold', 'italic', 'underline', 'strike'],
    [{ align: [] }],
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ indent: '-1' }, { indent: '+1' }],
    [{ size: ['small', false, 'large', 'huge'] }],
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ['link', 'image', 'video'],
    [{ color: [] }, { background: [] }],
    ['clean'],
  ],
};

const formats = [
  'bold', 'italic', 'underline', 'strike',
  'align', 'list', 'indent',
  'size', 'header',
  'link', 'image',
  'color', 'background',
  'clean',
];

function EditPost() {
  const { userinfo } = useContext(UserContext);
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [file, setFile] = useState(null);
  const [fileUrl, setFileUrl] = useState(''); // Current file URL
  const [category, setCategory] = useState('');
  const [redirect, setRedirect] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state for image upload

  const API_URL = `${process.env.React_APP_BACKEND_BASEURL}`; // Use environment variable

  // Upload file to Cloudinary
  async function uploadToCloudinary(file) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);
    formData.append('cloud_name', 'dtxn91sys'); // Your Cloudinary cloud name

    try {
      const response = await axios.post(CLOUDINARY_URL,formData,{
        headers: {
          'Content-Type': 'multipart/form-data',
        },
  });
  if (response.status === 200) {
    return response.data.secure_url; // URL of the uploaded image
  } else {
    console.error('Error uploading to Cloudinary:', response.data); // Log response in case of an error
    throw new Error('Failed to upload image');
  }
    } catch (error) {
      toast.error('Error uploading image to Cloudinary');
      console.error(error);
      throw new Error('Failed to upload image');
    }
  }

  // Fetch post details for editing
  useEffect(() => {
    fetch(`${API_URL}/post/${id}`)
      .then((response) => response.json())
      .then((postInfo) => {
        setTitle(postInfo.title);
        setSummary(postInfo.summary);
        setContent(postInfo.content);
        setCategory(postInfo.category);
        setFileUrl(postInfo.fileUrl); // Set existing file URL
      });
  }, [id, API_URL]);

  // Handle post edit submission
  async function handleEditPost(e) {
    e.preventDefault();

    setLoading(true); // Start loading spinner

    try {
      let updatedFileUrl = fileUrl; // Use existing file URL by default

      // If a new file is uploaded, upload it to Cloudinary
      if (file) {
        updatedFileUrl = await uploadToCloudinary(file);
      }

      // Prepare post data
      const postData = {
        id,
        title,
        summary,
        content,
        category,
        fileUrl: updatedFileUrl, // Send the file URL from Cloudinary or existing one
      };

      const response = await fetch(`${API_URL}/post`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',  // Send JSON data
          'Accept': 'application/json',
        },
        credentials: 'include', // Include cookies (for JWT)
        body: JSON.stringify(postData), // Send post data as JSON
      });

      if (response.ok) {
        toast.success('Post successfully updated!');
        setRedirect(true); // Redirect to updated post page
      } else {
        const errorData = await response.json();
        toast.error(`Error: ${errorData.message || 'Failed to update the post.'}`);
      }
    } catch (error) {
      console.error('Error updating post:', error);
      toast.error('An unexpected error occurred. Please try again later.');
    } finally {
      setLoading(false); // Stop loading spinner
    }
  }

  // If post is updated, redirect to post page
  if (redirect) {
    return <Navigate to={`/post/${id}`} />;
  }
  if (!userinfo) {
    return <Navigate to="/login" />; // Redirect to login if not logged in
  }


  // File validation (JPEG/PNG only)
  const validateFile = (file) => {
    const isValidFile = file && ['image/jpeg', 'image/png'].includes(file.type);
    if (!isValidFile) {
      toast.error('Only JPEG and PNG files are allowed');
      setFile(null); // Clear invalid file
    }
    return isValidFile;
  };

  return (
    <div className="min-h-screen flex items-center justify-center pb-20 bg-white dark:bg-gray-900">
      <form
        className="w-full max-w-4xl bg-white dark:bg-gray-800 shadow-md rounded-lg p-6"
        onSubmit={handleEditPost}
      >
        <div className="mb-6">
          <input
            type="text"
            id="title"
            placeholder="Enter post title"
            value={title}
            required
            onChange={(e) => setTitle(e.target.value)}
            className="mt-6 w-full p-3 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div className="mb-6">
          <input
            type="text"
            id="summary"
            placeholder="Enter post summary"
            value={summary}
            required
            onChange={(e) => setSummary(e.target.value)}
            className="mt-2 w-full p-3 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div className="mb-6">
          <select
            id="category"
            value={category}
            required
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-700 dark:text-white"
          >
            <option value="" disabled>
              Please select a category
            </option>
            <option value="Technology">Technology</option>
            <option value="Design">Design</option>
            <option value="Sports">Sports</option>
          </select>
        </div>

        {/* Display current image */}
        {fileUrl && (
          <div className="mb-6">
            <img src={fileUrl} alt="Current" className="w-32 h-32 object-cover rounded-md" />
            <button
              type="button"
              onClick={() => setFileUrl('')} // Clear the fileUrl if user removes image
              className="text-red-500 mt-2"
            >
              Remove Image
            </button>
          </div>
        )}

        {/* File Upload */}
        <div className="mb-10">
          <input
            type="file"
            onChange={(e) => {
              const selectedFile = e.target.files?.[0];
              if (validateFile(selectedFile)) {
                setFile(selectedFile);
              }
            }}
            className="mt-2 w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div className="mb-2 h-96">
          <ReactQuill
            value={content}
            onChange={(newValue) => setContent(newValue)}
            modules={modules}
            formats={formats}
            theme="snow"
            className="mt-2 h-80 dark:text-white dark:quill-toolbar-dark"
            required
          />
        </div>

        {/* Loading Spinner */}
        {loading && <div className="text-center my-4">Uploading...</div>}

        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-blue-700 dark:hover:bg-blue-800"
        >
          Update Post
        </button>
      </form>
    </div>
  );
}

export default EditPost;
