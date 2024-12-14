import React, { useContext, useEffect, useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';


const formatDate = (createdAt) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  const date = new Date(createdAt);
  return date.toLocaleDateString('en-US', options);
};

const CreatePostPage = () => {
    const { id } = useParams();
    const [postInfo, setPostInfo] = useState(null);
    const { userinfo } = useContext(UserContext);
  
    useEffect(() => {
      fetch(`${process.env.React_APP_BACKEND_BASEURL}/post/${id}`).then(response => {
        response.json().then(postinfo => {
          setPostInfo(postinfo);
        });
      });
    }, [id]);
  
    if (!postInfo) return <div>Loading...</div>;
    if (!userinfo) {
      return <Navigate to="/login" />; 
    }
  
    const formattedDate = formatDate(postInfo.createdAt);
  
    return (
      <div className="min-h-screen py-8 px-4 sm:px-8 dark:bg-gray-900 dark:text-white">
        <div className="max-w-4xl mx-auto rounded-lg shadow-lg p-6 dark:bg-gray-800 space-y-4">
          <h1 className="mt-4 text-6xl font-bold text-gray-900 dark:text-gray-100">
            {postInfo.title}
          </h1>
  
          <div className="pt-4 font-semibold text-xl text-gray-700 dark:text-gray-300">
            <span>Author: </span>
            <span>{postInfo.author.username}</span>
          </div>
  
          <div className="text-lg text-gray-600 dark:text-gray-400">
            <span className="font-semibold">Category: </span>
            <span className="font-semibold">{postInfo.category}</span>
          </div>
  
          <div className="text-gray-700 dark:text-gray-500">
            <span>Published: </span>
            <span>{formattedDate}</span>
          </div>
  
          {userinfo && userinfo.id === postInfo.author._id && ( // Add null check here
            <div className="mt-4">
              <Link to={`/editpost/${postInfo._id}`}>
                <button
                  className="px-6 py-2 text-lg font-semibold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 transition duration-200 ease-in-out dark:bg-blue-500 dark:hover:bg-blue-400 dark:text-gray-100"
                >
                  Edit
                </button>
              </Link>
            </div>
          )}
  
          <img
            src={postInfo.cover}
            alt="Post Cover"
            className="pt-4 w-full object-cover rounded-lg"
            style={{ maxHeight: '400px' }}
          />
  
          <div className="pt-4 prose lg:prose-xl text-gray-900 dark:text-gray-300 dark:prose-dark">
            <div dangerouslySetInnerHTML={{ __html: postInfo.content }} />
          </div>
  
          <div className="flex justify-center items-center pt-10 pb-2">
            <span className="w-2 h-2 bg-gray-400 dark:bg-gray-600 rounded-full mx-1"></span>
            <span className="w-2 h-2 bg-gray-400 dark:bg-gray-600 rounded-full mx-1"></span>
            <span className="w-2 h-2 bg-gray-400 dark:bg-gray-600 rounded-full mx-1"></span>
          </div>
        </div>
      </div>
    );
  };
  
  export default CreatePostPage;

