// src/components/NotFound.js

import React from 'react';
import { Link } from 'react-router-dom';

const PageNotFound = () => {
 
    return (
        <div className="min-h-screen flex flex-col items-center justify-top bg-white dark:bg-gray-800 text-center pt-40">
          <h1 className="text-lg  text-gray-600 dark:text-white mb-4">Page Not Found</h1>
          <h2 className="text-9xl font-bold text-gray-800 dark:text-gray-100 mb-6">404</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            Oops! The page you're looking for doesn't exist.
          </p>
          <Link
            to="/"
            className="text-xl text-blue-500 hover:underline dark:text-blue-400"
          >
            Go Back to Homepage
          </Link>
        </div>
      );
};

export default PageNotFound;
