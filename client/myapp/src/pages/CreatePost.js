import React, { useState, useContext } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { UserContext } from '../context/UserContext';



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


function CreatePost() {
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [file,setFile]= useState(null);
  const [category, setCategory] = useState('');
  const [redirect,setRedirect]= useState(false);
  const { userinfo } = useContext(UserContext);

  const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dtxn91sys/image/upload"; // Replace YOUR_CLOUD_NAME



  async function createNewPost(e){
    e.preventDefault();
    try {
      // Upload file to Cloudinary
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'blogimages');
      formData.append('cloud_name','dtxn91sys')

      const cloudinaryResponse = await fetch(CLOUDINARY_URL, {
        method: 'POST',
        body: formData,
      });

      if (!cloudinaryResponse.ok) {
        throw new Error('Error uploading file to Cloudinary');
      }

      const cloudinaryData = await cloudinaryResponse.json();
      const fileUrl = cloudinaryData.secure_url; // Get the file's URL

      console.log('File uploaded to Cloudinary:', fileUrl);

      // Send post data to your backend
      const postData = {
        title,
        summary,
        content,
        fileUrl, // Use the Cloudinary URL for the file
        category,
      };

      const response = await fetch(`${process.env.REACT_APP_BACKEND_BASEURL}/post`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(postData),
      });

      if (response.ok) {
        toast.success("Post is successfully created!");
        setRedirect(true);
      } else {
        toast.error("Error creating post");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Something went wrong");
    }
  }

  if (redirect) {
    return <Navigate to={'/'} />;
  }
  if (!userinfo) {
    return <Navigate to="/login" />; // Redirect to login if not logged in
  }

  return (
    <div className="min-h-screen flex items-center justify-center pb-20 bg-white dark:bg-gray-900">
      <form
        className="w-full max-w-4xl bg-white dark:bg-gray-800 shadow-md rounded-lg p-6"
        onSubmit={createNewPost}
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
        
        <div className="mb-10">
         
          <input
            type="file"
            required
            onChange={e=>setFile(e.target.files[0])}
            className="mt-2 w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div className="mb-2 h-96">
          
          <ReactQuill
           
            value={content}
            onChange={newValue => setContent(newValue)}
            modules={modules}
            formats={formats}
            theme="snow"
            className="mt-2 h-80 dark:text-white dark:quill-toolbar-dark"
            required
          />
        </div>

        
        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-blue-700 dark:hover:bg-blue-800"
        >
          Create Post
        </button>
      </form>
    </div>
  );
}

export default CreatePost;


