import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Modetoggle from './components/Modetoggle'; // Import the mode toggle component
import { UserContext } from './context/UserContext';

const Navbar = () => {
  const { userinfo, setUserinfo } = useContext(UserContext);

  useEffect(() => {
    fetch(`${process.env.React_APP_BACKEND_BASEURL}/profile`, {
      credentials: 'include',
    }).then((response) => {
      response.json().then((userInfo) => {
        setUserinfo(userInfo);
      });
    });
  }, []);

  function logout() {
    fetch(`${process.env.React_APP_BACKEND_BASEURL}/logout`, {
      credentials: 'include',
      method: 'POST',
    });
    setUserinfo(null);
  }

  const username = userinfo?.username;

  return (
    <header className="border-b m-4 pb-2 dark:border-gray-700 dark:bg-gray-800">
      <div className="flex h-16 items-center justify-evenly ">
        {/* Blog Title */}
        <Link
          to="/"
          className="  text-3xl font-bold text-gray-800 dark:text-gray-200 "
        >
          MyBlog
        </Link>

        {/* Right Section */}
        <div className="flex  items-center gap-4">
          {/* Mode Toggle */}
          <Modetoggle />
          {username && (
            <>
              <Link
                to="/createpost"
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition dark:border-gray-700 dark:hover:bg-gray-800 dark:text-gray-200"
              >
                Create New Post
              </Link>
              <a
                onClick={logout}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition dark:border-gray-700 dark:hover:bg-gray-800 dark:text-gray-200 cursor-pointer"
              >
                LogOut
              </a>
            </>
          )}
          {!username && (
            <>
              <Link
                to="/login"
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition dark:border-gray-700 dark:hover:bg-gray-800 dark:text-gray-200"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition dark:border-gray-700 dark:hover:bg-gray-800 dark:text-gray-200"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
